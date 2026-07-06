import axios from "axios";
import crypto from "crypto";
import { prisma } from "../prisma/client.js";

import { normalizePhone } from "../utils/normalizePhone.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

const MSG91_OTP_URL = "https://control.msg91.com/api/v5/otp";
const MSG91_VERIFY_URL = "https://control.msg91.com/api/v5/otp/verify";

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY!;
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID as string;
const OTP_EXPIRY = Number(process.env.OTP_EXPIRY || 60);
const REFRESH_TOKEN_DAYS = Number(process.env.JWT_REFRESH_EXPIRES_DAYS || 30);

// Developement purpose delay to simulate network latency and avoid rate limiting issues with MSG91 API
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Send OTP Service
export const sendOtp = async (phone: string) => {
  const mobile = normalizePhone(phone);

  await delay(3000); // Simulate network latency
  return {
    message: "OTP sent successfully (simulated)",
  };

  try {
    const response = await axios.post(
      MSG91_OTP_URL,
      {
        template_id: MSG91_TEMPLATE_ID,
        mobile,
        otp_expiry: OTP_EXPIRY,
      },
      {
        headers: {
          authkey: MSG91_AUTH_KEY,
          "Content-Type": "application/json",
        },
        timeout: 8000,
      },
    );

    return {
      message: response.data?.message || "OTP sent successfully",
    };
  } catch (error: any) {
    console.error("sendOtp error:", error?.response?.data || error.message);

    throw new Error(error?.response?.data?.message || "Failed to send OTP");
  }
};

// Verify OTP Service
export const verifyOtp = async (phone: string, otp: string) => {
  const mobile = normalizePhone(phone);

  try {
    /*
    const response = await axios.post(
      MSG91_VERIFY_URL,
      {
        mobile,
        otp,
      },
      {
        headers: {
          authkey: MSG91_AUTH_KEY,
          "Content-Type": "application/json",
        },
        timeout: 8000,
      },
    );

    const data = response.data;

    if (data?.type !== "success") {
      throw new Error(data?.message || "OTP verification failed");
    }
    */

    await delay(3000); // Simulate network latency

    let user = await prisma.user.findUnique({
      where: {
        phone: mobile,
      },
    });

    const isNewUser = !user;

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone: mobile,
        },
      });
    }

    const accessToken = generateAccessToken({
      userId: user.id,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
    });

    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const expiresAt = new Date(
      Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
    );

    await prisma.$transaction(async (tx) => {
      // Single-device login
      await tx.refreshToken.deleteMany({
        where: {
          userId: user.id,
        },
      });

      await tx.refreshToken.create({
        data: {
          tokenHash,
          userId: user.id,
          expiresAt,
        },
      });
    });

    return {
      message: "OTP verified successfully",
      accessToken,
      refreshToken,
      isNewUser,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        relationship: user.relationship,
        role: user.role,
        profileCompleted: user.profileCompleted,
      },
    };
  } catch (error: any) {
    console.error("verifyOtp error:", error?.response?.data || error.message);

    throw new Error(error?.response?.data?.message || "Invalid or expired OTP");
  }
};
