import { create } from 'zustand';
import { User } from '../types/models';

interface UserFilters {
  page: number;
  limit: number;
  search: string;
  status: string;
  premium: string;
  sortBy: string;
  order: 'asc' | 'desc';
}

interface UserState {
  users: User[];
  filters: UserFilters;
  selectedUser: User | null;
  setUsers: (users: User[]) => void;
  setFilters: (patch: Partial<UserFilters>) => void;
  setSelectedUser: (user: User | null) => void;
}

const defaultFilters: UserFilters = {
  page: 1,
  limit: 10,
  search: '',
  status: '',
  premium: '',
  sortBy: 'createdAt',
  order: 'desc',
};

export const useUserStore = create<UserState>((set) => ({
  users: [],
  filters: defaultFilters,
  selectedUser: null,
  setUsers: (users) => set({ users }),
  setFilters: (patch) =>
    set((state) => ({
      // Reset to page 1 whenever a filter other than the page itself changes.
      filters: { ...state.filters, ...patch, page: patch.page ?? 1 },
    })),
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
