package main

import "errors"

var (
	ErrInvalidRecipeURL    error = errors.New("recipe URL is invalid")
	ErrRecipeNotFound      error = errors.New("recipe with supplied URL not found in database")
	ErrInternalServerError error = errors.New("the server encountered an internal error and could not resolve the request")
)
