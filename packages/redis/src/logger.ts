import { RedisLogger } from "./types";

export const defaultLogger: RedisLogger = {
  debug: () => {},
  info: console.info,
  warn: console.warn,
  error: console.error,
};
