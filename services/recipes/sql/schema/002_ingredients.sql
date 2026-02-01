-- +goose Up
CREATE TABLE ingredients(
    id UUID PRIMARY KEY,
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    full_text TEXT NOT NULL,
    is_optional BOOLEAN NOT NULL,
    name TEXT NOT NULL,
    quantity FLOAT NOT NULL,
    quantity_string TEXT NOT NULL,
    unit TEXT NOT NULL,
    size TEXT NOT NULL,
    ingredient_group TEXT NOT NULL,
    created TIMESTAMP NOT NULL
);

-- +goose Down
DROP TABLE ingredients;
