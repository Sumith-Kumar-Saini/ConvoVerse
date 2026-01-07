import { Socket } from 'socket.io';

import { ISocketEventHandler } from '../interfaces/ISocketEventHandler';
import { logger } from '../../utils/logger';

export class ConnectionHandler implements ISocketEventHandler {
  register(socket: Socket): void {
    socket.on('disconnect', () => logger.info(`User disconnected: ${socket.id}`));
  }
}
