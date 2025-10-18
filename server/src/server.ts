import { RedisProvider } from "./providers/redis-client.provider";
import { socketServer } from "./sockets";
import { logger } from "./utils/logger";
import connectDB from "./configs/db";
import { ENV } from "./configs/env";
import { createServer } from "http";

async function main() {
  const { default: app } = await import("./app"); // dynamic import the Express app for speed

  logger.info("Server initiating");

  const server = createServer(app);
  const { PORT } = ENV;
  const [io, DBConnection, redisClient] = await Promise.all([
    socketServer(server),
    connectDB(),
    RedisProvider.client(),
  ]);

  server.listen(PORT, () => {
    logger.info(`Server Listening on ${PORT}`);
  });

  const shutdown = async () => {
    logger.info("Shutdown initiated");

    server.close(() => {
      logger.info("HTTP server closed");
    });    
    
    io.close();
    await DBConnection?.close();
    await redisClient.disconnect();

    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  logger.error("Startup error", err);
  process.exit(1);
});
