import { IRedisClient, IRedisConfig } from "../interfaces/redis.interface";
import { logger } from "../utils/logger";
import Ioredis, { Redis } from "ioredis";

export class RedisClient implements IRedisClient {
  private client: Redis | null = null;

  constructor(private readonly config: IRedisConfig) {}

  private async activateListeners(): Promise<void> {
    this.client
      ?.on("connect", () => logger.info("Redis Connected"))
      ?.on("reconnecting", () => logger.warn("Reconnecting Redis"))
      ?.on("error", (err) => logger.error("Redis Error:", err));
  }

  public async connect(): Promise<void> {
    if (this.client) return;

    try {
      this.client = new Ioredis(this.config);
      await this.activateListeners();
    } catch (err) {
      throw err;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.client) return;
    this.client.quit();
    this.client = null;
    logger.info("Redis Disconnected");
  }

  public getClient(): Redis {
    if (!this.client) {
      throw new Error("Redis client not connected");
    }
    return this.client;
  }
}
