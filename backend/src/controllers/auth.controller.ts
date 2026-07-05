import { Request, Response } from "express";
import { sendOtp, verifyOtp } from "../services/otp.service.js";

const phoneRegex = /^[6-9]\d{9}$/;

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

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
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

    // Validation
    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone and OTP are required",
      });
    }

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
      });
    }

    if (!/^\d{4,6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP format",
      });
    }

    // Service call
    const result = await verifyOtp(phone, otp);

    if (!result || result.success === false) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(err.statusCode || 400).json({
      success: false,
      message: err.message || "Verification failed",
    });
  }
};
