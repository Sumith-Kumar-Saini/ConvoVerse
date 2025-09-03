import { Socket } from "socket.io";

declare module "socket.io" {
  interface Socket {
    user?: any // here we would have user types
  }
}
