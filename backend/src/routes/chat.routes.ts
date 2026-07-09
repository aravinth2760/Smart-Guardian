import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  createPrivateChat,
  createMessage,
  getChats,
} from "../controllers/chat.controller.js";

const router = Router();

router.post("/private", authenticate, createPrivateChat);

router.post("/message", authenticate, createMessage);

router.get("/", authenticate, getChats);

export default router;
