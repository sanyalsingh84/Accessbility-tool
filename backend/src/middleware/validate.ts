import type { Request, Response, NextFunction } from "express";
import type { AnyZodObject } from "zod";
import AppError from "../utils/AppError.js";

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: any) {
      const messages = error.errors.map((e: any) => e.message).join(", ");
      return next(new AppError(messages, 400));
    }
  };
