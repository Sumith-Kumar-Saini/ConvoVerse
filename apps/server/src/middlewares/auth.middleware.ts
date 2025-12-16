import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import AppError from "../utils/AppError";
import { ENV } from "../configs/env";

export function authorize(req: Request, res: Response, next: NextFunction) {
  try {
    // 1. Check for the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return next(new AppError("Authorization header missing.", 401));

    // 2. Check for the "Bearer" prefix and split the token
    const tokenParts = authHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer")
      return next(
        new AppError('Invalid token format. Must be "Bearer <token>".', 401)
      );

    const token = tokenParts[1];

    // 3. Verify the token using jsonwebtoken
    const decoded = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);

    // 4. Attach the user data to the request object and proceed
    (req as any).user = decoded;
    next();
  } catch (error) {
    // Handle different JWT errors
    if (error instanceof jwt.JsonWebTokenError)
      return next(new AppError("Invalid or expired token.", 401));
    // Handle other unexpected errors
    return next(new AppError("Server error during authentication.", 500));
  }
}
