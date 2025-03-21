// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: ingredients.sql

package database

import (
	"context"

	"github.com/google/uuid"
)

const createIngredient = `-- name: CreateIngredient :one
INSERT INTO ingredients(id, recipe_id, full_text, is_optional, name, quantity, unit, size, created)
VALUES (GEN_RANDOM_UUID(), $1, $2, $3, $4, $5, $6, $7, NOW())
RETURNING id, recipe_id, full_text, is_optional, name, quantity, unit, size, created
`

type CreateIngredientParams struct {
	RecipeID   uuid.UUID
	FullText   string
	IsOptional bool
	Name       string
	Quantity   string
	Unit       string
	Size       string
}

func (q *Queries) CreateIngredient(ctx context.Context, arg CreateIngredientParams) (Ingredient, error) {
	row := q.db.QueryRowContext(ctx, createIngredient,
		arg.RecipeID,
		arg.FullText,
		arg.IsOptional,
		arg.Name,
		arg.Quantity,
		arg.Unit,
		arg.Size,
	)
	var i Ingredient
	err := row.Scan(
		&i.ID,
		&i.RecipeID,
		&i.FullText,
		&i.IsOptional,
		&i.Name,
		&i.Quantity,
		&i.Unit,
		&i.Size,
		&i.Created,
	)
	return i, err
}

const getIngredientsByRecipeID = `-- name: GetIngredientsByRecipeID :many
SELECT id, recipe_id, full_text, is_optional, name, quantity, unit, size, created FROM ingredients WHERE recipe_id=$1
`

func (q *Queries) GetIngredientsByRecipeID(ctx context.Context, recipeID uuid.UUID) ([]Ingredient, error) {
	rows, err := q.db.QueryContext(ctx, getIngredientsByRecipeID, recipeID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Ingredient
	for rows.Next() {
		var i Ingredient
		if err := rows.Scan(
			&i.ID,
			&i.RecipeID,
			&i.FullText,
			&i.IsOptional,
			&i.Name,
			&i.Quantity,
			&i.Unit,
			&i.Size,
			&i.Created,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}
