package main

import (
	"database/sql"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/djslade/molly-recipes/internal/database"
	"github.com/google/uuid"
)

type timer struct {
	ID            uuid.UUID `json:"id"`
	InstructionID uuid.UUID `json:"recipe_id"`
	Value         int32     `json:"value"`
	Unit          string    `json:"unit"`
}

type instruction struct {
	ID       uuid.UUID `json:"id"`
	RecipeID uuid.UUID `json:"recipe_id"`
	Index    int32     `json:"index"`
	FullText string    `json:"full_text"`
	Timers   []timer   `json:"timers"`
}

type ingredient struct {
	ID         uuid.UUID `json:"id"`
	RecipeID   uuid.UUID `json:"recipe_id"`
	FullText   string    `json:"full_text"`
	IsOptional bool      `json:"is_optional"`
	Name       string    `json:"name"`
	Quantity   string    `json:"quantity"`
	Unit       string    `json:"unit"`
	Size       string    `json:"size"`
}

type recipe struct {
	ID               uuid.UUID     `json:"recipe_id"`
	RecipeURL        string        `json:"recipe_url"`
	Title            string        `json:"title"`
	Description      string        `json:"description"`
	Cuisine          string        `json:"cuisine"`
	CookingMethod    string        `json:"cooking_method"`
	Category         string        `json:"category"`
	ImageURL         string        `json:"image_url"`
	Yields           string        `json:"yields"`
	PrepTimeMinutes  int32         `json:"prep_time_minutes"`
	PrepTimeString   string        `json:"prep_time"`
	CookTimeMinutes  int32         `json:"cook_time_minutes"`
	CookTimeString   string        `json:"cook_time"`
	TotalTimeMinutes int32         `json:"total_time_minutes"`
	TotalTimeString  string        `json:"total_time"`
	Ingredients      []ingredient  `json:"ingredients"`
	Instructions     []instruction `json:"instructions"`
}

func (app *application) handlerCreateRecipe(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	params := recipe{}
	if err := decoder.Decode(&params); err != nil {
		app.logger.Println(err)
		app.clientError(w, http.StatusUnprocessableEntity, errors.New("could not process request body"))
		return
	}
	normalizedURL, err := app.normalizeUrl(params.RecipeURL)
	if err != nil {
		app.logger.Println(err)
		app.clientError(w, http.StatusUnprocessableEntity, errors.New("recipe URL may not be valid"))
		return
	}
	params.RecipeURL = normalizedURL

	// TODO: Validate the params object
	recipe, err := app.db.CreateRecipe(r.Context(), database.CreateRecipeParams{
		RecipeUrl:        params.RecipeURL,
		Title:            params.Title,
		Description:      params.Description,
		CookingMethod:    params.CookingMethod,
		Category:         params.Category,
		ImageUrl:         params.ImageURL,
		PrepTimeMinutes:  params.PrepTimeMinutes,
		PrepTimeString:   params.PrepTimeString,
		CookTimeMinutes:  params.CookTimeMinutes,
		CookTimeString:   params.CookTimeString,
		TotalTimeMinutes: params.TotalTimeMinutes,
		TotalTimeString:  params.TotalTimeString,
	})
	if err != nil {
		app.serverError(w, err)
		return
	}

	res := params

	for i, ingredient := range res.Ingredients {
		ing, err := app.db.CreateIngredient(r.Context(), database.CreateIngredientParams{
			RecipeID:   recipe.ID,
			FullText:   ingredient.FullText,
			IsOptional: ingredient.IsOptional,
			Name:       ingredient.Name,
			Quantity:   ingredient.Quantity,
			Unit:       ingredient.Unit,
			Size:       ingredient.Size,
		})
		if err != nil {
			app.serverError(w, err)
			return
		}
		res.Ingredients[i].ID = ing.ID
		res.Ingredients[i].RecipeID = ing.RecipeID
	}

	for i, instruction := range res.Instructions {
		inst, err := app.db.CreateInstruction(r.Context(), database.CreateInstructionParams{
			RecipeID: recipe.ID,
			Index:    instruction.Index,
			FullText: instruction.FullText,
		})
		if err != nil {
			app.serverError(w, err)
			return
		}

		for j, timer := range instruction.Timers {
			tmr, err := app.db.CreateTimer(r.Context(), database.CreateTimerParams{
				InstructionID: inst.ID,
				Unit:          timer.Unit,
				Value:         timer.Value,
			})
			if err != nil {
				app.serverError(w, err)
				return
			}
			res.Instructions[i].Timers[j].ID = tmr.ID
			res.Instructions[i].Timers[j].InstructionID = tmr.InstructionID
		}
		res.Instructions[i].ID = inst.ID
		res.Instructions[i].RecipeID = inst.RecipeID
	}

	app.logger.Print(res)

	app.writeJSON(w, http.StatusCreated, res, nil)
}

func (app *application) handlerGetRecipeByURL(w http.ResponseWriter, r *http.Request) {
	recipeURL := r.URL.Query().Get("url")
	if recipeURL == "" {
		app.clientError(w, http.StatusBadRequest, errors.New("request is missing a url query parameter"))
		return
	}
	normalizedURL, err := app.normalizeUrl(recipeURL)
	if err != nil {
		app.clientError(w, http.StatusBadRequest, errors.New("the url query parameter may not be a valid URL"))
		return
	}
	foundRecipe, err := app.db.GetRecipeByURL(r.Context(), normalizedURL)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			app.clientError(w, http.StatusNotFound, errors.New("recipe not found"))
			return
		}
		app.serverError(w, err)
		return
	}
	res := recipe{
		ID:               foundRecipe.ID,
		RecipeURL:        foundRecipe.RecipeUrl,
		Title:            foundRecipe.Title,
		Description:      foundRecipe.Description,
		CookingMethod:    foundRecipe.CookingMethod,
		Category:         foundRecipe.Category,
		ImageURL:         foundRecipe.ImageUrl,
		PrepTimeMinutes:  foundRecipe.PrepTimeMinutes,
		PrepTimeString:   foundRecipe.PrepTimeString,
		CookTimeMinutes:  foundRecipe.CookTimeMinutes,
		CookTimeString:   foundRecipe.CookTimeString,
		TotalTimeMinutes: foundRecipe.TotalTimeMinutes,
		TotalTimeString:  foundRecipe.TotalTimeString,
	}

	foundIngredients, err := app.db.GetIngredientsByRecipeID(r.Context(), foundRecipe.ID)
	if err != nil {
		app.serverError(w, err)
		return
	}

	var ingredients []ingredient
	for _, ing := range foundIngredients {
		ingredients = append(ingredients, ingredient{
			ID:         ing.ID,
			RecipeID:   ing.RecipeID,
			FullText:   ing.FullText,
			IsOptional: ing.IsOptional,
			Name:       ing.Name,
			Quantity:   ing.Quantity,
			Unit:       ing.Unit,
			Size:       ing.Size,
		})
	}
	res.Ingredients = ingredients

	foundInstructions, err := app.db.GetInstructionsByRecipeID(r.Context(), foundRecipe.ID)
	if err != nil {
		app.serverError(w, err)
		return
	}

	var instructions []instruction
	for _, inst := range foundInstructions {
		foundTimers, err := app.db.GetTimersByInstructionID(r.Context(), inst.ID)
		if err != nil {
			app.serverError(w, err)
			return
		}
		var timers []timer
		for _, tmr := range foundTimers {
			timers = append(timers, timer{
				ID:            tmr.ID,
				InstructionID: tmr.InstructionID,
				Value:         tmr.Value,
				Unit:          tmr.Unit,
			})
		}
		instructions = append(instructions, instruction{
			ID:       inst.ID,
			RecipeID: inst.RecipeID,
			Index:    inst.Index,
			FullText: inst.FullText,
			Timers:   timers,
		})
	}
	res.Instructions = instructions

	app.writeJSON(w, http.StatusOK, res, nil)
}
