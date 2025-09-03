import { Server as ioServer, Socket } from "socket.io";
import { Server } from "http";
import { log } from "console";

// custom modules
import { cookieParser } from "../middlewares/socketCookieParser";
import Controller from "../controllers/mainSocket.controller";

export function socketServer(server: Server): Promise<ioServer> {
  return new Promise((resolve, reject) => {
    try {
      // socket initialize
      const io = new ioServer(server);

      // Middleware setup
      io.use(cookieParser());

      // Handle socket events
      io.on("connection", Controller);

      // Resolve the promise with the IO instance when setup is complete
      resolve(io);
    } catch (err) {
      // Reject the promise in case of errors
      reject(err);
    }
  });
}
