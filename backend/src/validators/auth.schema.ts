import { z } from "zod";

const phoneSchema = z.string().regex(/^[0-9]{10,15}$/, "Invalid phone number");

const otpSchema = z.string().regex(/^[0-9]{4,6}$/, "Invalid OTP");

export const sendOtpSchema = z.object({
  phone: phoneSchema,
});

export const verifyOtpSchema = z.object({
  phone: phoneSchema,
  otp: otpSchema,
});
