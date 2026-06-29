import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService, UserQuery } from '../services/userService';
import { useUserStore } from '../store/userStore';
import { queryKeys } from '../queryClient';
import { User } from '../types/models';

export function useUsers(params: UserQuery) {
  const setUsers = useUserStore((s) => s.setUsers);
  const query = useQuery({
    queryKey: queryKeys.users(params),
    queryFn: () => userService.list(params),
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    if (query.data?.data) setUsers(query.data.data);
  }, [query.data, setUsers]);

  return query;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<User> }) => userService.update(id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats });
    },
  });
}
