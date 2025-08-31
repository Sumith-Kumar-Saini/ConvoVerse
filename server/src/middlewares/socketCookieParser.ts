import { ExtendedError, Socket } from "socket.io";
import cookie from "cookie";

export function cookieParser() {
  return (socket: Socket, next: (err?: ExtendedError | undefined) => void) => {
    const cookies: Record<string, string> = cookie.parse(
      socket.handshake.headers?.cookie || ""
    );
    socket.request.cookies = cookies;
    next();
  };
}
