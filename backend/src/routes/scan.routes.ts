import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { createScanSchema } from "../schemas/scan.schema.js";
import {
  createScan,
  getScans,
  getScanById,
  getScanStatus,
  deleteScan,
  retryScan,
} from "../controllers/scan.controller.js";
import {scanLimiter} from "../middleware/rateLimit.js"

const router = Router();

router.use(protect);

router.post("/", validate(createScanSchema), scanLimiter, createScan);
router.get("/", getScans);
router.get("/:id", getScanById);
router.get("/:id/status", getScanStatus);
router.post("/:id/retry", scanLimiter,  retryScan);
router.delete("/:id", deleteScan);

export default router;
