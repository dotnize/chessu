import { db } from "../index.js";
import type { Game } from "@chessu/types";

export const activeGames: Array<Game> = [];

// todo: join user and game relationship

export const create = async (game: Game) => {
    try {
        const res = await db.query(
            `INSERT INTO "game"(code, winner, end_reason, pgn, white_id, white_guest_name, black_id, black_guest_name) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [
                game.code || null,
                game.winner || null,
                game.endReason || null,
                game.pgn,
                game.white?.id || null,
                game.white?.name || null,
                game.black?.id || null,
                game.black?.name || null
            ]
        );
        return {
            id: res.rows[0].id,
            code: res.rows[0].code,
            winner:
                res.rows[0].winner_id === res.rows[0].white_id
                    ? "white"
                    : res.rows[0].winner_id === res.rows[0].black_id
                    ? "black"
                    : "draw",
            reason: res.rows[0].reason,
            pgn: res.rows[0].pgn,
            host: { id: res.rows[0].host_id },
            white: { id: res.rows[0].white_id, name: res.rows[0].white_guest_name },
            black: { id: res.rows[0].black_id, name: res.rows[0].black_guest_name }
        } as Game;
    } catch (err: unknown) {
        console.log(err);
        return null;
    }
};

export const find = async (where?: string, limit = 1) => {
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

export const update = async (id: number, data: string) => {
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

export const remove = async (id: number) => {
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

const GameModel = {
    create,
    find,
    update,
    remove
};

export default GameModel;
