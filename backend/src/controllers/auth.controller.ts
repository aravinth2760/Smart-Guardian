import { Request, Response } from "express";
import { sendOtp, verifyOtp } from "../services/otp.service.js";
import { completeProfile, updateProfile } from "../services/auth.service.js";
import { rotateRefreshToken } from "../services/token.service.js";

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

// Update Profile Controller
export const updateProfileController = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const user = await updateProfile(userId, req.body);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token is required",
      });
    }

    const tokens = await rotateRefreshToken(refreshToken);

    return res.status(200).json(tokens);
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
};
