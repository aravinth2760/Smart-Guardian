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
