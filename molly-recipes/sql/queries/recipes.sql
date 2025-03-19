-- name: CreateRecipe :one
INSERT INTO recipes(
    id, 
    recipe_url, 
    title, 
    description, 
    cooking_method, 
    category, 
    image_url, 
    prep_time_minutes, 
    prep_time_string, 
    cook_time_minutes, 
    cook_time_string,
    total_time_minutes,
    total_time_string,
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
        $12,
        NOW()
    ) RETURNING *;

-- name: GetRecipeByURL :one
SELECT * FROM recipes WHERE recipe_url=$1;
