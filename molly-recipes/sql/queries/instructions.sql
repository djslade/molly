-- name: CreateInstruction :one
INSERT INTO instructions(id, recipe_id, index, full_text, created)
VALUES (GEN_RANDOM_UUID(), $1, $2, $3, NOW())
RETURNING *;

-- name: GetInstructionsByRecipeID :many
SELECT * FROM instructions WHERE recipe_id=$1;
