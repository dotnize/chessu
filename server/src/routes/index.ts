import { Router } from "express";
import games from "./games.route";
import auth from "./auth.route";
import users from "./users.route";

const router = Router();

router.use("/games", games);
router.use("/auth", auth);
router.use("/users", users);

export default router;
