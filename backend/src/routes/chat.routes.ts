import { Router } from "express";
import { createPrivateChat } from "../controllers/chat.controller.js";

const router = Router();

router.post("/private", createPrivateChat);

export default router;
