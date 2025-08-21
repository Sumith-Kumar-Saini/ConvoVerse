import express from "express";
import CookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routers/auth.routes";
import ApiResponse from "./middlewares/easyResponse";

import { Response } from "./types";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(CookieParser());

app.use(ApiResponse.easyResponse());

app.get("/", (_, res: Response) => {
  res.easyResponse({ statusCode: 200, message: "Server is running properly" });
});

app.use("/api/auth", authRouter);

export default app;
