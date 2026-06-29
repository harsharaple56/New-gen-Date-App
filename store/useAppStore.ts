import { create } from 'zustand';
import { Chat, Match, Message, Profile, User } from '../types/models';

/**
 * Global app state (Zustand).
 *
 * Holds session, the swipe deck, matches, chats and the currently selected
 * profile. Server data (profiles/matches/chats/messages) is fetched with React
 * Query; the slices here are the source of truth for optimistic UI updates and
 * realtime socket events.
 */
type AppState = {
  // Session
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  onboardingComplete: boolean;

  // Data
  profiles: Profile[];
  matches: Match[];
  chats: Chat[];
  messagesByChat: Record<string, Message[]>;
  selectedProfile: Profile | null;

  // Session actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  completeOnboarding: () => void;

  // Data setters
  setProfiles: (profiles: Profile[]) => void;
  removeProfile: (id: string) => void;
  setMatches: (matches: Match[]) => void;
  addMatch: (match: Match) => void;
  setChats: (chats: Chat[]) => void;
  setSelectedProfile: (profile: Profile | null) => void;

  // Messaging
  setMessages: (chatId: string, messages: Message[]) => void;
  addMessage: (chatId: string, message: Message) => void;
};

export const useAppStore = create<AppState>((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,
  onboardingComplete: false,

  profiles: [],
  matches: [],
  chats: [],
  messagesByChat: {},
  selectedProfile: null,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  login: (user, token) => set({ user, token, isLoggedIn: true }),
  logout: () =>
    set({
      user: null,
      token: null,
      isLoggedIn: false,
      onboardingComplete: false,
      profiles: [],
      matches: [],
      chats: [],
      messagesByChat: {},
      selectedProfile: null,
    }),
  completeOnboarding: () => set({ onboardingComplete: true }),

  setProfiles: (profiles) => set({ profiles }),
  removeProfile: (id) => set((state) => ({ profiles: state.profiles.filter((p) => p.id !== id) })),
  setMatches: (matches) => set({ matches }),
  addMatch: (match) =>
    set((state) =>
      state.matches.some((m) => m.id === match.id)
        ? state
        : { matches: [match, ...state.matches] },
    ),
  setChats: (chats) => set({ chats }),
  setSelectedProfile: (selectedProfile) => set({ selectedProfile }),

  setMessages: (chatId, messages) =>
    set((state) => ({ messagesByChat: { ...state.messagesByChat, [chatId]: messages } })),
  addMessage: (chatId, message) =>
    set((state) => {
      const existing = state.messagesByChat[chatId] ?? [];
      // De-dupe by id so an optimistic send + the server's socket echo don't
      // produce two bubbles for the same message.
      if (existing.some((m) => m.id === message.id)) return state;
      return {
        messagesByChat: {
          ...state.messagesByChat,
          [chatId]: [...existing, message],
        },
      };
    }),
}));

export default useAppStore;
