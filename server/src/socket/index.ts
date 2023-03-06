import type { Socket } from "socket.io";
import { io } from "../server.js";
import {
    joinLobby,
    leaveLobby,
    getLatestGame,
    sendMove,
    joinAsPlayer,
    chat
} from "./game.socket.js";

const socketConnect = (socket: Socket) => {
    const req = socket.request;

    // re-analyze if this is necessary, or if io.use will handle logout
    socket.use((__, next) => {
        req.session.reload((err) => {
            if (err) {
                console.log("reload: disconnecting socket.");
                console.log(err);
                socket.disconnect();
            } else {
                next();
            }
        });
    });

    socket.on("disconnect", leaveLobby);

    socket.on("joinLobby", joinLobby);
    socket.on("leaveLobby", leaveLobby);

    socket.on("getLatestGame", getLatestGame);
    socket.on("sendMove", sendMove);
    socket.on("joinAsPlayer", joinAsPlayer);
    socket.on("chat", chat);
};

export const init = () => {
    io.on("connection", socketConnect);
};
