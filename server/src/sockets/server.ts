import { Server as ioServer, Socket } from "socket.io";
import { Server } from "http";
import { log } from "console";

// custom modules
import { cookieParser } from "../middlewares/socketCookieParser";

export function socketServer(server: Server): Promise<ioServer> {
  return new Promise((resolve, reject) => {
    try {
      const io = new ioServer(server);

      // Middleware setup
      io.use(cookieParser());

      // Handle socket events
      io.on("connection", (socket: Socket) => {
        socket.on("message", (data) => {
          socket.emit("message", Math.random().toString(36).slice(2, 12));
        });

        socket.on("disconnect", () => {
          log("user disconnected", socket.id);
        });
      });

      // Resolve the promise with the IO instance when setup is complete
      resolve(io);
    } catch (err) {
      // Reject the promise in case of errors
      reject(err);
    }
  });
}
