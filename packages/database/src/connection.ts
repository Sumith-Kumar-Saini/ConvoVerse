import mongoose from 'mongoose';
import type winston from 'winston';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 2000;

export async function connection(
  MONGODB_URI: string,
  { logger, retries }: { logger?: winston.Logger; retries: number } = { retries: MAX_RETRIES },
) {
  try {
    await mongoose.connect(MONGODB_URI);
    logger?.info('MongoDB connected successfully');
    return mongoose.connection;
  } catch (err) {
    const attempts = MAX_RETRIES - retries + 1;
    logger?.error(
      `MongoDB connection failed [${attempts} attempt(s) left]: ${(err as Error).message}`,
    );
    if (retries <= 1) {
      logger?.error('Exhausted all retries. Exiting process.');
      process.exit(1); // Critical failure
    }
    logger?.info(`Retrying MongoDB connection in ${RETRY_DELAY_MS / 1000}s...`);
    setTimeout(() => connection(MONGODB_URI, { logger, retries }), RETRY_DELAY_MS);
  }
}
