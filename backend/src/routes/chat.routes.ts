import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  createPrivateChat,
  createMessage,
  getChats,
  getChatMessages,
  createGroup,
} from "../controllers/chat.controller.js";

const router = Router();

router.post("/private", authenticate, createPrivateChat);

router.post("/message", authenticate, createMessage);

router.get("/", authenticate, getChats);

router.get("/:chatId/messages", authenticate, getChatMessages);

router.post("/group", authenticate, createGroup);

router.get("/group", authenticate, getMyGroup);

export default router;
