import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";

// A Global Error Handler to handle all AppErrors - which passed through nextFunction
const globalErrorHandler = () =>
  function (err: AppError, req: Request, res: Response, next: NextFunction) {
    const statusCode = err.statusCode || 500;
    const status = err.status || "error";
    const message = err.message || "Something went wrong!";

    // Send a user-friendly error response (avoid leaking sensitive information)
    res.status(statusCode).json({
      status,
      message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  };

export default globalErrorHandler;
