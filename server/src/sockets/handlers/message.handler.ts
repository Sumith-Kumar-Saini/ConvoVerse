import { Socket } from "socket.io";
import { ISocketEventHandler } from "../interfaces/ISocketEventHandler";

export class MessageHandler implements ISocketEventHandler {
  register(socket: Socket): void {
    socket.on("message", () => {
      socket.emit("message", this.generateResponse());
    });
  }

  private generateResponse(): string {
    return Math.random().toString(36).slice(2, 12);
  }
}
