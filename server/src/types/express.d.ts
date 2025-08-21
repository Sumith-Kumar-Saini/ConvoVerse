import { Request, Response, Express } from "express";
import { ValidatedData } from "./schema";
import { ERParam } from ".";

declare global {
  namespace Express {
    interface Request {
      validatedData?: ValidatedData;
    }

    interface Response {
      easyResponse: (param: ERParam) => void;
    }
  }
}
