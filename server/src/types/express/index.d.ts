import { Request, Response, Express } from "express";
import { ValidatedData, EasyResponseFnc as EasyResponse, ERParam } from "..";

declare global {
  namespace Express {
    interface Request {
      validatedData?: ValidatedData;
    }

    interface Response {
      easyResponse: EasyResponse;
    }
  }
}