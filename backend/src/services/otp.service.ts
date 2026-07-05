import axios from "axios";
import { normalizePhone } from "../utils/normalizePhone.js";
import { generateToken } from "../utils/jwt.js";
import prisma from "../config/db.js";

const MSG91_OTP_URL = "https://control.msg91.com/api/v5/otp";
const MSG91_VERIFY_URL = "https://control.msg91.com/api/v5/otp/verify";

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY as string;
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID as string;
const OTP_EXPIRY = Number(process.env.OTP_EXPIRY || 60);

if (!MSG91_AUTH_KEY || !MSG91_TEMPLATE_ID) {
  throw new Error("MSG91 env variables missing");
}

// SEND OTP
export const sendOtp = async (phone: string) => {
  const mobile = normalizePhone(phone);

  try {
    const res = await axios.post(
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
      success: true,
      message: res.data?.message || "OTP sent successfully",
    };
  } catch (err: any) {
    console.error("sendOtp error:", err?.response?.data || err.message);

    throw new Error(err?.response?.data?.message || "OTP send failed");
  }
};

// VERIFY OTP + GENERATE JWT
export const verifyOtp = async (phone: string, otp: string) => {
  const mobile = normalizePhone(phone);

  try {
    const res = await axios.post(
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

    const data = res.data;

    // MSG91 success check
    if (data?.type === "success") {
      const token = generateToken({
        sub: mobile,
        type: "otp_verified",
      });
      const user = await prisma.user.findUnique({
        where: {
          phone: mobile,
        },
      });

      return {
        success: true,
        message: data?.message || "OTP verified successfully",
        token,
        user,
        isNewUser: !user,
      };
    }

    throw new Error(data?.message || "OTP verification failed");
  } catch (err: any) {
    console.error("verifyOtp error:", err?.response?.data || err.message);

    throw new Error(err?.response?.data?.message || "Invalid or expired OTP");
  }
};
