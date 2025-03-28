package main

import (
	"context"
	"database/sql"
	"errors"
	"log"

	"github.com/djslade/molly-recipes/internal/database"
	pb "github.com/djslade/molly-recipes/internal/proto"
	"github.com/google/uuid"
)

func newServer(db *database.Queries, logger *log.Logger) *server {
	return &server{db: db, logger: logger}
}

func (srv *server) GetRecipeWithID(ctx context.Context, req *pb.GetRecipeWithIDRequest) (*pb.RecipeResponse, error) {
	srv.logger.Println("hello")
	srv.logger.Println(req.GetId())
	recipeID, err := uuid.Parse(req.GetId())
	if err != nil {
		return nil, ErrInvalidRecipeID
	}
	srv.logger.Println(recipeID)

	foundRecipe, err := srv.db.GetRecipeByID(ctx, recipeID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrRecipeNotFound
		}
		srv.logger.Printf("database error: %v", err.Error())
		return nil, ErrInternalServerError
	}

	recipe := pb.Recipe{
		Id:               foundRecipe.ID.String(),
		RecipeUrl:        foundRecipe.RecipeUrl,
		Title:            foundRecipe.Title,
		Description:      foundRecipe.Description,
		Cuisine:          foundRecipe.Cuisine,
		CookingMethod:    foundRecipe.CookingMethod,
		Category:         foundRecipe.Category,
		ImageUrl:         foundRecipe.ImageUrl,
		Yields:           foundRecipe.Yields,
		PrepTimeMinutes:  foundRecipe.PrepTimeMinutes,
		CookTimeMinutes:  foundRecipe.CookTimeMinutes,
		TotalTimeMinutes: foundRecipe.TotalTimeMinutes,
		Created:          foundRecipe.Created.String(),
	}

	foundIngredients, err := srv.db.GetIngredientsByRecipeID(ctx, foundRecipe.ID)
	if err != nil {
		srv.logger.Printf("database error: %v", err.Error())
		return nil, ErrInternalServerError
	}

	var ingredients []*pb.Ingredient
	for _, ing := range foundIngredients {
		ingredients = append(ingredients, &pb.Ingredient{
			Id:              ing.ID.String(),
			RecipeId:        ing.RecipeID.String(),
			FullText:        ing.FullText,
			IsOptional:      ing.IsOptional,
			Name:            ing.Name,
			Quantity:        float32(ing.Quantity),
			QuantityString:  ing.QuantityString,
			Unit:            ing.Unit,
			Size:            ing.Size,
			IngredientGroup: ing.IngredientGroup,
			Created:         ing.Created.String(),
		})
	}
	recipe.Ingredients = ingredients

	foundInstructions, err := srv.db.GetInstructionsByRecipeID(ctx, foundRecipe.ID)
	if err != nil {
		srv.logger.Printf("database error: %v", err.Error())
		return nil, ErrInternalServerError
	}

	var instructions []*pb.Instruction
	for _, inst := range foundInstructions {
		foundTimers, err := srv.db.GetTimersByInstructionID(ctx, inst.ID)
		if err != nil {
			srv.logger.Printf("database error: %v", err.Error())
			return nil, ErrInternalServerError
		}
		var timers []*pb.Timer
		for _, tmr := range foundTimers {
			timers = append(timers, &pb.Timer{
				Id:            tmr.ID.String(),
				InstructionId: tmr.InstructionID.String(),
				Value:         tmr.Value,
				Unit:          tmr.Unit,
				Created:       tmr.Created.String(),
			})
		}
		instructions = append(instructions, &pb.Instruction{
			Id:       inst.ID.String(),
			RecipeId: inst.RecipeID.String(),
			Index:    inst.Index,
			FullText: inst.FullText,
			HasTimer: inst.HasTimer,
			Timers:   timers,
			Created:  inst.Created.String(),
		})
	}
	recipe.Instructions = instructions

	return &pb.RecipeResponse{
		Recipe: &recipe,
	}, nil
}

func (srv *server) GetRecipeWithURL(ctx context.Context, req *pb.GetRecipeWithURLRequest) (*pb.RecipeIDResponse, error) {
	recipeURL, err := normalizeUrl(req.GetRecipeUrl())
	if err != nil {
		return nil, ErrInvalidRecipeURL
	}

	recipe, err := srv.db.GetRecipeByURL(ctx, recipeURL)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrRecipeNotFound
		}
		srv.logger.Printf("database error: %v", err.Error())
		return nil, ErrInternalServerError
	}

	return &pb.RecipeIDResponse{
		Id: recipe.ID.String(),
	}, nil
}

func (srv *server) CreateRecipe(ctx context.Context, req *pb.CreateRecipeRequest) (*pb.RecipeIDResponse, error) {
	reqRecipe := req.GetRecipe()

	recipeURL, err := normalizeUrl(reqRecipe.GetRecipeUrl())
	if err != nil {
		srv.logger.Printf("at recipeURL: %v", err)
		return nil, ErrInvalidRecipeURL
	}

	recipe, err := srv.db.CreateRecipe(ctx, database.CreateRecipeParams{
		RecipeUrl:        recipeURL,
		Title:            reqRecipe.GetTitle(),
		Description:      reqRecipe.GetDescription(),
		CookingMethod:    reqRecipe.GetCookingMethod(),
		Cuisine:          reqRecipe.GetCuisine(),
		Category:         reqRecipe.GetCategory(),
		ImageUrl:         reqRecipe.GetImageUrl(),
		Yields:           reqRecipe.GetYields(),
		PrepTimeMinutes:  reqRecipe.GetPrepTimeMinutes(),
		CookTimeMinutes:  reqRecipe.GetCookTimeMinutes(),
		TotalTimeMinutes: reqRecipe.GetTotalTimeMinutes(),
	})
	if err != nil {
		srv.logger.Printf("database error: %v", err.Error())
		return nil, ErrInternalServerError
	}

	for _, ingredient := range reqRecipe.GetIngredients() {
		_, err := srv.db.CreateIngredient(ctx, database.CreateIngredientParams{
			RecipeID:        recipe.ID,
			FullText:        ingredient.GetFullText(),
			IsOptional:      ingredient.GetIsOptional(),
			Name:            ingredient.GetName(),
			Quantity:        float64(ingredient.GetQuantity()),
			QuantityString:  ingredient.GetQuantityString(),
			Unit:            ingredient.GetUnit(),
			Size:            ingredient.GetSize(),
			IngredientGroup: ingredient.GetIngredientGroup(),
		})
		if err != nil {
			srv.logger.Printf("database error: %v", err.Error())
			return nil, ErrInternalServerError
		}
	}

	for _, instruction := range reqRecipe.GetInstructions() {
		newInstruction, err := srv.db.CreateInstruction(ctx, database.CreateInstructionParams{
			RecipeID: recipe.ID,
			Index:    instruction.GetIndex(),
			FullText: instruction.GetFullText(),
			HasTimer: instruction.GetHasTimer(),
		})
		if err != nil {
			srv.logger.Printf("database error: %v", err.Error())
			return nil, ErrInternalServerError
		}

		for _, timer := range instruction.GetTimers() {
			_, err := srv.db.CreateTimer(ctx, database.CreateTimerParams{
				InstructionID: newInstruction.ID,
				Unit:          timer.GetUnit(),
				Value:         timer.GetValue(),
			})
			if err != nil {
				srv.logger.Printf("database error: %v", err.Error())
				return nil, ErrInternalServerError
			}
		}
	}

	return &pb.RecipeIDResponse{Id: recipe.ID.String()}, nil
}
