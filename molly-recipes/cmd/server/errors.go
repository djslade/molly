package main

import (
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

var (
	ErrInvalidRecipeURL error = status.Error(
		codes.InvalidArgument,
		"recipe URL is invalid",
	)
	ErrInvalidRecipeID error = status.Error(
		codes.InvalidArgument,
		"recipe ID is invalid",
	)
	ErrRecipeNotFound error = status.Error(
		codes.NotFound,
		"recipe with supplied URL not found in database",
	)
	ErrInternalServerError error = status.Error(
		codes.Internal,
		"the server encountered an internal error and could not resolve the request",
	)
)
