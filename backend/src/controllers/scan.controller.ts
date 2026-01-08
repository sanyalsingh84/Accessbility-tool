import type { Request, Response, NextFunction } from "express";
import { ScanModel } from "../models/Scan.js";
import { ViolationModel } from "../models/Violation.js";
import AppError from "../utils/AppError.js";
import { executeScan } from "../workers/scan.worker.js"; // Import the new worker

/**
 * POST /api/scans
 * Create a new scan
 */
export const createScan = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { url } = req.body;

    const scan = await ScanModel.create({
      user: req.user!._id,
      url,
      status: "queued",
    });

    executeScan(scan._id.toString());

    res.status(201).json({
      scanId: scan._id,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/scans
 * List scans for dashboard
 */
export const getScans = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const scans = await ScanModel.find({ user: req.user!._id })
      .sort({ createdAt: -1 })
      .select("url status score createdAt completedAt");

    res.json(scans);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/scans/:id
 * Get scan report (scan + violations)
 */
export const getScanById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const scan = await ScanModel.findOne({
      _id: req.params.id,
      user: req.user!._id,
    });

    if (!scan) {
      return next(new AppError("Scan not found", 404));
    }

    const violations = await ViolationModel.find({ scan: scan._id })
      .populate("rule")
      .sort({ impact: -1 });

    res.json({
      scan,
      violations,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/scans/:id/status
 * Lightweight polling endpoint
 */
export const getScanStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const scan = await ScanModel.findOne({
      _id: req.params.id,
      user: req.user!._id,
    }).select("status score error");

    if (!scan) {
      return next(new AppError("Scan not found", 404));
    }

    res.json(scan);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/scans/:id/retry
 * Retry a failed scan
 */
export const retryScan = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const scan = await ScanModel.findOne({
      _id: req.params.id,
      user: req.user!._id,
    });

    if (!scan) {
      return next(new AppError("Scan not found", 404));
    }

    if (scan.status !== "failed") {
      return next(new AppError("Only failed scans can be retried", 400));
    }

    // ✅ Create a NEW scan
    const newScan = await ScanModel.create({
      user: scan.user,
      url: scan.url,
      status: "queued",
    });

    // 🔥 Fire worker
    executeScan(newScan._id.toString()).catch(console.error);

    res.json(newScan);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/scans/:id
 * Delete a scan
 */
export const deleteScan = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const scan = await ScanModel.findOneAndDelete({
      _id: req.params.id,
      user: req.user!._id,
    });

    if (!scan) {
      return next(new AppError("Scan not found", 404));
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
