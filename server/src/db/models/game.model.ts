import { db } from "../index.js";
import type { Game } from "@chessu/types";

export const activeGames: Array<Game> = [];

// todo: join user and game relationship

const create = async (game: Game) => {
    try {
        const res = await db.query(
            `INSERT INTO "game"(pgn, white_id, black_id, winner) VALUES($1, $2, $3, $4) RETURNING *`,
            [game.pgn || null, game.white?.id || null, game.black?.id || null, game.winner || null]
        );
        return {
            id: res.rows[0].id,
            pgn: res.rows[0].pgn,
            white: { id: res.rows[0].white_id },
            black: { id: res.rows[0].black_id },
            winner: res.rows[0].winner
        } as Game;
    } catch (err: unknown) {
        console.log(err);
        return null;
    }
};

const find = async (where?: string, limit = 1) => {
    const query = where
        ? `SELECT * FROM "game"`
        : {
              text: `SELECT * FROM "game" WHERE $1 LIMIT $2`,
              values: [where, limit]
          };

    try {
        const res = await db.query(query);
        return res.rows.map((r) => {
            return {
                id: r.id,
                pgn: r.pgn,
                white: { id: r.white_id },
                black: { id: r.black_id },
                winner: r.winner
            } as Game;
        });
    } catch (err: unknown) {
        console.log(err);
        return null;
    }
};

const update = async (id: number, data: string) => {
    try {
        const res = await db.query(`UPDATE "game" SET $1 WHERE id = $2 RETURNING *`, [data, id]);
        return {
            id: res.rows[0].id,
            pgn: res.rows[0].pgn,
            white: { id: res.rows[0].white_id },
            black: { id: res.rows[0].black_id },
            winner: res.rows[0].winner
        } as Game;
    } catch (err: unknown) {
        console.log(err);
        return null;
    }
};

const remove = async (id: number) => {
    try {
        const res = await db.query(`DELETE FROM "game" WHERE id = $1 RETURNING *`, [id]);
        return {
            id: res.rows[0].id,
            pgn: res.rows[0].pgn,
            white: { id: res.rows[0].white_id },
            black: { id: res.rows[0].black_id },
            winner: res.rows[0].winner
        } as Game;
    } catch (err: unknown) {
        console.log(err);
        return null;
    }
};

export const GameModel = {
    create,
    find,
    update,
    remove
};
