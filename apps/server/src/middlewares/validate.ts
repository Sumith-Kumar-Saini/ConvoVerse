import { NextFunction, Request, Response } from "express";
import { ZodError, ZodObject } from "zod";
import { ValidatedData } from "../types";

export const validate =
  <T>(schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      req.validatedData = parsed as ValidatedData;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          message: "Invalid input",
          payload: {
            error: err.issues.map((issue) => ({
              path: issue.path.join("."),
              message: issue.message,
              code: issue.code,
              input: issue.input,
            })),
          },
        });
      }
    }
  };
