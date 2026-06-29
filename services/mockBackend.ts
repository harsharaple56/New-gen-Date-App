import { Chat, Match, Message, Profile } from '../types/models';
import { mockUsers, mockCurrentUser } from '../data/mockUsers';
import { mockMatches } from '../data/mockMatches';
import { mockChats, mockMessagesByChat, defaultMessages } from '../data/mockChats';
/**
 * In-memory mock backend.
 *
 * Lets the app run end-to-end without a live server. Every function mimics a
 * network round-trip (latency) and returns domain-typed data sourced from the
 * `/data/mock*` files. Flip `USE_MOCK` in `api.ts` to `false` to hit a real
 * backend instead.
 */

const delay = <T>(value: T, ms = 600): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const profiles: Profile[] = mockUsers.map((p) => ({ ...p }));

export const mockBackend = {
  login: (phone: string) => delay({ otpSent: true, phone }, 500),

  verifyOtp: (phone: string, code: string) =>
    delay({ token: `mock-jwt-${code}-${Date.now()}`, user: { ...mockCurrentUser, phone } }),

  getProfiles: () => delay(profiles.map((p) => ({ ...p })), 700),

  swipeProfile: (profileId: string, direction: 'like' | 'pass') => {
    const profile = profiles.find((p) => p.id === profileId);
    // Simulate a mutual match ~50% of the time on a like.
    const matched = direction === 'like' && !!profile && Math.random() > 0.5;
    return delay({ matched, matchId: matched ? `match_${profileId}` : null });
  },

  getMatches: () => delay<Match[]>(mockMatches.map((m) => ({ ...m })), 700),

  getChats: () => delay<Chat[]>(mockChats.map((c) => ({ ...c })), 600),

  getMessages: (chatId: string) =>
    delay<Message[]>(
      (mockMessagesByChat[chatId] ?? defaultMessages(chatId)).map((m) => ({ ...m })),
      400,
    ),

  sendMessage: (chatId: string, text: string) =>
    delay<Message>(
      {
        id: `msg_${Date.now()}`,
        chatId,
        text,
        fromMe: true,
        createdAt: new Date().toISOString(),
      },
      200,
    ),

  getMe: () => delay(mockCurrentUser, 400),
};

export default mockBackend;
