/**
 * server.ts — Application Entry Point
 * -----------------------------------
 * Starts HTTP server, initializes DB, Redis, and Socket.io.
 * Implements graceful shutdown and non-blocking startup.
 */

import { createServer } from "http";

import RedisClient, { setRedisLogger } from "@convoverse/redis";

import { logger } from "./utils/logger";
import { ENV } from "./configs/env";
import connectDB from "./configs/db";
import { socketServer } from "./sockets";

setRedisLogger({
  debug: logger.debug.bind(logger),
  error: logger.error.bind(logger),
  info: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
});

async function bootstrap() {
  logger.info("Starting server initialization...");

  const { default: app } = await import("./app");
  const server = createServer(app);
  const { PORT } = ENV;

  // Start listening immediately (non-blocking startup)
  server.listen(PORT, () => {
    logger.info(`Server is listening on port ${PORT}`);
  });

  // Initialize dependencies asynchronously
  try {
    logger.info("Connecting dependencies...");

    const [dbConnection, redisClient, io] = await Promise.all([
      connectDB(),
      RedisClient.getBase(),
      socketServer(server),
    ]);

    logger.info("All dependencies connected successfully");

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.warn(`${signal} received. Starting graceful shutdown...`);

      io?.close();
      await dbConnection?.close();
      await redisClient.disconnect();

      server.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (err) {
    logger.error("Startup error:", err);
    process.exit(1);
  }
}

bootstrap();
