import "./types";
import express, { Response } from "express";
import CookieParser from "cookie-parser";
import helmet from "helmet";
import { xss } from "express-xss-sanitizer";
import cors from "cors";

import { morganMiddleware } from "./middlewares/morgan.middleware";
import globalErrorHandler from "./middlewares/errorHandler";
import lazyRouter from "./utils/lazyLoadRoutes";
import AppError from "./utils/AppError";

const app = express();

// Middleware
app.use(xss());
app.use(cors());
app.use(helmet());
app.use(CookieParser());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware());

// Base route
app.get("/", (_, res: Response) => {
  const message = "Server is running properly";
  res.status(200).json({ message });
});

// Lazy-load routes
app.use(
  "/api/auth",
  lazyRouter(() => import("./routers/auth.routes"))
);

app.use(
  "/api/chat",
  lazyRouter(() => import("./routers/chat.routes"))
);

// Handle unfounded routes (404)
app.all("/*path", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler());

export default app;
