import type { Request, Response } from "express";
import { activeGames } from "../db/models/game.model.js";
import type { Game, User } from "@chessu/types";
import { nanoid } from "nanoid";

export const getActivePublicGames = async (req: Request, res: Response) => {
    try {
        res.status(200).json(activeGames.filter((g) => !g.unlisted && !g.winner));
    } catch (err: unknown) {
        console.log(err);
        res.status(500).end();
    }
};

export const getActiveGame = async (req: Request, res: Response) => {
    try {
        if (!req.params || !req.params.code) {
            res.status(400).end();
            return;
        }

        const game = activeGames.find((g) => g.code === req.params.code);

        if (!game) {
            res.status(404).end();
        } else {
            res.status(200).json(game);
        }
    } catch (err: unknown) {
        console.log(err);
        res.status(500).end();
    }
};

export const createGame = async (req: Request, res: Response) => {
    try {
        if (!req.session.user) {
            console.log("unauthorized createGame");
            res.status(401).end();
            return;
        }
        const user: User = {
            ...req.session.user,
            connected: false
        };
        const unlisted: boolean = req.body.unlisted ?? false;
        const game: Game = {
            code: nanoid(6),
            unlisted,
            host: user,
            pgn: ""
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
