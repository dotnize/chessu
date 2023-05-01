import { Router } from "express";

import auth from "./auth.route.js";
import games from "./games.route.js";
import users from "./users.route.js";

const router = Router();

router.use("/games", games);
router.use("/auth", auth);
router.use("/users", users);

export default router;
