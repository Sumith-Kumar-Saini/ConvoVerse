/**
 * app.ts — Express Application Setup
 * ----------------------------------
 * Optimized for production-grade performance, security, and maintainability.
 */

import express, { Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { xss } from 'express-xss-sanitizer';

import { morganMiddleware } from './middlewares/morgan.middleware';
import globalErrorHandler from './middlewares/errorHandler';
import lazyRouter from './utils/lazyLoadRoutes';
import AppError from './utils/AppError';
import { ENV } from './configs/env';
import limiter from './middlewares/rateLimiter';

const app = express();

// ----------------------
// 🌐 Global Middlewares
// ----------------------

// Security first
app.use(helmet());
app.use(cors({ origin: ENV.CLIENT_ORIGIN, credentials: true }));

// Parse requests
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Compression for responses
app.use(compression());

// Sanitize user input
if (ENV.ENABLE_XSS_PROTECTION) app.use(xss());

// Request logger (only in non-production)
if (ENV.NODE_ENV !== 'production') app.use(morganMiddleware());

// Rate limiting
app.use(limiter);

// ----------------------
// 🧩 Routes
// ----------------------

app.get('/', (_, res: Response) => {
  res.status(200).json({ status: 'success', message: 'Server is running' });
});

// Preload routes in production for faster cold start
(async () => {
  const authRouter = lazyRouter(() => import('./routers/auth.routes'));
  const chatRouter = lazyRouter(() => import('./routers/chat.routes'));

  app.use('/api/auth', authRouter);
  app.use('/api/chat', chatRouter);
})();

// ----------------------
// 🚫 404 Handler
// ----------------------
app.all('/*path', (req, _, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// ----------------------
// ⚙️ Global Error Handler
// ----------------------
app.use(globalErrorHandler());

export default app;
