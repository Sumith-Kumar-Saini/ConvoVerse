// src/app/socketBootstrap.ts
import { SocketServer } from "./core/SocketServer";
import { CookieMiddleware } from "./middlewares/cookie.middleware";
import { MessageHandler } from "./handlers/message.handler";
import { ConnectionHandler } from "./handlers/connection.handler";
import { ChatHandler } from "./handlers/chat.handler";
import { Server } from "http";

export function socketServer(server: Server): SocketServer {
  const middlewares = [new CookieMiddleware()];
  const handlers = [
    new ConnectionHandler(),
    new MessageHandler(),
    new ChatHandler(),
  ];

  const socketServer = new SocketServer(server, middlewares, handlers);
  socketServer.start();

  return socketServer;
}
