import { Router } from "express";
import {
  sendOtpController,
  verifyOtpController,
  completeProfileController,
  updateProfileController,
  refreshToken,
} from "../controllers/auth.controller.js";
import { otpLimiter } from "../middlewares/rateLimiter.js";
import { validate } from "../middlewares/validate.js";
import { authenticate } from "../middlewares/auth.middleware.js";

import {
  completeProfileSchema,
  sendOtpSchema,
  updateProfileSchema,
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

router.put(
  "/update-profile",
  authenticate,
  validate(updateProfileSchema),
  updateProfileController,
);

router.post("/refresh", refreshToken);

export default router;
