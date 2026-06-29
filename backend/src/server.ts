import http from 'http';
import app from './app';
import { env } from './config/env';
import { initSocket } from './config/socket';
import { prisma } from './config/db';

const server = http.createServer(app);

// Attach Socket.IO (JWT-authenticated realtime chat).
initSocket(server);

server.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Align API running on http://localhost:${env.port} (${env.nodeEnv})`);
});

async function shutdown(signal: string) {
  // eslint-disable-next-line no-console
  console.log(`\n${signal} received, shutting down...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
  // Force-exit if connections don't drain in time.
  setTimeout(() => process.exit(1), 10000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

export default server;
