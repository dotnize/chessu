import { db } from "../index.js";
import type { User } from "@chessu/types";

const create = async (user: User, password: string) => {
    if (user.name === "Guest" || user.email === undefined) {
        return null;
    }

    try {
        const res = await db.query(
            `INSERT INTO "user"(name, email, password) VALUES($1, $2, $3) RETURNING id, name, email`,
            [user.name, user.email ?? null, password]
        );
        return res.rows[0] as User;
    } catch (err: unknown) {
        console.log(err);
        return null;
    }
};

const find = async (where?: string, limit = 1) => {
    // if user is not specified, get all users
    if (!where) {
        try {
            const res = await db.query(`SELECT id, name, email FROM "user"`);
            return res.rows as Array<User>;
        } catch (err: unknown) {
            console.log(err);
            return null;
        }
    }

    try {
        /* const res = await db.query(
            `SELECT id, name, email FROM "user" WHERE ${typeof user.id === "number" ? "id" : typeof user.name === "string" ? "name" : "email" } = $1 LIMIT $2`,
            [typeof user.id === "number" ? user.id : typeof user.name === "string" ? user.name : user.email, limit]
        ); */
        const res = await db.query(`SELECT id, name, email FROM "user" WHERE $1 LIMIT $2`, [
            where,
            limit
        ]);
        return res.rows as Array<User>;
    } catch (err: unknown) {
        console.log(err);
        return null;
    }
};

const update = async (id: number, data: string) => {
    if (typeof id === "string" || id === 0) {
        return null;
    }

    try {
        const res = await db.query(`UPDATE "user" SET $1 WHERE id = $2 RETURNING id, name, email`, [
            data,
            id
        ]);
        return res.rows[0] as User;
    } catch (err: unknown) {
        console.log(err);
        return null;
    }
};

const remove = async (id: number) => {
    if (typeof id === "string" || id === 0) {
        return null;
    }

    try {
        const res = await db.query(`DELETE FROM "user" WHERE id = $1 RETURNING id, name, email`, [
            id
        ]);
        return res.rows[0] as User;
    } catch (err: unknown) {
        console.log(err);
        return null;
    }
};

export const UserModel = {
    create,
    find,
    update,
    remove
};
