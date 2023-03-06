import type { Dispatch } from "react";
import type { Action, Lobby, Message, CustomSquares } from "@/types";
import { Chess } from "chess.js";
import type { Game, User } from "@chessu/types";
import type { Socket } from "socket.io-client";

export function lobbyReducer(lobby: Lobby, action: Action): Lobby {
    switch (action.type) {
        case "updateLobby":
            return { ...lobby, ...action.payload };

        case "setSide":
            return { ...lobby, side: action.payload };

        case "setGame":
            return { ...lobby, actualGame: action.payload };

        default:
            throw new Error("Invalid action type");
    }
}

export function squareReducer(squares: CustomSquares, action: Partial<CustomSquares>) {
    return { ...squares, ...action };
}

export function initSocket(
    user: User,
    socket: Socket,
    lobby: Lobby,
    actions: {
        updateLobby: Dispatch<Action>;
        addMessage: Function;
        updateCustomSquares: Dispatch<Partial<CustomSquares>>;
        makeMove: Function;
    }
) {
    socket.on("connect", () => {
        console.log("connected!");
        socket.emit("joinLobby", lobby.code);
    });
    socket.on("disconnect", () => {
        console.log("disconnected!");
    });
    // TODO: handle disconnect

    socket.on("chat", (message: Message) => {
        actions.addMessage(message);
    });

    socket.on("receivedLatestGame", (latestGame: Game) => {
        if (latestGame.pgn && latestGame.pgn !== lobby.actualGame.pgn()) {
            lobby.actualGame.loadPgn(latestGame.pgn as string);

            const lastMove = lobby.actualGame.history({ verbose: true }).pop();

            let lastMoveSquares = undefined;
            let kingSquare = undefined;
            if (lastMove) {
                lastMoveSquares = {
                    [lastMove.from]: { background: "rgba(255, 255, 0, 0.4)" },
                    [lastMove.to]: { background: "rgba(255, 255, 0, 0.4)" }
                };
            }
            if (lobby.actualGame.inCheck()) {
                const kingPos = lobby.actualGame.board().reduce((acc, row, index) => {
                    const squareIndex = row.findIndex(
                        (square) =>
                            square &&
                            square.type === "k" &&
                            square.color === lobby.actualGame.turn()
                    );
                    return squareIndex >= 0
                        ? `${String.fromCharCode(squareIndex + 97)}${8 - index}`
                        : acc;
                }, "");
                kingSquare = {
                    [kingPos]: {
                        background: "radial-gradient(red, rgba(255,0,0,.4), transparent 70%)",
                        borderRadius: "50%"
                    }
                };
            }
            actions.updateCustomSquares({
                lastMove: lastMoveSquares,
                check: kingSquare
            });
        }
        actions.updateLobby({ type: "updateLobby", payload: latestGame });

        if (latestGame.black?.id === user?.id) {
            if (lobby.side !== "b") actions.updateLobby({ type: "setSide", payload: "b" });
        } else if (latestGame.white?.id === user?.id) {
            if (lobby.side !== "w") actions.updateLobby({ type: "setSide", payload: "w" });
        } else if (lobby.side !== "s") {
            actions.updateLobby({ type: "setSide", payload: "s" });
        }
    });

    socket.on("receivedMove", (m: { from: string; to: string; promotion?: string }) => {
        const success = actions.makeMove(m);
        console.log(success);
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
            winnerSide
        }: {
            reason: string;
            winnerName?: string;
            winnerSide?: string;
        }) => {
            const m = {
                author: { name: "game" }
            } as Message;

            if (reason === "checkmate") {
                m.message = `${winnerName}(${winnerSide}) has won by checkmate.`;
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
            actions.addMessage(m);
        }
    );
}
