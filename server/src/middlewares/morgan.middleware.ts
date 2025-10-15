// server/src/middlewares/morgan.middleware.ts
import morgan from "morgan";
import { loggerStream } from "../utils/logger";

const skip = () => {
  const env = process.env.NODE_ENV || "development";
  return env === "test";
};

// Morgan combined with Winston
export const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  { stream: loggerStream, skip }
);
