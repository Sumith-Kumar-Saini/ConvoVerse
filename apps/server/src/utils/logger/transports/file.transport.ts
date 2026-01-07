import path from 'path';

import { transports } from 'winston';

export const fileTransport = (logDir: string) =>
  new transports.File({
    filename: path.join(logDir, 'app.log'),
    level: 'info',
  });
