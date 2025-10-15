import { Socket } from "socket.io";
import { ISocketEventHandler } from "../interfaces/ISocketEventHandler";

export class ChatHandler implements ISocketEventHandler {
  register(socket: Socket): void {
    socket.on(
      "chat:open",
      ({ chatId }: { chatId: string }, ack?: (response: any) => void) =>
        ack && ack("Chat open Event is working")
    );
  }
}
