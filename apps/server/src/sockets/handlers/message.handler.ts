import { Socket } from 'socket.io';

import { ISocketEventHandler } from '../interfaces/ISocketEventHandler';

export class MessageHandler implements ISocketEventHandler {
  register(socket: Socket): void {
    socket.on('message', (data: any, ack?: (response: any) => void) => {
      ack && ack('hello world');
    });

    socket.on('msg:join', ({ chatId }, ask?: (response: unknown) => void) => {
      // user can join to stream if we want
    });

    socket.on(
      'msg:send',
      (
        { chatId, message }: { chatId: string; message: string },
        ask?: (response: unknown) => void,
      ) => {
        // check if the chat id exits or not
        // send the job to llm worker
        // after that send the job id and join the user with chat id
        // stream the content via chat id room with redis pub/sub
        // end the stream using redis pub/sub
      },
    );
  }
}
