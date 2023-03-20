import type { Request, Response } from "express";
import type { User } from "@chessu/types";
import xss from "xss";

import { activeGames } from "../db/models/game.model.js";
import { io } from "../server.js";

export const getCurrentSession = async (req: Request, res: Response) => {
    try {
        if (req.session.user) {
            res.status(200).json(req.session.user);
        } else {
            res.status(204).end();
        }
    } catch (err: unknown) {
        console.log(err);
        res.status(500).end();
    }
};

export const guestSession = async (req: Request, res: Response) => {
    try {
        const name = xss(req.body.name);

        const pattern = /^[A-Za-z0-9]+$/;

        if (!pattern.test(name)) {
            res.status(400).end();
            return;
        }

        if (!req.session.user || !req.session.user?.id) {
            // create guest session
            const user: User = {
                id: req.session.id,
                name
            };
            req.session.user = user;
        } else if (typeof req.session.user.id === "string" && req.session.user.name !== name) {
            // update guest name
            req.session.user.name = name;

            const game = activeGames.find(
                (g) =>
                    g.white?.id === req.session.user.id ||
                    g.black?.id === req.session.user.id ||
                    g.observers?.find((o) => o.id === req.session.user.id)
            );
            if (game) {
                if (game.host?.id === req.session.user.id) {
                    game.host.name = name;
                }
                if (game.white?.id === req.session.user.id) {
                    game.white.name = name;
                } else if (game.black?.id === req.session.user.id) {
                    game.black.name = name;
                } else {
                    const observer = game.observers?.find((o) => o.id === req.session.user.id);
                    if (observer) {
                        observer.name = name;
                    }
                }
                io.to(game.code as string).emit("receivedLatestGame", game);
            }
        }
        req.session.save(() => {
            res.status(201).json(req.session.user);
        });
    } catch (err: unknown) {
        console.log(err);
        res.status(500).end();
    }
};

export const logoutSession = async (req: Request, res: Response) => {
    try {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } catch (err: unknown) {
        console.log(err);
        res.status(500).end();
    }
};
