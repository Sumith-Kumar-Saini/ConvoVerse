import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  EasyResponse,
  GenerateResponseParam,
  EasyResponseFnc,
  EasyResponseParameters,
} from "../types";

interface ERParam {
  statusCode: number;
  message: string;
  payload?: object | null;
  error?: Error | null;
}

type EasyResponseArray = [EasyResponse | null, Error | undefined];

export default class ApiResponse {
  private static originalUrl: string;

  public static easyResponse() {
    return (req: Request, res: Response, next: NextFunction) => {
      this.originalUrl = req.originalUrl;
      res.easyResponse = this.EasyResponseMiddleware(req, res, next);

      // Proceed to the next middleware
      next();
    };
  }

  private static easyResponseGenerator(
    ResObjOrCode: number | ERParam,
    ResObjOrMsg?: string | EasyResponseParameters
  ): EasyResponseArray {
    let ResponseObj: EasyResponse | null = null;
    let error: Error | undefined;
    if (typeof ResObjOrCode === "number") {
      const statusCode = ResObjOrCode;
      if (ResObjOrMsg && typeof ResObjOrMsg === "string") {
        const message = ResObjOrMsg;
        ResponseObj = this.generateResponse({
          statusCode,
          message,
          error: null,
          payload: null,
        });
      } else if (ResObjOrMsg && typeof ResObjOrMsg !== "string") {
        const { message, error = null, payload = null } = ResObjOrMsg;
        ResponseObj = this.generateResponse({
          statusCode,
          message,
          error,
          payload,
        });
      } else
        error = new Error(
          "You can only set parameters as string or EasyResponseParameters"
        );
    } else {
      const {
        message,
        statusCode,
        error = null,
        payload = null,
      } = ResObjOrCode;
      ResponseObj = this.generateResponse({
        statusCode,
        message,
        error,
        payload,
      });
    }

    return [ResponseObj, error];
  }

  private static generateResponse(param: GenerateResponseParam) {
    const { error, message, payload, statusCode } = param;
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
      path: this.originalUrl,
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

  private static EasyResponseMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const easyResponse: EasyResponseFnc = (
      ResObjOrCode: number | ERParam,
      ResObjOrMsg?: string | EasyResponseParameters
    ) => {
      const [response, error] = this.easyResponseGenerator(
        ResObjOrCode,
        ResObjOrMsg
      );
      if (error) return next(error);
      if (!response) return next(new Error("Something want wrong"));
      res.status(response.statusCode).json(response); // Send the response
    };

    return easyResponse;
  }
}
