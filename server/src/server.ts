import { createServer } from "http";
import { ENV } from "./configs/env";
import connectDB from "./configs/db";
import { socketServer } from "./sockets";
import { logger } from "./utils/logger";

async function main() {
  const { default: app } = await import("./app"); // dynamic import the Express app for speed

  const server = createServer(app);
  const { PORT } = ENV;
  const [io, DBConnection] = await Promise.all([
    socketServer(server),
    connectDB(),
  ]);

  server.listen(PORT, () => {
    logger.info(`Server Listening on ${PORT}`);
  });

  const shutdown = async () => {
    logger.info("Shutdown initiated");

    io.close();
    DBConnection?.close();

    server.close(() => {
      logger.info("HTTP server closed");
    });
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  logger.error("Startup error", err);
  process.exit(1);
});
