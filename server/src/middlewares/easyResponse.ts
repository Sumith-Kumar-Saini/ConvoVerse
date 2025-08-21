import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { EasyResponse, ERParam, GenerateResponseParam } from "../types";

export default class ApiResponse {
  public static easyResponse() {
    return (req: Request, res: Response, next: NextFunction) => {
      res.easyResponse = (param: ERParam) => {
        const { message, statusCode, error = null, payload = null } = param;
        try {
          const response = this.generateResponse({
            statusCode,
            message,
            payload,
            error,
            originalUrl: req.originalUrl,
          });
          res.status(statusCode).json(response); // Send the response
        } catch (err) {
          next(err); // Pass the error to the error handling middleware
        }
      };

      // Proceed to the next middleware
      next();
    };
  }

  static generateResponse(param: GenerateResponseParam) {
    const { error, message, originalUrl, payload, statusCode } = param;
    if (typeof statusCode !== "number")
      throw new Error("The 'statusCode' field must be a number");
    if (typeof message !== "string" || message.trim() === "")
      throw new Error('The "message" field must be a non-empty string.');

    const statusDetails = this.getStatusDetails(statusCode);

    const response: EasyResponse = {
      statusCode,
      status: statusDetails,
      error: null,
      message: message.trim(),
      payload,
      path: originalUrl,
      timeStamp: new Date().toISOString(),
    };

    if (error) response.error = error;

    return response;
  }

  private static getStatusDetails(statusCode: number) {
    const statusText = StatusCodes[statusCode];
    if (statusText) return statusText;
    return "INVALID_STATUS_CODE";
  }
}
