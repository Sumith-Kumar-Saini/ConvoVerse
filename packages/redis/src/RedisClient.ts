import Redis, { RedisOptions } from "ioredis";
import { getRedisLogger } from "./logger-plugin";

function getOptions() {
  const options: RedisOptions = {
    host: process.env.REDIS_HOST ?? "127.0.0.1",
    port: Number(process.env.REDIS_PORT ?? 6379),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    db: Number(process.env.REDIS_DB ?? 0),
    lazyConnect: true,
    maxRetriesPerRequest: null,
  };

  return options;
}

function attachLogging(client: Redis, name: string) {
  const logger = getRedisLogger();

  client.on("connect", () => logger.info(`Redis [${name}] connecting`));

  client.on("ready", () => logger.info(`Redis [${name}] ready`));

  client.on("reconnecting", (delay: number) =>
    logger.warn(`Redis [${name}] reconnecting`, { delay })
  );

  client.on("error", (err) =>
    logger.error(`Redis [${name}] error`, { error: err.message })
  );

  client.on("close", () => logger.warn(`Redis [${name}] closed`));
}

export default class RedisClient {
  private static base?: Redis;
  private static pub?: Redis;
  private static sub?: Redis;
  private static connecting?: Promise<Redis>;

  static async getBase(): Promise<Redis> {
    if (this.base) return this.base;

    if (!this.connecting) {
      this.connecting = (async () => {
        const logger = getRedisLogger();
        logger.info("Initializing Redis base client");

        const client = new Redis(getOptions());
        attachLogging(client, "base");

        await client.connect();
        this.base = client;
        this.connecting = undefined;

        return client;
      })();
    }

    return this.connecting;
  }

  static async getPublisher(): Promise<Redis> {
    if (this.pub) return this.pub;

    const base = await this.getBase();
    const logger = getRedisLogger();
    logger.info("Creating Redis publisher");

    const pub = base.duplicate();
    attachLogging(pub, "publisher");

    await pub.connect();
    this.pub = pub;
    return pub;
  }

  static async getSubscriber(): Promise<Redis> {
    if (this.sub) return this.sub;

    const base = await this.getBase();
    const logger = getRedisLogger();
    logger.info("Creating Redis subscriber");

    const sub = base.duplicate();
    attachLogging(sub, "subscriber");

    await sub.connect();
    this.sub = sub;
    return sub;
  }

  static async close(): Promise<void> {
    const logger = getRedisLogger();
    logger.info("Closing Redis connections");

    await Promise.all(
      [this.sub, this.pub, this.base].map(async (client) => {
        if (!client) return;
        try {
          await client.quit();
        } catch (err) {
          logger.error("Redis close error", err);
        }
      })
    );

    this.base = undefined;
    this.pub = undefined;
    this.sub = undefined;
  }
}
