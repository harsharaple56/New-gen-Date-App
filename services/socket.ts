import { io, Socket } from 'socket.io-client';
import { Message } from '../types/models';
import { USE_MOCK, API_HOST, mapMessage } from './api';
import { useAppStore } from '../store/useAppStore';

/**
 * Realtime chat transport.
 *
 * Wraps a Socket.IO client behind a tiny interface so screens don't care
 * whether a backend exists. Against the real backend it connects to the
 * JWT-authenticated Socket.IO server and listens for `new_message` events. In
 * mock mode it simulates the other person typing back a reply so the chat UI
 * is fully interactive offline.
 */

type MessageHandler = (message: Message) => void;

let socket: Socket | null = null;
const handlers = new Set<MessageHandler>();

const MOCK_REPLIES = [
  'Haha that\'s so true 😄',
  'Tell me more!',
  'I was just thinking the same thing.',
  'Okay you have great taste.',
  'When are you free this week?',
];

function emitToHandlers(message: Message) {
  handlers.forEach((handler) => handler(message));
}

export const chatSocket = {
  connect() {
    if (USE_MOCK || socket) return;
    socket = io(API_HOST, {
      transports: ['websocket'],
      auth: { token: useAppStore.getState().token },
    });

    // The server broadcasts persisted messages to the chat room and the
    // recipient's personal room. Map them into the app's Message shape.
    socket.on('new_message', (raw) => {
      const currentUserId = useAppStore.getState().user?.id;
      emitToHandlers(mapMessage(raw, currentUserId));
    });
  },

  disconnect() {
    socket?.disconnect();
    socket = null;
    handlers.clear();
  },

  /** Join a conversation room to receive live updates while it's open. */
  joinChat(chatId: string) {
    if (!USE_MOCK) socket?.emit('join_chat', chatId);
  },

  /** Leave a conversation room. */
  leaveChat(chatId: string) {
    if (!USE_MOCK) socket?.emit('leave_chat', chatId);
  },

  /** Subscribe to inbound messages. Returns an unsubscribe function. */
  onMessage(handler: MessageHandler): () => void {
    handlers.add(handler);
    return () => handlers.delete(handler);
  },

  /**
   * In real mode the REST POST already persists the message and the server
   * broadcasts it, so this is a no-op. In mock mode it schedules a simulated
   * reply from the match.
   */
  send(chatId: string, _message: Message) {
    if (!USE_MOCK) return;

    setTimeout(() => {
      const reply: Message = {
        id: `msg_${Date.now()}`,
        chatId,
        text: MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)],
        fromMe: false,
        createdAt: new Date().toISOString(),
      };
      emitToHandlers(reply);
    }, 1200);
  },
};

export default chatSocket;
