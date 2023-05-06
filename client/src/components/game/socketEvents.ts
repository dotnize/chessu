import type { Action, CustomSquares, Lobby, Message } from "@/types";
import type { Game, User } from "@chessu/types";
import type { Dispatch, SetStateAction } from "react";
import type { Socket } from "socket.io-client";

import { syncPgn, syncSide } from "./utils";

export function initSocket(
    user: User,
    socket: Socket,
    lobby: Lobby,
    actions: {
        updateLobby: Dispatch<Action>;
        addMessage: Function;
        updateCustomSquares: Dispatch<Partial<CustomSquares>>;
        makeMove: Function;
        setNavFen: Dispatch<SetStateAction<string | null>>;
        setNavIndex: Dispatch<SetStateAction<number | null>>;
    }
) {
    socket.on("connect", () => {
        socket.emit("joinLobby", lobby.code);
    });
    // TODO: handle disconnect

    socket.on("chat", (message: Message) => {
        actions.addMessage(message);
    });

    socket.on("receivedLatestGame", (latestGame: Game) => {
        if (latestGame.pgn && latestGame.pgn !== lobby.actualGame.pgn()) {
            syncPgn(latestGame.pgn, lobby, actions);
        }
        actions.updateLobby({ type: "updateLobby", payload: latestGame });

        syncSide(user, latestGame, lobby, actions);
    });

    socket.on("receivedMove", (m: { from: string; to: string; promotion?: string }) => {
        const success = actions.makeMove(m);
        if (!success) {
            socket.emit("getLatestGame");
        }
    });

    socket.on("userJoinedAsPlayer", ({ name, side }: { name: string; side: "white" | "black" }) => {
        actions.addMessage({
            author: { name: "server" },
            message: `${name} is now playing as ${side}.`
        });
    });

    socket.on(
        "gameOver",
        ({
            reason,
            winnerName,
            winnerSide,
            id
        }: {
            reason: Game["endReason"];
            winnerName?: string;
            winnerSide?: "white" | "black" | "draw";
            id: number;
        }) => {
            const m = {
                author: { name: "server" }
            } as Message;

            if (reason === "abandoned") {
                if (!winnerSide) {
                    m.message = `${winnerName} has claimed a draw due to abandonment.`;
                } else {
                    m.message = `${winnerName} (${winnerSide}) has claimed the win due to abandonment.`;
                }
            } else if (reason === "checkmate") {
                m.message = `${winnerName} (${winnerSide}) has won by checkmate.`;
            } else {
                let message = "The game has ended in a draw";
                if (reason === "repetition") {
                    message = message.concat(" due to threefold repetition");
                } else if (reason === "insufficient") {
                    message = message.concat(" due to insufficient material");
                } else if (reason === "stalemate") {
                    message = "The game has been drawn due to stalemate";
                }
                m.message = message.concat(".");
            }
            actions.updateLobby({
                type: "updateLobby",
                payload: { endReason: reason, winner: winnerSide || "draw", id }
            });
            actions.addMessage(m);
        }
    );
}
