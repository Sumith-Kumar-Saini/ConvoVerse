import { ISocketMiddleware } from "../interfaces/ISocketMiddleware";
import { Socket } from "socket.io";
import cookie from "cookie";

export class CookieMiddleware implements ISocketMiddleware {
  handle(socket: Socket, next: (err?: Error) => void): void {
    const cookies: Record<string, string> = cookie.parse(
      socket.request.headers?.cookie || ""
    );
    socket.request.cookies = cookies;
    next();
  }
}
