import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationService, BroadcastPayload } from '../services/notificationService';
import { queryKeys } from '../queryClient';

export function useNotifications() {
  return useQuery({ queryKey: queryKeys.notifications, queryFn: notificationService.list });
}

export function useBroadcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BroadcastPayload) => notificationService.broadcast(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.notifications }),
  });
}
