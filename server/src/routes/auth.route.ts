import { Router } from "express";
const router = Router();

import * as controller from "../controllers/auth.controller";

router.route("/").get(controller.getCurrentSession);

// create or update guest sessions
router.route("/guest").post(controller.guestSession);

router.route("/logout").post(controller.logoutSession);

//router.route("/register").post(controller.registerUser);
//router.route("/login").post(controller.loginUser);

export default router;
