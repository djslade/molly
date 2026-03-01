package httphandler

import (
	"context"

	"github.com/djslade/molly/internal/recipes"
)

type RecipeClient interface {
	GetRecipeWithId(ctx context.Context, id string) (*recipes.Recipe, error)
}

type Cache interface {
	Get(id string) (*recipes.Recipe, bool)
	Set(id string, r *recipes.Recipe)
}

type Handler struct {
	recipes RecipeClient
	cache   Cache
}
