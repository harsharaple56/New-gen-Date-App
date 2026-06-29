import path from 'path';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import routes from './routes';
import { notFoundHandler, errorHandler } from './middleware/error.middleware';

const app: Application = express();

app.use(helmet());
app.use(
  cors({
    origin: (origin, cb) => {
      // Allow non-browser clients (no origin) and any configured origin.
      if (!origin || env.clientUrls.includes(origin)) return cb(null, true);
      return cb(null, env.clientUrls.includes('*'));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.isProd ? 'combined' : 'dev'));

// Serve locally stored uploads (Cloudinary fallback).
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// Health check.
app.get('/health', (_req: Request, res: Response) => {
  res.json({ success: true, status: 'ok', uptime: process.uptime() });
});

// Throttle auth endpoints to slow down brute-force attempts.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts, please try again later' },
});
app.use('/api/auth', authLimiter);

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
