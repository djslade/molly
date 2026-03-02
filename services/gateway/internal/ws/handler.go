package ws

import (
	"context"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type Publisher interface {
	SendScraperRequest(ctx context.Context, recipeUrl string) error
}

type RecipeService interface {
	GetRecipeWithUrl(ctx context.Context, url string) (string, error)
}

type Handler struct {
	hub           *Hub
	publisher     Publisher
	recipeService RecipeService
}

type payload struct {
	URL string `json:"url"`
}

type startMessage struct {
	Event   string  `json:"event"`
	Payload payload `json:"payload"`
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func NewHandler(hub *Hub, publisher Publisher, recipeService RecipeService) *Handler {
	return &Handler{
		hub:           hub,
		publisher:     publisher,
		recipeService: recipeService,
	}
}

func (h *Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	var msg startMessage
	if err := conn.ReadJSON(&msg); err != nil {
		conn.Close()
		return
	}

	recipeUrl := msg.Payload.URL

	if recipeUrl == "" {
		conn.Close()
		return
	}

	h.hub.Register(recipeUrl, conn)
	defer h.hub.Remove(recipeUrl, conn)

	recipeId, err := h.recipeService.GetRecipeWithUrl(r.Context(), recipeUrl)
	if recipeId != "" {
		h.hub.Send(msg.Payload.URL, recipeId)
		return
	}

	h.publisher.SendScraperRequest(r.Context(), recipeUrl)

	for {
		if _, _, err := conn.ReadMessage(); err != nil {
			return
		}
	}
}
