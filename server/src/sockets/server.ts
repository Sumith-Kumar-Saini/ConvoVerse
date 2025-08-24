import { Server as ioServer, Socket } from "socket.io";
import cookie from "cookie";
import cookieParser from "cookie-parser";
import { IncomingMessage, Server } from "http";
import { wrapper } from "../utils/socketMiddlewareWrapper";
import { log } from "console";

// Extend IncomingMessage to include cookies property
declare module "http" {
  interface IncomingMessage {
    cookies?: Record<string, string>;
  }
}

export function socketServer(server: Server): Promise<ioServer> {
  return new Promise((resolve, reject) => {
    try {
      const io = new ioServer(server);

      // Middleware setup
      io.use(
        wrapper((req, res, next) => {
          cookieParser()(req, res, next);
          log(req.cookies);
        })
      );
      io.use((socket: Socket, next) => {
        const cookies: Record<string, string> = cookie.parse(
          socket.request.headers?.cookie || ""
        );
        log(cookies);
        socket.request.cookies = cookies;
        next();
      });

      // Handle socket events
      io.on("connection", (socket: Socket) => {
        log("Token", socket.request.cookies);
        log("socket ID", socket.id);

        socket.on("message", (data) => {
          log(data);
          socket.emit("message", Math.random().toString(36).slice(2, 12));
        });

        socket.on("test", (data) => {
          log(data);
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
