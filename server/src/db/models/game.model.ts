import { db } from "../index.js";
import type { Game, User } from "@chessu/types";

export const activeGames: Array<Game> = [];

// todo: join user and game relationship

export const create = async (game: Game) => {
    try {
        const white: User = {};
        const black: User = {};
        if (typeof game.white?.id === "string") {
            white.name = game.white?.name;
        } else {
            white.id = game.white?.id;
        }
        if (typeof game.black?.id === "string") {
            black.name = game.black?.name;
        } else {
            black.id = game.black?.id;
        }
        const res = await db.query(
            `INSERT INTO "game"(winner, end_reason, pgn, white_id, white_name, black_id, black_name) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [
                game.winner || null,
                game.endReason || null,
                game.pgn,
                white.id || null,
                white.name || null,
                black.id || null,
                black.name || null
            ]
        );
        return {
            id: res.rows[0].id,
            winner: res.rows[0].winner,
            endReason: res.rows[0].reason,
            pgn: res.rows[0].pgn,
            white: { id: res.rows[0].white_id, name: res.rows[0].white_name },
            black: { id: res.rows[0].black_id, name: res.rows[0].black_name }
        } as Game;
    } catch (err: unknown) {
        console.log(err);
        return null;
    }
};

export const findById = async (id: number) => {
    try {
        const res = await db.query(
            `SELECT game.id, game.winner, game.end_reason, game.pgn, white_user.id AS white_id, COALESCE(white_user.name, game.white_name) AS white_name, black_user.id AS black_id, COALESCE(black_user.name, game.black_name) AS black_name FROM game LEFT JOIN "user" white_user ON white_user.id = game.white_id LEFT JOIN "user" black_user ON black_user.id = game.black_id WHERE game.id=$1`,
            [id]
        );
        if (res.rowCount) {
            return {
                id: res.rows[0].id,
                winner: res.rows[0].winner,
                endReason: res.rows[0].end_reason,
                pgn: res.rows[0].pgn,
                white: { id: res.rows[0].white_id || null, name: res.rows[0].white_name },
                black: { id: res.rows[0].black_id || null, name: res.rows[0].black_name }
            } as Game;
        } else return null;
    } catch (err: unknown) {
        console.log(err);
        return null;
    }
};

export const findByUserId = async (id: number, limit = 10) => {
    if (id == 0) {
        return null;
    }
    try {
        const res = await db.query(
            `SELECT game.id, game.winner, game.end_reason, game.pgn, white_user.id AS white_id, COALESCE(white_user.name, game.white_name) AS white_name, black_user.id AS black_id, COALESCE(black_user.name, game.black_name) AS black_name FROM game LEFT JOIN "user" white_user ON white_user.id = game.white_id LEFT JOIN "user" black_user ON black_user.id = game.black_id WHERE white_user.id=$1 OR black_user.id=$1 LIMIT $2`,
            [id, limit]
        );
        return res.rows.map((r) => {
            return {
                id: r.id,
                winner: r.winner,
                endReason: r.end_reason,
                pgn: r.pgn,
                white: { id: r.white_id || null, name: r.white_name },
                black: { id: r.black_id || null, name: r.black_name }
            } as Game;
        });
    } catch (err: unknown) {
        console.log(err);
        return null;
    }
};

// TODO: update fields specifically, "data" string doesnt work
export const update = async (id: number, data: string) => {
    try {
        const res = await db.query(`UPDATE "game" SET $1 WHERE id = $2 RETURNING *`, [data, id]);
        return {
            id: res.rows[0].id,
            winner: res.rows[0].winner,
            endReason: res.rows[0].end_reason,
            pgn: res.rows[0].pgn,
            white: { id: res.rows[0].white_id, name: res.rows[0].white_name },
            black: { id: res.rows[0].black_id, name: res.rows[0].black_name }
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
            winner: res.rows[0].winner,
            endReason: res.rows[0].end_reason,
            pgn: res.rows[0].pgn,
            white: { id: res.rows[0].white_id, name: res.rows[0].white_name },
            black: { id: res.rows[0].black_id, name: res.rows[0].black_name }
        } as Game;
    } catch (err: unknown) {
        console.log(err);
        return null;
    }
};

const GameModel = {
    create,
    findById,
    findByUserId,
    update,
    remove
};

export default GameModel;
