import path from 'path';
import fs from 'fs';

import { createLogger } from 'winston';

import { logFormat } from './format';
import { consoleTransport } from './transports/console.transport';
import { fileTransport } from './transports/file.transport';

// Ensure logs directory exists
const logDir = path.resolve(__dirname, '../../../../logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

export const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: [consoleTransport, fileTransport(logDir)],
});

// Optional: stream for Morgan integration
export const loggerStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};
