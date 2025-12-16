import { Socket } from "socket.io";

import { ISocketEventHandler } from "../interfaces/ISocketEventHandler";

export class ChatHandler implements ISocketEventHandler {
  register(socket: Socket): void {
    socket.on(
      "chat:open",
      ({ chatId }: { chatId: string }, ack?: (response: any) => void) => {
        // load the STM to memory
        // give ack to client socket for next process
        // ( optional ) ping the worker running on BullMQ
      }
    );
  }
}
