import type { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/User.js";
import bcrypt from "bcrypt";
import type { CookieOptions } from "express";
import { signToken } from "../utils/jwt.js";

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // HTTPS only in prod
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    // check for duplicate email
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const user = await UserModel.create({ name, email, password });

    const token = signToken(user._id.toString());

    res.cookie("access_token", token, COOKIE_OPTIONS);

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = signToken(user._id.toString());

    res.cookie("access_token", token, COOKIE_OPTIONS);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = (req: Request, res: Response) => {
  res.clearCookie("access_token", COOKIE_OPTIONS);
  res.status(200).json({ message: "Logged out successfully" });
};

export const me = async (req: Request, res: Response) => {
  res.json({
    user: req.user,
  });
};
