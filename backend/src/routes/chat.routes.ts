import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  createPrivateChat,
  createMessage,
} from "../controllers/chat.controller.js";

const router = Router();

router.post("/private", authenticate, createPrivateChat);

router.post("/message", authenticate, createMessage);

export default router;
