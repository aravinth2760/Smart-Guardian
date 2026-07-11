import { Request, Response } from "express";
import {
  getOrCreatePrivateChat,
  sendMessage,
  getUserChats,
  getMessages,
  createGroupService,
  getMyGroupService,
  enableInviteService,
  disableInviteService,
  regenerateInviteCodeService,
  joinGroupService,
  getJoinRequestsService,
  approveJoinRequestService,
  rejectJoinRequestService,
  getGroupMembersService,
  removeGroupMemberService,
  transferOwnerService,
  leaveGroupService,
  getGroupMessagesService,
  sendGroupMessageService,
} from "../services/chat.service.js";
import { getIO } from "../socket.js";

export const createPrivateChat = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user?.userId;
    const { targetUserId } = req.body;

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const chat = await getOrCreatePrivateChat(currentUserId, targetUserId);

    return res.status(200).json({
      success: true,
      data: chat,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const createMessage = async (req: Request, res: Response) => {
  try {
    const senderId = req.user?.userId;

    if (!senderId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { chatId, text } = req.body;

    if (!chatId || !text?.trim()) {
      return res.status(400).json({
        success: false,
        message: "chatId and text are required",
      });
    }

    const message = await sendMessage(chatId, senderId, text.trim());

    return res.status(201).json({
      success: true,
      data: message,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const getChats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const chats = await getUserChats(userId);

    return res.status(200).json({
      success: true,
      data: chats,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getChatMessages = async (
  req: Request<{ chatId: string }>,
  res: Response,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { chatId } = req.params;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const messages = await getMessages(chatId, userId, page, limit);

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const createGroup = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const group = await createGroupService(userId as string);

    return res.status(201).json({
      success: true,
      message: "Safety Circle created successfully.",
      data: group,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

export const getMyGroup = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const group = await getMyGroupService(userId as string);

    return res.status(200).json({
      success: true,
      data: group,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const enableInvite = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const group = await enableInviteService(userId as string);

    return res.status(200).json({
      success: true,
      message: "Invite enabled successfully",
      data: group,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const disableInvite = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const group = await disableInviteService(userId as string);

    return res.status(200).json({
      success: true,
      message: "Invite disabled successfully",
      data: group,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const regenerateInviteCode = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const group = await regenerateInviteCodeService(userId as string);

    return res.status(200).json({
      success: true,
      message: "Invite code regenerated successfully",
      data: group,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const joinGroup = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const { inviteCode } = req.body;

    const request = await joinGroupService(userId as string, inviteCode);

    return res.status(201).json({
      success: true,
      message: "Join request sent successfully",
      data: request,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getJoinRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const requests = await getJoinRequestsService(userId as string);

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const approveJoinRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const { requestId } = req.params;

    const result = await approveJoinRequestService(
      userId as string,
      requestId as string,
    );

    return res.status(200).json({
      success: true,
      message: "Join request approved successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const rejectJoinRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const { requestId } = req.params;

    const result = await rejectJoinRequestService(
      userId as string,
      requestId as string,
    );

    return res.status(200).json({
      success: true,
      message: "Join request rejected successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getGroupMembers = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const members = await getGroupMembersService(userId as string);

    return res.status(200).json({
      success: true,
      data: members,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeGroupMember = async (req: Request, res: Response) => {
  try {
    const ownerId = req.user?.userId;

    const { userId } = req.params;

    const result = await removeGroupMemberService(
      ownerId as string,
      userId as string,
    );

    return res.status(200).json({
      success: true,
      message: "Member removed successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const transferOwner = async (req: Request, res: Response) => {
  try {
    const ownerId = req.user?.userId;

    const { userId } = req.body;

    const result = await transferOwnerService(ownerId as string, userId);

    return res.status(200).json({
      success: true,
      message: "Ownership transferred successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const leaveGroup = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const result = await leaveGroupService(userId as string);

    return res.status(200).json({
      success: true,
      message: "Left group successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getGroupMessages = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const messages = await getGroupMessagesService(userId as string);

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const sendGroupMessage = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const { text } = req.body;

    const message = await sendGroupMessageService(userId as string, text);

    getIO().to(message.chatId).emit("new-message", message);

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
