-- +goose Up
CREATE TABLE timers(
    id UUID PRIMARY KEY,
    instruction_id UUID NOT NULL REFERENCES instructions(id) ON DELETE CASCADE,
    unit TEXT NOT NULL,
    value INT NOT NULL,
    created TIMESTAMP NOT NULL
);

-- +goose Down
DROP TABLE timers;
