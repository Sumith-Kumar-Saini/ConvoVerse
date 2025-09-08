import { Request, Response, Express } from "express";
import { ValidatedData } from "./schema";
import { EasyResponseFnc as EasyResponse } from "./easyResponse";
import { ERParam } from ".";

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

export interface Request {
  validatedData?: ValidatedData;
}

export interface Response {
  easyResponse: EasyResponse;
}
