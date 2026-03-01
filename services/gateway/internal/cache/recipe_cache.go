package cache

import (
	"sync"

	"github.com/djslade/molly/internal/recipes"
)

type MemoryCache struct {
	mu sync.RWMutex
	m  map[string]*recipes.Recipe
}

func New() *MemoryCache {
	return &MemoryCache{
		m: make(map[string]*recipes.Recipe),
	}
}

func (c *MemoryCache) Get(id string) (*recipes.Recipe, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()

	r, ok := c.m[id]
	return r, ok
}

func (c *MemoryCache) Set(id string, r *recipes.Recipe) {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.m[id] = r
}
