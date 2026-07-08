import { Router } from "express";
import { checkContacts } from "../controllers/user.controller.js";

const router = Router();

router.post("/check-contacts", checkContacts);

export default router;
