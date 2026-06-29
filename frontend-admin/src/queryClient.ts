import { QueryClient } from '@tanstack/react-query';

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
  me: ['me'] as const,
  dashboardStats: ['dashboard', 'stats'] as const,
  dashboardCharts: ['dashboard', 'charts'] as const,
  users: (params: object) => ['users', params] as const,
  user: (id: string) => ['user', id] as const,
  matches: (params: object) => ['matches', params] as const,
  chats: (params: object) => ['chats', params] as const,
  chat: (id: string) => ['chat', id] as const,
  reports: (params: object) => ['reports', params] as const,
  payments: (params: object) => ['payments', params] as const,
  paymentStats: ['payments', 'stats'] as const,
  notifications: ['notifications'] as const,
};
