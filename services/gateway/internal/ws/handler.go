package ws

import (
	"context"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type Publisher interface {
	SendScraperRequest(ctx context.Context, request any) error
}

type Handler struct {
	hub       *Hub
	publisher Publisher
}

type startMessage struct {
	URL string `json:"url"`
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func NewHandler(hub *Hub, publisher Publisher) *Handler {
	return &Handler{
		hub:       hub,
		publisher: publisher,
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

	if msg.URL == "" {
		conn.Close()
		return
	}

	h.hub.Register(msg.URL, conn)
	defer h.hub.Deregister(msg.URL, conn)

	for {
		if _, _, err := conn.ReadMessage(); err != nil {
			return
		}
	}
}
