import { Request, Response } from "express";
import * as userService from "../services/user.service.js";

export const checkContacts = async (req: Request, res: Response) => {
  try {
    const { phones } = req.body;

    const formattedPhones = phones.map((phone: string) => {
      let cleanedPhone = phone.replace(/[+\s]/g, "");
      return cleanedPhone;
    });

    const users = await userService.checkContacts(formattedPhones);

    res.status(200).json(users);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getSOSSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const settings = await userService.getUserSOSSettings(userId);
    res.status(200).json(settings);
  } catch (error) {
    console.log("getSOSSettings controller error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateSOSSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const settings = await userService.updateUserSOSSettings(userId, req.body);
    res.status(200).json(settings);
  } catch (error) {
    console.log("updateSOSSettings controller error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

