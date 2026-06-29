import { QueryClient } from '@tanstack/react-query';

/** Shared React Query client with sensible mobile defaults. */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

export const queryKeys = {
  profiles: ['profiles'] as const,
  matches: ['matches'] as const,
  chats: ['chats'] as const,
  messages: (chatId: string) => ['messages', chatId] as const,
  me: ['me'] as const,
};

export default queryClient;
