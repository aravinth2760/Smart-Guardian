import { Router } from "express";
import {
  sendOtpController,
  verifyOtpController,
} from "../controllers/auth.controller.js";
import { otpLimiter } from "../middlewares/rateLimiter.js";
import { validate } from "../middlewares/validate.js";
import { sendOtpSchema, verifyOtpSchema } from "../validators/auth.schema.js";

const router = Router();

router.post(
  "/send-otp",
  otpLimiter,
  validate(sendOtpSchema),
  sendOtpController,
);

router.post(
  "/verify-otp",
  otpLimiter,
  validate(verifyOtpSchema),
  verifyOtpController,
);

export default router;
