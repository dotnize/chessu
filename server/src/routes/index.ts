import { Router } from "express";
const router = Router();

import games from "./games.route";
import auth from "./auth.route";

router.use("/games", games);
router.use("/auth", auth);

export default router;
