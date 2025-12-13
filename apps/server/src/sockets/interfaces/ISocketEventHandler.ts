import { Socket } from "socket.io";

export interface ISocketEventHandler {
  register(socket: Socket): void;
}
