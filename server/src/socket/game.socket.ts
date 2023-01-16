import { activeGames } from "../db/models/game.model";
import type { Socket } from "socket.io";
import { Chess } from "chess.js";
import { io } from "../server";

export async function joinLobby(this: Socket, gameCode: string) {
    const game = activeGames.find((g) => g.code === gameCode);
    if (!game) {
        console.log(`joinLobby: Game code ${gameCode} not found.`);
        return;
    }
    if (
        !(game.white?.id === this.request.session.id || game.black?.id === this.request.session.id)
    ) {
        if (game.observers === undefined) game.observers = [];
        game.observers?.push(this.request.session.user);
    }

    if (this.rooms.size >= 2) {
        await leaveLobby.call(this);
    }

    await this.join(gameCode);
    this.emit("receivedLatestGame", game);
    io.to(game.code as string).emit("receivedLatestLobby", game);
    io.to(game.code as string).emit("userJoined", this.request.session.user.name);
}

export async function leaveLobby(this: Socket, code?: string) {
    if (this.rooms.size === 2) {
        const game = activeGames.find((g) => g.code === (code || Array.from(this.rooms)[1]));
        if (game) {
            const user = game.observers?.find((o) => o.id === this.request.session.id);
            let name = "";
            if (user) {
                name = user.name as string;
                game.observers?.splice(game.observers?.indexOf(user), 1);
            }
            if (game.black?.id === this.request.session.id) {
                name = game.black?.name as string;
                game.black = undefined;
            }
            if (game.white?.id === this.request.session.id) {
                name = game.white?.name as string;
                game.white = undefined;
            }

            if (!game.white && !game.black && !game.observers) {
                // TODO
                //activeGames.splice(activeGames.indexOf(game), 1); // remove game if empty
            } else {
                this.to(game.code as string).emit("userLeft", name);
                this.to(game.code as string).emit("receivedLatestLobby", game);
            }
        }
        await this.leave(code || Array.from(this.rooms)[1]);
    } else if (this.rooms.size >= 3) {
        console.log(`[WARNING] leaveLobby: room size is ${this.rooms.size}, aborting...`);
    } else {
        // try to find a game with this user
        const game = activeGames.find(
            (g) =>
                g.code === code ||
                g.black?.id === this.request.session.id ||
                g.white?.id === this.request.session.id ||
                g.observers?.find((o) => this.request.session.id === o.id)
        );
        if (game) {
            const user = game.observers?.find((o) => this.request.session.id === o.id);
            let name = "";
            if (user) {
                name = user.name as string;
                game.observers?.splice(game.observers?.indexOf(user), 1);
            }
            if (game.black?.id === this.request.session.id) {
                name = game.black?.name as string;
                game.black = undefined;
            }
            if (game.white?.id === this.request.session.id) {
                name = game.white?.name as string;
                game.white = undefined;
            }
            this.to(game.code as string).emit("userLeft", name);
            this.to(game.code as string).emit("receivedLatestLobby", game);
        }
    }
}

export async function getLatestGame(this: Socket) {
    const game = activeGames.find((g) => g.code === Array.from(this.rooms)[1]);
    if (game) this.emit("receivedLatestGame", game);
}

export async function sendMove(this: Socket, m: { from: string; to: string; promotion?: string }) {
    const game = activeGames.find((g) => g.code === Array.from(this.rooms)[1]);
    if (!game) return;
    const chess = new Chess();
    if (game.pgn) {
        chess.loadPgn(game.pgn);
    }
    const prevTurn = chess.turn();
    const newMove = chess.move(m);
    if (chess.isGameOver()) {
        let reason = "";
        if (chess.isCheckmate()) reason = "checkmate";
        else if (chess.isStalemate()) reason = "stalemate";
        else if (chess.isThreefoldRepetition()) reason = "repetition";
        else if (chess.isInsufficientMaterial()) reason = "insufficient";
        else if (chess.isDraw()) reason = "draw";

        const winnerSide =
            reason === "checkmate" ? (prevTurn === "w" ? "white" : "black") : undefined;
        const winnerName =
            reason === "checkmate"
                ? winnerSide === "white"
                    ? game.white?.name
                    : game.black?.name
                : undefined;
        if (reason === "checkmate") {
            game.winner = winnerSide;
        } else {
            game.winner = "draw";
        }
        io.to(game.code as string).emit("gameOver", { reason, winnerName, winnerSide });
    }
    if (newMove === null) {
        this.emit("receivedLatestGame", game);
    } else {
        game.pgn = chess.pgn();
        this.to(game.code as string).emit("receivedMove", m);
    }
}

export async function joinAsPlayer(this: Socket) {
    const game = activeGames.find((g) => g.code === Array.from(this.rooms)[1]);
    if (!game) return;
    const user = game.observers?.find((o) => o.id === this.request.session.id);
    if (!game.white) {
        game.white = this.request.session.user;
        if (user) game.observers?.splice(game.observers?.indexOf(user), 1);
        io.to(game.code as string).emit("userJoinedAsPlayer", {
            name: this.request.session.user.name,
            side: "white"
        });
    } else if (!game.black) {
        game.black = this.request.session.user;
        if (user) game.observers?.splice(game.observers?.indexOf(user), 1);
        io.to(game.code as string).emit("userJoinedAsPlayer", {
            name: this.request.session.user.name,
            side: "black"
        });
    } else {
        console.log("[WARNING] attempted to join a game with already 2 players");
    }
    io.to(game.code as string).emit("receivedLatestGame", game);
    io.to(game.code as string).emit("receivedLatestLobby", game);
}

export async function chat(this: Socket, message: string) {
    this.to(Array.from(this.rooms)[1]).emit("chat", {
        author: this.request.session.user,
        message
    });
}
