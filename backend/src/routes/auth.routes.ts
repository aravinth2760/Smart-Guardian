import { Router } from "express";

import { checkUser, registerUser } from "../controllers/auth.controller";

const router = Router();

router.post("/check-user", checkUser);

router.post("/register", registerUser);

export default router;
