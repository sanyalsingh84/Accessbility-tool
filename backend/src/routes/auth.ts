import express from "express";
import {
  register,
  signIn,
  me,
  signOut,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", signIn);
router.post("/logout", signOut);
router.get("/me", protect, me);

export default router;
