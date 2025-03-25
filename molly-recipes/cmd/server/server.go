package main

import (
	"context"
	"database/sql"
	"errors"
	"log"

	"github.com/djslade/molly-recipes/internal/database"
	pb "github.com/djslade/molly-recipes/internal/proto"
)

func newServer(db *database.Queries, logger *log.Logger) *server {
	return &server{db: db, logger: logger}
}

func (srv *server) GetRecipeWithURL(ctx context.Context, req *pb.GetRecipeWithURLRequest) (*pb.RecipeResponse, error) {
	srv.logger.Println(req)
	recipeURL, err := normalizeUrl(req.GetRecipeUrl())
	if err != nil {
		return nil, ErrInvalidRecipeURL
	}

	foundRecipe, err := srv.db.GetRecipeByURL(ctx, recipeURL)
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
		CookingMethod:    foundRecipe.CookingMethod,
		Category:         foundRecipe.Category,
		ImageUrl:         foundRecipe.ImageUrl,
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
			Id:             ing.ID.String(),
			RecipeId:       ing.RecipeID.String(),
			FullText:       ing.FullText,
			IsOptional:     ing.IsOptional,
			Name:           ing.Name,
			Quantity:       float32(ing.Quantity),
			QuantityString: ing.QuantityString,
			Unit:           ing.Unit,
			Size:           ing.Size,
			Created:        ing.Created.String(),
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
		Status: "OK",
		Recipe: &recipe,
	}, nil
}

func (srv *server) CreateRecipe(ctx context.Context, req *pb.CreateRecipeRequest) (*pb.CreateRecipeResponse, error) {
	recipeURL, err := normalizeUrl(req.GetRecipeUrl())
	if err != nil {
		return nil, ErrInvalidRecipeURL
	}

	recipe, err := srv.db.CreateRecipe(ctx, database.CreateRecipeParams{
		RecipeUrl:        recipeURL,
		Title:            req.GetTitle(),
		Description:      req.GetDescription(),
		CookingMethod:    req.GetCookingMethod(),
		Category:         req.GetCategory(),
		ImageUrl:         req.GetImageUrl(),
		PrepTimeMinutes:  req.GetPrepTimeMinutes(),
		CookTimeMinutes:  req.GetCookTimeMinutes(),
		TotalTimeMinutes: req.GetTotalTimeMinutes(),
	})
	if err != nil {
		srv.logger.Printf("database error: %v", err.Error())
		return nil, ErrInternalServerError
	}

	for _, ingredient := range req.GetIngredients() {
		_, err := srv.db.CreateIngredient(ctx, database.CreateIngredientParams{
			RecipeID:       recipe.ID,
			FullText:       ingredient.GetFullText(),
			IsOptional:     ingredient.GetIsOptional(),
			Name:           ingredient.GetName(),
			Quantity:       float64(ingredient.GetQuantity()),
			QuantityString: ingredient.GetQuantityString(),
			Unit:           ingredient.GetUnit(),
			Size:           ingredient.GetSize(),
		})
		if err != nil {
			srv.logger.Printf("database error: %v", err.Error())
			return nil, ErrInternalServerError
		}
	}

	for _, instruction := range req.GetInstructions() {
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

	return &pb.CreateRecipeResponse{
		Status: "Created",
	}, nil
}
