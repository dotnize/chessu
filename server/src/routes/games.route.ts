import { Router } from "express";

import * as controller from "../controllers/games.controller.js";

const router = Router();

router.route("/").get(controller.getGames).post(controller.createGame);

router.route("/:code").get(controller.getActiveGame);

export default router;
