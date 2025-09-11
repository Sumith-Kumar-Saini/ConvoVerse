import express from "express";
import CookieParser from "cookie-parser";
import cors from "cors";

import ApiResponse from "./middlewares/easyResponse";

import { Response } from "./types";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(CookieParser());

app.use(ApiResponse.easyResponse());

// Base route
app.get("/", (_, res: Response) => {
  const message = "Server is running properly";
  res.easyResponse(200, message);
});

// Lazy-load routes
app.use("/api/auth", async (req, res, next) => {
  const { default: authRouter } = await import("./routers/auth.routes");
  return authRouter(req, res, next);
});

app.use("/api/chat", async (req, res, next) => {
  
})

export default app;
