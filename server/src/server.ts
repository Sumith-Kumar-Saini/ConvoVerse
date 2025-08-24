import dotenv from "dotenv";
dotenv.config({ quiet: true }); // Load environment variables

import { createServer } from "http";
import app from "./app"; // Import the Express app
import { ENV } from "./configs/config";
import connectDB from "./configs/db";
import { socketServer } from "./sockets/server";

async function main() {
  const server = createServer(app);
  const { PORT } = ENV;
  const [io, DBConnection] = await Promise.all([
    socketServer(server),
    connectDB(),
  ]);

  server.listen(PORT, () => {
    console.error(`Server Listening on ${PORT}`);
  });

  const shutdown = async () => {
    console.error("Shutdown initiated");

    io.close();
    DBConnection?.close();

    server.close(() => {
      console.error("HTTP server closed");
    });
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("Startup error", err);
  process.exit(1);
});
