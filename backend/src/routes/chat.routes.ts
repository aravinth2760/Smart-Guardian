import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  createPrivateChat,
  createMessage,
  getChats,
  getChatMessages,
  createGroup,
  getMyGroup,
  enableInvite,
  disableInvite,
  regenerateInviteCode,
  joinGroup,
  getJoinRequests,
  approveJoinRequest,
} from "../controllers/chat.controller.js";

const router = Router();

router.post("/private", authenticate, createPrivateChat);

router.post("/message", authenticate, createMessage);

router.get("/", authenticate, getChats);

router.get("/:chatId/messages", authenticate, getChatMessages);

router.post("/group", authenticate, createGroup);

router.get("/group", authenticate, getMyGroup);

router.post("/group/invite/enable", authenticate, enableInvite);

router.post("/group/invite/disable", authenticate, disableInvite);

router.post("/group/invite/regenerate", authenticate, regenerateInviteCode);

router.post("/group/join", authenticate, joinGroup);

router.get("/group/join-requests", authenticate, getJoinRequests);

router.post(
  "/group/join-requests/:requestId/approve",
  authenticate,
  approveJoinRequest,
);

export default router;
