import type { User } from "@chessu/types";
import { hash, verify } from "argon2";
import type { Request, Response } from "express";
import xss from "xss";

import { activeGames } from "../db/models/game.model.js";
import UserModel from "../db/models/user.model.js";
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
        if (req.session.user?.id && typeof req.session.user.id === "number") {
            res.status(403).end();
            return;
        }
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

export const registerUser = async (req: Request, res: Response) => {
    try {
        if (req.session.user?.id && typeof req.session.user.id === "number") {
            res.status(403).end();
            return;
        }

        const name = xss(req.body.name);
        const email = xss(req.body.email);
        const password = await hash(req.body.password);

        const pattern = /^[A-Za-z0-9]+$/;

        if (!pattern.test(name)) {
            res.status(400).end();
            return;
        }

        const compareEmail = email || name;
        const duplicateUsers = await UserModel.findByNameEmail({ name, email: compareEmail });
        if (duplicateUsers && duplicateUsers.length) {
            const dupl = duplicateUsers[0].name === name ? "Username" : "Email";
            res.status(409).json({ message: `${dupl} is already in use.` });
            return;
        }

        const newUser = await UserModel.create({ name, email }, password);
        if (!newUser) {
            throw new Error("Failed to create user");
        }

        const publicUser = {
            id: newUser.id,
            name: newUser.name
        };
        if (req.session.user?.id && typeof req.session.user.id === "string") {
            const game = activeGames.find(
                (g) =>
                    g.white?.id === req.session.user.id ||
                    g.black?.id === req.session.user.id ||
                    g.observers?.find((o) => o.id === req.session.user.id)
            );
            if (game) {
                if (game.host?.id === req.session.user.id) {
                    game.host = publicUser;
                }
                if (game.white && game.white?.id === req.session.user.id) {
                    game.white = publicUser;
                } else if (game.black && game.black?.id === req.session.user.id) {
                    game.black = publicUser;
                } else {
                    const observer = game.observers?.find((o) => o.id === req.session.user.id);
                    if (observer) {
                        observer.id = publicUser.id;
                        observer.name = publicUser.name;
                    }
                }
                io.to(game.code as string).emit("receivedLatestGame", game);
            }
        }

        req.session.user = newUser;
        req.session.save(() => {
            res.status(201).json(req.session.user);
        });
    } catch (err: unknown) {
        console.log(err);
        res.status(500).end();
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        if (req.session.user?.id && typeof req.session.user.id === "number") {
            res.status(403).end();
            return;
        }

        const nameOrEmail = xss(req.body.name);
        const password = req.body.password;

        const users = await UserModel.findByNameEmail(
            { name: nameOrEmail, email: nameOrEmail },
            true
        );
        if (!users || !users.length) {
            res.status(404).json({ message: "Invalid username/email." });
            return;
        }

        const validPassword = await verify(users[0].password as string, password);
        if (!validPassword) {
            res.status(401).json({ message: "Invalid password." });
            return;
        }

        const publicUser = {
            id: users[0].id,
            name: users[0].name
        };

        if (req.session.user?.id && typeof req.session.user.id === "string") {
            const game = activeGames.find(
                (g) =>
                    g.white?.id === req.session.user.id ||
                    g.black?.id === req.session.user.id ||
                    g.observers?.find((o) => o.id === req.session.user.id)
            );
            if (game) {
                if (game.host?.id === req.session.user.id) {
                    game.host = publicUser;
                }
                if (game.white && game.white?.id === req.session.user.id) {
                    game.white = publicUser;
                } else if (game.black && game.black?.id === req.session.user.id) {
                    game.black = publicUser;
                } else {
                    const observer = game.observers?.find((o) => o.id === req.session.user.id);
                    if (observer) {
                        observer.id = publicUser.id;
                        observer.name = publicUser.name;
                    }
                }
                io.to(game.code as string).emit("receivedLatestGame", game);
            }
        }

        req.session.user = {
            id: users[0].id,
            name: users[0].name,
            email: users[0].email,
            wins: users[0].wins,
            losses: users[0].losses,
            draws: users[0].draws
        };
        req.session.save(() => {
            res.status(200).json(req.session.user);
        });
    } catch (err: unknown) {
        console.log(err);
        res.status(500).end();
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        if (!req.session.user?.id || typeof req.session.user.id === "string") {
            res.status(403).end();
            return;
        }

        if (!req.body.name && !req.body.email && !req.body.password) {
            res.status(400).end();
            return;
        }

        const name = xss(req.body.name || req.session.user.name);
        const pattern = /^[A-Za-z0-9]+$/;
        if (!pattern.test(name)) {
            res.status(400).end();
            return;
        }

        const email = xss(req.body.email || req.session.user.email);
        const compareEmail = email || name;

        const duplicateUsers = await UserModel.findByNameEmail({ name, email: compareEmail });
        if (
            duplicateUsers &&
            duplicateUsers.length &&
            duplicateUsers[0].id !== req.session.user.id
        ) {
            const dupl = duplicateUsers[0].name === name ? "Username" : "Email";
            res.status(409).json({ message: `${dupl} is already in use.` });
            return;
        }

        let password: string | undefined = undefined;
        if (req.body.password) {
            password = await hash(req.body.password);
        }

        const updatedUser = await UserModel.update(req.session.user.id, { name, email, password });

        if (!updatedUser) {
            throw new Error("Failed to update user");
        }

        const publicUser = {
            id: updatedUser.id,
            name: updatedUser.name
        };

        const game = activeGames.find(
            (g) =>
                g.white?.id === req.session.user.id ||
                g.black?.id === req.session.user.id ||
                g.observers?.find((o) => o.id === req.session.user.id)
        );
        if (game) {
            if (game.host?.id === req.session.user.id) {
                game.host = publicUser;
            }
            if (game.white && game.white?.id === req.session.user.id) {
                game.white = publicUser;
            } else if (game.black && game.black?.id === req.session.user.id) {
                game.black = publicUser;
            } else {
                const observer = game.observers?.find((o) => o.id === req.session.user.id);
                if (observer) {
                    observer.id = publicUser.id;
                    observer.name = publicUser.name;
                }
            }
            io.to(game.code as string).emit("receivedLatestGame", game);
        }

        req.session.user = updatedUser;
        req.session.save(() => {
            res.status(200).json(req.session.user);
        });
    } catch (err: unknown) {
        console.log(err);
        res.status(500).end();
    }
};
