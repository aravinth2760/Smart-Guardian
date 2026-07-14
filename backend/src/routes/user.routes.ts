import { Router } from "express";
import { checkContacts, getSOSSettings, updateSOSSettings } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/check-contacts", checkContacts);
router.get("/sos-settings", authenticate, getSOSSettings);
router.put("/sos-settings", authenticate, updateSOSSettings);

export default router;

