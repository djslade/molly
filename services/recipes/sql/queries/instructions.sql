-- name: CreateInstruction :one
INSERT INTO instructions(id, recipe_id, index, full_text, has_timer, created)
VALUES (GEN_RANDOM_UUID(), $1, $2, $3, $4, NOW())
RETURNING *;

-- name: GetInstructionsByRecipeID :many
SELECT * FROM instructions WHERE recipe_id=$1;
