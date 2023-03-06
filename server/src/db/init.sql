-- users
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) UNIQUE NOT NULL,
    email VARCHAR(128),
    password TEXT
);

-- games
CREATE TABLE "game" (
    id SERIAL PRIMARY KEY,
    pgn TEXT,
    white_id INT REFERENCES "user",
    black_id INT REFERENCES "user",
);