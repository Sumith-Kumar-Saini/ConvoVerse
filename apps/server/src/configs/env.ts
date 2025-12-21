import { config } from 'dotenv';
config({ quiet: true }); // Load environment variables

const _config = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/ConvoVerse',
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10) || 10,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
  ENABLE_XSS_PROTECTION: Boolean(process.env.ENABLE_XSS_PROTECTION),
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
  REDIS: {
    HOST: process.env.REDIS_HOST || 'localhost',
    PORT: Number(process.env.REDIS_PORT) || 6379,
    PASSWORD: process.env.REDIS_PASSWORD,
    USERNAME: process.env.REDIS_USERNAME,
    DB: parseInt(process.env.REDIS_DB || '0', 10) || 0,
  },
};

const ENV_DEV = process.env.NODE_ENV == 'testing';
const ENV = ENV_DEV ? _config : Object.freeze(_config);

export { ENV };
