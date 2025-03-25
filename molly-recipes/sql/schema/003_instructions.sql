-- +goose Up
CREATE TABLE instructions(
    id UUID PRIMARY KEY,
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    index INT NOT NULL,
    full_text TEXT NOT NULL,
    has_timer BOOLEAN NOT NULL,
    created TIMESTAMP NOT NULL
);

-- +goose Down
DROP TABLE instructions;