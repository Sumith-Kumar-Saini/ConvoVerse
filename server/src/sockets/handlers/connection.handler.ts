import { Socket } from "socket.io";
import { ISocketEventHandler } from "../interfaces/ISocketEventHandler";
import { log } from "console";

export class ConnectionHandler implements ISocketEventHandler {
  register(socket: Socket): void {
    socket.on("disconnect", () => log(`User disconnected: ${socket.id}`));
  }
}
