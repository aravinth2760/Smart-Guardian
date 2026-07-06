import { Router } from "express";
import {
  sendOtpController,
  verifyOtpController,
  completeProfileController,
} from "../controllers/auth.controller.js";
import { otpLimiter } from "../middlewares/rateLimiter.js";
import { validate } from "../middlewares/validate.js";
import { authenticate } from "../middlewares/auth.middleware.js";

import {
  completeProfileSchema,
  sendOtpSchema,
  verifyOtpSchema,
} from "../validators/auth.schema.js";

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

router.post(
  "/complete-profile",
  authenticate,
  validate(completeProfileSchema),
  completeProfileController,
);

export default router;
