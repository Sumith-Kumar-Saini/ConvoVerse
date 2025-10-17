import { Redis, RedisOptions } from "ioredis";

export interface IRedisService {
  readonly client: Redis;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getClient(): Redis;
}

export interface IRedisConfig extends RedisOptions {}
