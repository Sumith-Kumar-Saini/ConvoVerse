import express from "express";
import CookieParser from "cookie-parser";
import cors from "cors";

import ApiResponse from "./middlewares/easyResponse";

import { Response } from "./types";
import { time, timeEnd } from "console";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(CookieParser());

app.use(ApiResponse.easyResponse());

// Base route
app.get("/", (_, res: Response) => {
  res.easyResponse({
    statusCode: 200,
    message: "Server is running properly",
  });
});

// Lazy-load routes
app.use("/api/auth", async (req, res, next) => {
  const { default: authRouter } = await import("./routers/auth.routes");
  return authRouter(req, res, next);
});

export default app;
