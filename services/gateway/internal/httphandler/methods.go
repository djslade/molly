package httphandler

import (
	"context"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/djslade/molly/internal/recipes"
)

func New(recipes RecipeClient, cache Cache) *Handler {
	return &Handler{
		recipes: recipes,
		cache:   cache,
	}
}

func (h *Handler) GetRecipe(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	id := strings.TrimPrefix(r.URL.Path, "/recipes/")
	if id == "" {
		return
	}

	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	foundRecipe, err := h.recipes.GetRecipeWithId(ctx, id)
	if err != nil {
		return
	}

	type res struct {
		Recipe *recipes.Recipe `json:"recipe"`
	}

	writeJSON(w, http.StatusOK, res{
		Recipe: foundRecipe,
	})

}

func (h *Handler) SearchRecipes(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	queryValues := r.URL.Query()
	query := queryValues.Get("q")
	page := queryToInt32(queryValues.Get("p"), 1)
	resultsPerPage := queryToInt32(queryValues.Get("rpp"), 6)

	total, foundRecipes, err := h.recipes.SearchRecipes(ctx, query, page, resultsPerPage)
	if err != nil {
		log.Print(err)
		return
	}

	type res struct {
		Total   int32             `json:"total"`
		Recipes []*recipes.Recipe `json:"recipes"`
	}

	writeJSON(w, http.StatusOK, res{
		Total:   total,
		Recipes: foundRecipes,
	})
}

func queryToInt32(value string, fallback int32) int32 {
	v, err := strconv.ParseInt(value, 10, 32)
	if err != nil {
		return fallback
	}
	if v <= 0 {
		return fallback
	}
	return int32(v)
}
