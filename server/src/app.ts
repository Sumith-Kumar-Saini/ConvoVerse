import express, { Request, Response } from "express";
import cors from "cors";

import authRouter from "./routers/auth.routes";
import ApiResponse from "./middlewares/easyResponse";

import { ValidatedData } from "./types/schema";
import { ERParam } from "./types";

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

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(ApiResponse.easyResponse());

app.get("/", (_, res: Response) => {
  res.easyResponse({ statusCode: 200, message: "Server is running properly" });
});

app.use("/api/auth", authRouter);

export default app;
