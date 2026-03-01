package application

import (
	"net/http"

	"github.com/djslade/molly/internal/httphandler"
	"github.com/djslade/molly/internal/ws"
)

type Application struct {
	Routes *http.ServeMux
}

func New(httpHandler httphandler.Handler, wsHandler ws.Handler) *Application {
	routes := http.NewServeMux()

	routes.HandleFunc("/recipes/:id", httpHandler.GetRecipe)
	routes.HandleFunc("/recipes", httpHandler.GetAllRecipes)

	return &Application{
		Routes: routes,
	}
}
