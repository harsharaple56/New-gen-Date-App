import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { matchService, MatchQuery } from '../services/matchService';
import { queryKeys } from '../queryClient';

export function useMatches(params: MatchQuery) {
  return useQuery({
    queryKey: queryKeys.matches(params),
    queryFn: () => matchService.list(params),
    placeholderData: (prev) => prev,
  });
}

export function useDeleteMatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => matchService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['matches'] }),
  });
}
