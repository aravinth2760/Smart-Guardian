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
  rejectJoinRequest,
  getGroupMembers,
  removeGroupMember,
  transferOwner,
  leaveGroup,
  getGroupMessages,
  sendGroupMessage,
  deleteGroupController,
  sendSOSAlert,
} from "../controllers/chat.controller.js";

const router = Router();

// Private Chat
router.post("/private", authenticate, createPrivateChat);
router.post("/message", authenticate, createMessage);
router.get("/", authenticate, getChats);

// Group
router.post("/group", authenticate, createGroup);
router.get("/group", authenticate, getMyGroup);
router.delete("/group/delete", authenticate, deleteGroupController);

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
router.post(
  "/group/join-requests/:requestId/reject",
  authenticate,
  rejectJoinRequest,
);

router.get("/group/members", authenticate, getGroupMembers);
router.delete("/group/members/:userId", authenticate, removeGroupMember);

router.post("/group/transfer-owner", authenticate, transferOwner);
router.post("/group/leave", authenticate, leaveGroup);

router.get("/group/messages", authenticate, getGroupMessages);
router.post("/group/message", authenticate, sendGroupMessage);
router.post("/group/sos", authenticate, sendSOSAlert);

// Keep parameterized routes at the end
router.get("/:chatId/messages", authenticate, getChatMessages);

export default router;
