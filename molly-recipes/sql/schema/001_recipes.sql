-- +goose Up
CREATE TABLE recipes(
    id UUID PRIMARY KEY,
    recipe_url TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    cooking_method TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    prep_time_minutes INT NOT NULL,
    prep_time_string TEXT NOT NULL,
    cook_time_minutes INT NOT NULL,
    cook_time_string TEXT NOT NULL,
    total_time_minutes INT NOT NULL,
    total_time_string TEXT NOT NULL,
    created TIMESTAMP NOT NULL
);

-- +goose Down
DROP TABLE recipes;
