import { PrismaClient } from '@prisma/client';
import { env } from './env';

/**
 * Single shared Prisma client. In development we attach it to `globalThis` so
 * hot-reloads (ts-node-dev) don't exhaust the connection pool with new clients.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.isProd ? ['error'] : ['warn', 'error'],
  });

if (!env.isProd) globalForPrisma.prisma = prisma;

export default prisma;
