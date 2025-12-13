import { RedisLogger } from "./types";
import { defaultLogger } from "./logger";

let activeLogger: RedisLogger = defaultLogger;

export function setRedisLogger(logger: RedisLogger) {
  activeLogger = logger;
}

export function getRedisLogger(): RedisLogger {
  return activeLogger;
}
