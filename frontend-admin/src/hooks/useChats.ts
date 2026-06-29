import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chatService, ChatQuery } from '../services/chatService';
import { queryKeys } from '../queryClient';

export function useChats(params: ChatQuery) {
  return useQuery({
    queryKey: queryKeys.chats(params),
    queryFn: () => chatService.list(params),
    placeholderData: (prev) => prev,
  });
}

export function useChat(id: string | null) {
  return useQuery({
    queryKey: queryKeys.chat(id ?? ''),
    queryFn: () => chatService.get(id as string),
    enabled: Boolean(id),
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chatId, messageId }: { chatId: string; messageId: string }) =>
      chatService.deleteMessage(chatId, messageId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat(variables.chatId) });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
}
