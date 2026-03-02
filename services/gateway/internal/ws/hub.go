package ws

import (
	"sync"

	"github.com/gorilla/websocket"
)

type Hub struct {
	mu    sync.RWMutex
	conns map[string]map[*websocket.Conn]struct{}
}

func NewHub() *Hub {
	return &Hub{
		conns: make(map[string]map[*websocket.Conn]struct{}),
	}
}

func (h *Hub) Register(url string, c *websocket.Conn) {
	h.mu.Lock()
	defer h.mu.Unlock()

	if h.conns[url] == nil {
		h.conns[url] = make(map[*websocket.Conn]struct{})
	}
	h.conns[url][c] = struct{}{}
}

func (h *Hub) Remove(url string, c *websocket.Conn) {
	h.mu.Lock()
	defer h.mu.Unlock()

	if m, ok := h.conns[url]; ok {
		delete(m, c)
		if len(m) == 0 {
			delete(h.conns, url)
		}
	}
}

func (h *Hub) Send(url string, v any) {
	h.mu.RLock()
	conns := h.conns[url]
	h.mu.RUnlock()

	for c := range conns {
		_ = c.WriteJSON(v)
	}
}
