import { IRedisConfig } from "../interfaces/redis.interface";
import { ENV } from "./env";

export class RedisConfig implements IRedisConfig {
  public host: string;
  public port: number;
  public db?: number;
  public username?: string;
  public password?: string;

  constructor() {
    const { REDIS } = ENV;
    this.host = REDIS.HOST;
    this.port = REDIS.PORT;
    this.username = REDIS.USERNAME;
    this.password = REDIS.PASSWORD;
    this.db = REDIS.DB;
  }
}
