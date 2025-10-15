import { Socket } from "socket.io";

export interface ISocketMiddleware {
  handle(socket: Socket, next: (err?: Error) => void): void;
}
