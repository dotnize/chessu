import pg from "pg";

export const db = new pg.Pool();

export const INIT_TABLES = /* sql */ `
    CREATE TABLE IF NOT EXISTS "user" (
        id SERIAL PRIMARY KEY,
        name VARCHAR(128) UNIQUE NOT NULL,
        email VARCHAR(128),
        password TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS "game" (
        id SERIAL PRIMARY KEY,
        code VARCHAR(8) UNIQUE NOT NULL,
        winner VARCHAR(5),
        end_reason VARCHAR(16),
        pgn TEXT,
        white_id INT REFERENCES "user",
        white_name VARCHAR(32),
        black_id INT REFERENCES "user",
        black_name VARCHAR(32)
    );
`;
