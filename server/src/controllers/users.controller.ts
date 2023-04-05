import type { Request, Response } from "express";
import xss from "xss";

import GameModel from "../db/models/game.model.js";
import UserModel from "../db/models/user.model.js";

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const name = xss(req.params.name);

        const users = await UserModel.findByNameEmail({ name, email: name });

        if (!users || !users.length) {
            res.status(404).end();
            return;
        }

        const recentGames = await GameModel.findByUserId(users[0].id as number);

        const publicUser = {
            id: users[0].id,
            name: users[0].name,
            wins: users[0].wins,
            losses: users[0].losses,
            draws: users[0].draws
        };

        res.status(200).json({ ...publicUser, recentGames });
    } catch (err: unknown) {
        console.log(err);
        res.status(500).end();
    }
};
