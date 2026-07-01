import { Request, Response } from "express";

import { checkUserByPhone, createUser } from "../services/auth.service";

export const checkUser = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    const user = await checkUserByPhone(phone);

    return res.json({
      success: true,
      exists: !!user,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firebaseUid, phone, name, email, role } = req.body;

    const user = await createUser(firebaseUid, phone, name, email, role);

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
