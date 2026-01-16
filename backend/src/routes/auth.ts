import express from "express";
import {
  register,
  signIn,
  me,
  signOut,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.middleware.js";

import {authLimiter} from "../middleware/rateLimit.js"

const router = express.Router();

router.post("/register", authLimiter,  register);
router.post("/login", authLimiter,  signIn);
router.post("/logout", signOut);
router.get("/me", protect, me);

export default router;
