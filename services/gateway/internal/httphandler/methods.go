package httphandler

import (
	"context"
	"net/http"
	"time"
)

func New(recipes RecipeClient, cache Cache) *Handler {
	return &Handler{
		recipes: recipes,
		cache:   cache,
	}
}

func (h *Handler) GetRecipe(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	id := r.PathValue("id")
	if id == "" {
		return
	}

	if rec, ok := h.cache.Get(id); ok {
		writeJSON(w, http.StatusOK, rec)
		return
	}

	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	res, err := h.recipes.GetRecipeWithId(ctx, id)
	if err != nil {
		return
	}
	h.cache.Set(id, res)

}

func (h *Handler) GetAllRecipes(w http.ResponseWriter, r *http.Request) {}
