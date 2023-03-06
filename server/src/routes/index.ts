import { Router } from "express";
import games from "./games.route.js";
import auth from "./auth.route.js";

const router = Router();

router.use("/games", games);
router.use("/auth", auth);

export default router;
