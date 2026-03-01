package wshub

import (
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

type WSHub struct {
	mu    sync.RWMutex
	conns map[string]*websocket.Conn // requestID -> conn
}

type WSHandler struct {
	hub *WSHub
}

func NewHub() *WSHub {
	return &WSHub{
		conns: make(map[string]*websocket.Conn),
	}
}

func (h *WSHub) Register(requestID string, c *websocket.Conn) {
	h.mu.Lock()
	defer h.mu.Unlock()
	h.conns[requestID] = c
}

func (h *WSHub) Unregister(requestID string) {
	h.mu.Lock()
	defer h.mu.Unlock()
	delete(h.conns, requestID)
}

func (h *WSHub) Send(requestID string, v any) error {
	h.mu.RLock()
	c := h.conns[requestID]
	h.mu.RUnlock()

	if c == nil {
		return nil
	}

	return c.WriteJSON(v)
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func (h *WSHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}
	defer conn.Close()

	var msg struct {
		RequestID string `json:"request_id"`
	}

	if err := conn.ReadJSON(&msg); err != nil {
		return
	}

	if msg.RequestID == "" {
		return
	}

	h.hub.Register(msg.RequestID, conn)
	defer h.hub.Unregister(msg.RequestID)

	// keep connection alive until client closes
	for {
		if _, _, err := conn.ReadMessage(); err != nil {
			return
		}
	}
}
