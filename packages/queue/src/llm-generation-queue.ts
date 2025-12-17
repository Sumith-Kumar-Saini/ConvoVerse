import { Queue } from 'bullmq';
import { type Redis } from 'ioredis';
import { type QueueNames } from '@convoverse/utils';

export const JobQueue = (queueName: QueueNames, connection: Redis) => {
  return new Queue(queueName, { connection });
};
