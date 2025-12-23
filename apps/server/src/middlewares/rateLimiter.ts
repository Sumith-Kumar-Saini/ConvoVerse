import rateLimit from 'express-rate-limit';
import RedisClient from '@convoverse/redis';
import { RedisReply, RedisStore } from 'rate-limit-redis';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  store: new RedisStore({
    sendCommand: async (...args: string[]): Promise<RedisReply> =>
      // @ts-ignore: TypeScript issue with sendCommand args spread
      (await RedisClient.getBase()).sendCommand(args) as RedisReply,
  }),
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

export default limiter;
