package recipes

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

type RecipeClient interface {
	GetRecipe(ctx context.Context, id string) (*Recipe, error)
}

type Recipe struct{}

type Cache interface {
	Get(id string) (*Recipe, bool)
}

type Handler struct {
	recipes RecipeClient
	cache   Cache
}

func (h *Handler) GetRecipe(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	id := r.PathValue("id")
	if id == "" {
		return
	}

	if rec, ok := h.cache.Get(id); ok {
		return
	}

	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	res, err := h.recipes.GetRecipe(ctx, id)
	if err != nil {
		return
	}

	h.cache.Set(id, res)

}

func (h *Handler) GetAllRecipes(w http.ResponseController, r *http.Request) {}

func (h *Handler) ImportRecipe(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer ws.Close()
}
