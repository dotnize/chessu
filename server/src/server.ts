import "dotenv/config";
import cors from "cors";
import type { Request, Response, NextFunction } from "express";
import express from "express";
import { createServer } from "http";
import session from "./middleware/session.js";
import { Server } from "socket.io";
import { init as initSocket } from "./socket/index.js";
import { db } from "./db/index.js";
import routes from "./routes/index.js";

const corsConfig = {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true
};

const app = express();
const server = createServer(app);

// database
db.connect();

// middleware
app.use(cors(corsConfig));
app.use(express.json());
app.set("trust proxy", 1);
app.use(session);
app.use("/v1", routes);

// socket.io
export const io = new Server(server, { cors: corsConfig });
io.use((socket, next) => {
    session(socket.request as Request, {} as Response, next as NextFunction);
});
io.use((socket, next) => {
    const session = socket.request.session;
    if (session && session.user) {
        next();
    } else {
        console.log("io.use: no session");
        socket.disconnect();
    }
});
initSocket();

const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`listening on :${port}`);
});
