import { z } from "zod";

const phoneSchema = z
  .string()
  .regex(/^\+[1-9]\d{9,14}$/, "Invalid phone number");

const otpSchema = z.string().regex(/^[0-9]{4,6}$/, "Invalid OTP");

const relationshipSchema = z.enum([
  "father",
  "mother",
  "son",
  "daughter",
  "grandfather",
  "grandmother",
  "guardian",
  "other",
]);

export const sendOtpSchema = z.object({
  phone: phoneSchema,
});

export const verifyOtpSchema = z.object({
  phone: phoneSchema,
  otp: otpSchema,
});

export const completeProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Invalid email address"),
  relationship: relationshipSchema,
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Invalid email address"),
  relationship: relationshipSchema,
});
