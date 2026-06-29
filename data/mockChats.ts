import { Chat, Message } from '../types/models';
import { mockUsers } from './mockUsers';

/**
 * Mock conversations for the chat list plus a starter message thread per chat.
 * `ChatScreen` seeds from `mockMessagesByChat` and then appends new messages to
 * local state, so the conversation feels live with no backend.
 */
export const mockChats: Chat[] = [
  {
    id: '1',
    name: 'Priya',
    avatar: mockUsers[0].photo,
    message: 'Loved your take on flea markets!',
    time: '2m',
    unread: true,
  },
  {
    id: '2',
    name: 'Maya',
    avatar: mockUsers[1].photo,
    message: 'Coffee this weekend?',
    time: '1h',
  },
  {
    id: '3',
    name: 'Sofia',
    avatar: mockUsers[2].photo,
    message: 'That playlist is unreal 🎧',
    time: '3h',
  },
];

const thread = (chatId: string, lines: Array<[string, boolean]>): Message[] =>
  lines.map(([text, fromMe], i) => ({
    id: `${chatId}_m${i + 1}`,
    chatId,
    text,
    fromMe,
    createdAt: new Date(Date.now() - (lines.length - i) * 60_000).toISOString(),
  }));

export const mockMessagesByChat: Record<string, Message[]> = {
  '1': thread('1', [
    ['Hey! Your intro made me smile 😊', false],
    ['Glad it landed — your gallery photos are stunning', true],
    ['Thank you! Do you visit galleries often?', false],
    ['Every other Sunday. The Whitney is my favourite', true],
  ]),
  '2': thread('2', [
    ['Coffee this weekend?', false],
    ['I would love that. Saturday morning?', true],
    ['Perfect, I know a great spot in the village', false],
  ]),
  '3': thread('3', [
    ['That playlist is unreal 🎧', false],
    ['Right? I had it on repeat all week', true],
  ]),
};

/** Fallback thread for any chat id without a seeded conversation. */
export const defaultMessages = (chatId: string): Message[] =>
  thread(chatId, [['Hey there! 👋', false]]);

export default mockChats;
