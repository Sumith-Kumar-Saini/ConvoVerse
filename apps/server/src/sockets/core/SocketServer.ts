import { Server as HttpServer } from 'http';

import { Server as SocketIOServer, Socket } from 'socket.io';

import { ISocketMiddleware } from '../interfaces/ISocketMiddleware';
import { ISocketEventHandler } from '../interfaces/ISocketEventHandler';

export class SocketServer {
  private io: SocketIOServer;

  constructor(
    private readonly httpServer: HttpServer,
    private readonly middlewares: ISocketMiddleware[] = [],
    private readonly handlers: ISocketEventHandler[] = [],
  ) {
    this.io = new SocketIOServer(this.httpServer);
  }

  public start(): void {
    this.applyMiddlewares();
    this.applyHandlers();
  }

  private applyMiddlewares(): void {
    this.middlewares.forEach((mw) => this.io.use(mw.handle.bind(mw)));
  }

  private applyHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      this.handlers.forEach((handler) => handler.register(socket));
    });
  }

  public close(): void {
    this.io.close();
  }
}
