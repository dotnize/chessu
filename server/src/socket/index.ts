import type { Socket } from "socket.io";
import { io } from "../server";
import { db, INIT_TABLES } from "../db/index";
import {
    joinLobby,
    leaveLobby,
    getLatestGame,
    sendMove,
    joinAsPlayer,
    chat,
    claimAbandoned
} from "./game.socket";

const socketConnect = (socket: Socket) => {
    
    const req = socket.request;

    // review if this is necessary, or if io.use will handle logout
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
    socket.on("claimAbandoned", claimAbandoned);
};

export const init = async () => {

    await db.connect();
    db.query(INIT_TABLES, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log("Tables initialized");
        }
    });

    console.log("yolo")
    io.on("connection", socketConnect);
};
