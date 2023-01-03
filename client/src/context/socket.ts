import { createContext } from "react";
import { io, Socket } from "socket.io-client";
import { apiUrl } from "../config/config";

export const socket: Socket = io(apiUrl, {
    withCredentials: true,
    autoConnect: false
});

socket.on("connect", () => {
    console.log("socket connected");
});

socket.on("disconnect", () => {
    console.log("socket disconnected");
});

export const SocketContext = createContext<Socket | null>(null);
