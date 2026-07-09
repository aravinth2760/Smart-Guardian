import { Request, Response } from "express";
import {
  getOrCreatePrivateChat,
  sendMessage,
  getUserChats,
} from "../services/chat.service.js";

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
