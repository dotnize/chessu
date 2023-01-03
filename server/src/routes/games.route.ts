import { Router } from "express";
const router = Router();

import * as controller from "../controllers/games.controller";

router.route("/").get(controller.getActiveGames).post(controller.createGame);

//router.route("/:id").put(controller.joinGame);

// todo: api for updating games/moves requiring authentication

export default router;
