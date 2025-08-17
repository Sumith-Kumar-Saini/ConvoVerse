import dotenv from "dotenv";
import { createServer } from "http";
import app from "./app"; // Import the Express app

dotenv.config({ quiet: true }); // Load environment variables

const server = createServer(app);

server.listen(3000, () => {
  console.log("Server is running on PORT 3000");
});
