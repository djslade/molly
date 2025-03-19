-- name: CreateTimer :one
INSERT INTO timers(id, instruction_id, unit, value, created)
VALUES (GEN_RANDOM_UUID(), $1, $2, $3, NOW())
RETURNING *;

-- name: GetTimersByInstructionID :many
SELECT * FROM timers WHERE instruction_id=$1;
