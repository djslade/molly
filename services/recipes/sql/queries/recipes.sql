-- name: CreateRecipe :one
INSERT INTO recipes(
    id, 
    recipe_url, 
    title,
    description,
    cuisine, 
    cooking_method, 
    category, 
    image_url,
    yields,
    prep_time_minutes, 
    cook_time_minutes, 
    total_time_minutes,
    created
    ) VALUES (
        GEN_RANDOM_UUID(),
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11,
        NOW()
    ) RETURNING *;

-- name: GetRecipeByURL :one
SELECT * FROM recipes WHERE recipe_url=$1;

-- name: GetRecipeByID :one
SELECT * FROM recipes WHERE id=$1;

-- name: CountRecipes :one
SELECT COUNT(id) FROM recipes;

-- name: GetRecipes :many
SELECT * FROM recipes ORDER BY created DESC LIMIT $1;

-- name: DeleteRecipe :exec
DELETE FROM recipes WHERE id=$1;
