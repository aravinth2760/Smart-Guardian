import { Request, Response } from "express";
import { getOrCreatePrivateChat } from "../services/chat.service.js";

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
