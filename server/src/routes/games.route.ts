import { Router } from "express";
import * as controller from "../controllers/games.controller.js";

const router = Router();

router.route("/").get(controller.getActiveGames).post(controller.createGame);

//router.route("/:id").put(controller.joinGame);

// todo: api for updating games/moves requiring authentication

export default router;
