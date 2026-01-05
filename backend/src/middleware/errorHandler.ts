import type { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError.js";

const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: "fail",
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: "fail",
      message: err.message,
    });
  }

  // Programming or other unknown error: don't leak error details
  console.error("ERROR 💥", err);

  res.status(500).json({
    status: "error",
    message: "Something went very wrong!",
  });
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error as AppError, res);
  } else {
    if (err?.name === "JsonWebTokenError") {
      error = new AppError("Invalid token. Please log in again.", 401);
    }
    if (err?.name === "TokenExpiredError") {
      error = new AppError("Your token has expired. Please log in again.", 401);
    }
    // You can add more error handlers here for things like DB validation errors
    
    sendErrorProd(error as AppError, res);
  }
};
