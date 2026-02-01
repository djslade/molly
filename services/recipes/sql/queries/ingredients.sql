-- name: CreateIngredient :one
INSERT INTO ingredients(id, recipe_id, full_text, is_optional, name, quantity, quantity_string, unit, size, ingredient_group, created)
VALUES (GEN_RANDOM_UUID(), $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
RETURNING *;

-- name: GetIngredientsByRecipeID :many
SELECT * FROM ingredients WHERE recipe_id=$1;