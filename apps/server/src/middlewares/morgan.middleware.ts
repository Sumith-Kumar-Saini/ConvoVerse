import morgan from 'morgan';

import { loggerStream } from '../utils/logger';

const skip = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'test';
};

// Color helper
const colorStatus = (status: number) => {
  if (status >= 500) return `\x1b[31m${status}\x1b[0m`; // red
  if (status >= 400) return `\x1b[33m${status}\x1b[0m`; // yellow
  if (status >= 300) return `\x1b[36m${status}\x1b[0m`; // cyan
  if (status >= 200) return `\x1b[32m${status}\x1b[0m`; // green
  return status; // default
};

// Define a custom Morgan format
morgan.token('colored-status', (_, res): string => {
  const status = res.statusCode;
  return String(colorStatus(status));
});

export const morganMiddleware = () =>
  morgan(':method :url :colored-status :res[content-length] - :response-time ms', {
    stream: loggerStream,
    skip,
  });
