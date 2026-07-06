import { Request, Response } from "express";
import { sendOtp, verifyOtp } from "../services/otp.service.js";
import { completeProfile } from "../services/auth.service.js";

// Send OTP Controller
export const sendOtpController = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    // Validation
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone is required",
      });
    }

    // Service call
    await sendOtp(phone);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err: any) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

// Verify OTP Controller
export const verifyOtpController = async (req: Request, res: Response) => {
  try {
    const { phone, otp } = req.body;

    const result = await verifyOtp(phone, otp);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        isNewUser: result.isNewUser,
        user: result.user,
      },
    });
  } catch (error: any) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || "OTP verification failed",
    });
  }
};

// Complete Profile Controller
export const completeProfileController = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.user!.userId;

    const user = await completeProfile(userId, req.body);

    return res.status(200).json({
      success: true,
      message: "Profile completed successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
