import { Router } from "express";
import {
  sendOtp,
  verifyOtp,
  completeProfile,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/complete-profile", completeProfile);

export default router;
