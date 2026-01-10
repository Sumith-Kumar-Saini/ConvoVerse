import rateLimit from 'express-rate-limit';
import RedisClient from '@convoverse/redis';
import { RedisReply, RedisStore } from 'rate-limit-redis';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  store: new RedisStore({
    sendCommand: async (command: string, ...args: string[]): Promise<RedisReply> => {
      const redis = await RedisClient.getBase();
      const result = await redis.call(command, ...args);

      if (
        typeof result === 'string' ||
        typeof result === 'number' ||
        Buffer.isBuffer(result) ||
        result === null ||
        Array.isArray(result)
      ) {
        return result as RedisReply;
      }

      throw new Error('Unexpected Redis reply type');
    },
  }),
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

export default limiter;
