import dotenv from "dotenv";
dotenv.config({ quiet: true }); // Load environment variables

import { createServer } from "http";
import app from "./app"; // Import the Express app
import { ENV } from "./configs/config";
import connectDB from "./configs/db";

async function main() {
  const server = createServer(app);
  const { PORT } = ENV;

  await connectDB();

  server.listen(PORT, () => {
    console.error(`Server Listening on ${PORT}`);
  });

  const shutdown = async () => {
    console.error("Shutdown initiated");
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
