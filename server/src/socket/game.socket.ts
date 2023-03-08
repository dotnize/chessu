import { activeGames } from "../db/models/game.model.js";
import type { DisconnectReason, Socket } from "socket.io";
import { Chess } from "chess.js";
import { io } from "../server.js";

export async function joinLobby(this: Socket, gameCode: string) {
    const game = activeGames.find((g) => g.code === gameCode);
    if (!game) {
        console.log(`joinLobby: Game code ${gameCode} not found.`);
        return;
    }

    if (game.white && game.white?.id === this.request.session.user.id) {
        game.white.connected = true;
    } else if (game.black && game.black?.id === this.request.session.user.id) {
        game.black.connected = true;
    } else {
        if (game.observers === undefined) game.observers = [];
        game.observers?.push(this.request.session.user);
    }

    if (this.rooms.size >= 2) {
        await leaveLobby.call(this);
    }

    if (game.timeout) {
        clearTimeout(game.timeout);
        game.timeout = undefined;
    }

    await this.join(gameCode);
    io.to(game.code as string).emit("receivedLatestGame", game);
}

export async function leaveLobby(this: Socket, reason?: DisconnectReason, code?: string) {
    if (this.rooms.size >= 3 && !code) {
        console.log(`[WARNING] leaveLobby: room size is ${this.rooms.size}, aborting...`);
        return;
    }
    const game = activeGames.find(
        (g) =>
            g.code === (code || this.rooms.size === 2 ? Array.from(this.rooms)[1] : 0) ||
            (g.black?.connected && g.black?.id === this.request.session.user.id) ||
            (g.white?.connected && g.white?.id === this.request.session.user.id) ||
            g.observers?.find((o) => this.request.session.user.id === o.id)
    );

    if (game) {
        const user = game.observers?.find((o) => o.id === this.request.session.user.id);
        if (user) {
            game.observers?.splice(game.observers?.indexOf(user), 1);
        }
        if (game.black && game.black?.id === this.request.session.user.id) {
            game.black.connected = false;
        } else if (game.white && game.white?.id === this.request.session.user.id) {
            game.white.connected = false;
        }

        // count sockets
        const sockets = await io.in(game.code as string).fetchSockets();

        if (sockets.length <= 0 || (reason === undefined && sockets.length <= 1)) {
            if (game.timeout) clearTimeout(game.timeout);
            game.timeout = Number(
                setTimeout(() => {
                    activeGames.splice(activeGames.indexOf(game), 1);
                }, 1000 * 60 * 10) // 10 minutes
            );
        } else {
            this.to(game.code as string).emit("receivedLatestGame", game);
        }
    }
    await this.leave(code || Array.from(this.rooms)[1]);
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

    try {
        const prevTurn = chess.turn();

        if (
            (prevTurn === "b" && this.request.session.user.id !== game.black?.id) ||
            (prevTurn === "w" && this.request.session.user.id !== game.white?.id)
        ) {
            throw new Error("not turn to move");
        }

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
        if (newMove) {
            game.pgn = chess.pgn();
            this.to(game.code as string).emit("receivedMove", m);
        } else {
            throw new Error("invalid move");
        }
    } catch (e) {
        console.log("sendMove error: " + e);
        this.emit("receivedLatestGame", game);
    }
}

export async function joinAsPlayer(this: Socket) {
    const game = activeGames.find((g) => g.code === Array.from(this.rooms)[1]);
    if (!game) return;
    const user = game.observers?.find((o) => o.id === this.request.session.user.id);
    if (!game.white) {
        game.white = this.request.session.user;
        game.white.connected = true;
        if (user) game.observers?.splice(game.observers?.indexOf(user), 1);
        io.to(game.code as string).emit("userJoinedAsPlayer", {
            name: this.request.session.user.name,
            side: "white"
        });
    } else if (!game.black) {
        game.black = this.request.session.user;
        game.black.connected = true;
        if (user) game.observers?.splice(game.observers?.indexOf(user), 1);
        io.to(game.code as string).emit("userJoinedAsPlayer", {
            name: this.request.session.user.name,
            side: "black"
        });
    } else {
        console.log("[WARNING] attempted to join a game with already 2 players");
    }
    io.to(game.code as string).emit("receivedLatestGame", game);
}

export async function chat(this: Socket, message: string) {
    this.to(Array.from(this.rooms)[1]).emit("chat", {
        author: this.request.session.user,
        message
    });
}
