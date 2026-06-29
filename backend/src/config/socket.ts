import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { Redis } from 'ioredis';
import { verifyToken } from '../utils/jwt';
import { env } from '../config/env';
import { chatService } from '../services/chat.service';

let io: Server | null = null;

const userRoom = (userId: string) => `user:${userId}`;
const chatRoom = (chatId: string) => `chat:${chatId}`;

interface AuthedSocket extends Socket {
  data: { userId: string; role: string };
}

/**
 * Wire up the Redis adapter so Socket.IO events fan out across every backend
 * instance. Without it, two users connected to different replicas would never
 * see each other's messages. Enabled automatically when REDIS_URL is set.
 */
function attachRedisAdapter(server: Server) {
  if (!env.redisUrl) return;
  const pubClient = new Redis(env.redisUrl, { maxRetriesPerRequest: null, lazyConnect: false });
  const subClient = pubClient.duplicate();
  pubClient.on('error', (err) => console.error('[redis-adapter] pub error:', err.message));
  subClient.on('error', (err) => console.error('[redis-adapter] sub error:', err.message));
  server.adapter(createAdapter(pubClient, subClient));
  // eslint-disable-next-line no-console
  console.log('🔌 Socket.IO Redis adapter enabled (horizontal scaling on)');
}

export function initSocket(server: HttpServer): Server {
  io = new Server(server, {
    cors: { origin: env.clientUrls, credentials: true },
  });

  attachRedisAdapter(io);

  // JWT auth handshake.
  io.use((socket, next) => {
    try {
      const token =
        (socket.handshake.auth?.token as string | undefined) ??
        socket.handshake.headers.authorization?.replace('Bearer ', '');
      if (!token) return next(new Error('Authentication required'));
      const payload = verifyToken(token);
      (socket as AuthedSocket).data = { userId: payload.sub, role: payload.role };
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const { userId } = (socket as AuthedSocket).data;
    socket.join(userRoom(userId));

    socket.on('join_chat', async (chatId: string, ack?: (ok: boolean) => void) => {
      try {
        await chatService.loadChatForMember(userId, chatId);
        socket.join(chatRoom(chatId));
        ack?.(true);
      } catch {
        ack?.(false);
      }
    });

    socket.on('leave_chat', (chatId: string) => socket.leave(chatRoom(chatId)));

    socket.on(
      'send_message',
      async (
        payload: { chatId: string; text?: string; imageUrl?: string },
        ack?: (res: unknown) => void,
      ) => {
        try {
          const { message, recipientId } = await chatService.sendMessage(userId, payload.chatId, {
            text: payload.text,
            imageUrl: payload.imageUrl,
          });
          io?.to(chatRoom(payload.chatId)).emit('new_message', message);
          io?.to(userRoom(recipientId)).emit('new_message', message);
          ack?.({ success: true, message });
        } catch (err) {
          ack?.({ success: false, message: err instanceof Error ? err.message : 'Failed to send' });
        }
      },
    );

    socket.on('typing', (chatId: string) => {
      socket.to(chatRoom(chatId)).emit('user_typing', { chatId, userId });
    });

    socket.on('stop_typing', (chatId: string) => {
      socket.to(chatRoom(chatId)).emit('user_stop_typing', { chatId, userId });
    });

    socket.on('mark_read', async (chatId: string) => {
      try {
        await chatService.markRead(userId, chatId);
        socket.to(chatRoom(chatId)).emit('message_read', { chatId, readerId: userId });
      } catch {
        /* ignore */
      }
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) throw new Error('Socket.IO not initialised');
  return io;
}

/** Emit an event to a specific user's room (used by REST controllers). */
export function emitToUser(userId: string, event: string, payload: unknown) {
  io?.to(userRoom(userId)).emit(event, payload);
}

/** Emit an event to everyone in a chat room. */
export function emitToChat(chatId: string, event: string, payload: unknown) {
  io?.to(chatRoom(chatId)).emit(event, payload);
}
