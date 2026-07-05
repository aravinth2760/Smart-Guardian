import { Request, Response } from "express";

export const sendOtp = async (req: Request, res: Response) => {
  const { phone } = req.body;

  res.status(200).json({
    success: true,
    message: "OTP sent successfully",
    data: {
      phone,
    },
  });
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { phone, otp } = req.body;

  res.status(200).json({
    success: true,
    message: "OTP verified successfully",
    data: {
      phone,
      otp,
      isVerified: true,
    },
  });
};

export const completeProfile = async (req: Request, res: Response) => {
  res.status(201).json({
    success: true,
    message: "Profile completed successfully",
    data: req.body,
  });
};
