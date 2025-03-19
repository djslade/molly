package main

import "net/http"

func (app *application) routes() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("POST /recipes", app.handlerCreateRecipe)
	mux.HandleFunc("GET /recipes/url", app.handlerGetRecipeByURL)

	return mux
}
