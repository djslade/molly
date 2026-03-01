package recipes

import (
	"context"
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

type RecipeClient interface {
	GetRecipeWithId(ctx context.Context, id string) (*Recipe, error)
}

type Cache interface {
	Get(id string) (*Recipe, bool)
	Set(id string, r *Recipe)
}

type Handler struct {
	recipes RecipeClient
	cache   Cache
}

func (h *Handler) ImportRecipe(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer ws.Close()
}
