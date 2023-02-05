import type { Request, Response } from "express";
import { activeGames } from "../db/models/game.model.js";
import type { Game, User } from "@chessu/types";
import { nanoid } from "nanoid";

export const getActiveGames = async (req: Request, res: Response) => {
    try {
        //if (!req.query || !req.query.code) {
        res.status(200).json(activeGames.filter((g) => !g.unlisted));
        //}

        // const code =
        //     (req.query.code as string).startsWith("http") ||
        //     (req.query.code as string).startsWith("ches.su")
        //         ? path.posix.basename(url.parse(req.query.code as string).pathname as string)
        //         : req.query.code;

        // console.log(code);
        // const game = activeGames.find((g) => g.code === code);

        // if (!game) {
        //     res.status(404).end();
        // } else {
        //     res.status(200).json(game);
        // }
    } catch (err: unknown) {
        console.log(err);
        res.status(500).end();
    }
};

export const createGame = async (req: Request, res: Response) => {
    try {
        if (!req.session.user) {
            console.log("unauthorized createGame:");
            console.log(req.session);
            res.status(401).end();
            return;
        }
        const user: User = req.session.user;
        const unlisted: boolean = req.body.unlisted ?? false;
        const game: Game = {
            code: nanoid(6),
            unlisted,
            host: user
        };
        if (req.body.side === "white") {
            game.white = user;
        } else if (req.body.side === "black") {
            game.black = user;
        } else {
            // random
            if (Math.floor(Math.random() * 2) === 0) {
                game.white = user;
            } else {
                game.black = user;
            }
        }
        activeGames.push(game);

        res.status(201).json({ code: game.code });
    } catch (err: unknown) {
        console.log(err);
        res.status(500).end();
    }
};

// use sockets for joining games
/*
export const joinGame = async (req: Request, res: Response) => {
    console.log("joining game!");
};
*/
