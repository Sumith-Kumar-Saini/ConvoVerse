import { config } from "dotenv";
config({ quiet: true }); // Load environment variables

const _config = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  BCRYPT_SALT_ROUNDS:
    parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10) || 10,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
};

const ENV_DEV = process.env.NODE_ENV == "testing";
const ENV = ENV_DEV ? _config : Object.freeze(_config);

export { ENV };
