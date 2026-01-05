import { UserModel } from "../models/User.js";
import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("runs Protect middleware");
    const token = req.cookies?.access_token;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = verifyToken(token);

    const user = await UserModel.findById(decoded.sub).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
