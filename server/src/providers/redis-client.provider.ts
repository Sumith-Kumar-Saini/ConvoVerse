import { IRedisClient } from "../interfaces/redis.interface";
import { RedisConfig } from "../configs/redis.config";
import { RedisClient } from "../infra/redis-client";
import { ENV } from "../configs/env";

export class RedisProvider {
  private static instance: RedisClient | null = null;
  private static connecting: Promise<void> | null = null;

  private static async init(): Promise<RedisClient> {
    if (!this.instance) {
      this.instance = new RedisClient(new RedisConfig(ENV.REDIS));
      this.connecting = this.instance.connect();
      await this.connecting;
      this.connecting = null;
    } else if (this.connecting) {
      await this.connecting;
    }

    return this.instance;
  }

  static async client(): Promise<IRedisClient> {
    return await this.init();
  }

  static async disconnect(): Promise<void> {
    if (this.instance) {
      await this.instance.disconnect();
      this.instance = null;
    }
  }
}
