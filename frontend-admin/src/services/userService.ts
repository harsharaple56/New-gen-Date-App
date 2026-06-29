import api from './api';
import { Paginated, User } from '../types/models';
import { PaginatedEnvelope, Envelope, mapUser } from './adapters';

export interface UserQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  premium?: string;
  sortBy?: string;
  order?: string;
}

type BackendUser = Parameters<typeof mapUser>[0];

export const userService = {
  list: (params: UserQuery): Promise<{ success: boolean } & Paginated<User>> => {
    const query: Record<string, unknown> = {
      page: params.page,
      limit: params.limit,
      search: params.search || undefined,
    };
    if (params.status === 'blocked' || params.status === 'banned') query.isBlocked = true;
    else if (params.status === 'active') query.isBlocked = false;

    return api
      .get<PaginatedEnvelope<BackendUser>>('/admin/users', { params: query })
      .then((r) => ({
        success: r.data.success,
        data: r.data.data.map(mapUser),
        total: r.data.total,
        page: r.data.page,
        limit: r.data.limit,
        totalPages: r.data.totalPages,
      }));
  },

  get: (id: string) =>
    api
      .get<PaginatedEnvelope<BackendUser>>('/admin/users', { params: { search: id, limit: 100 } })
      .then((r) => {
        const found = r.data.data.find((u) => u.id === id);
        if (!found) throw new Error('User not found');
        return mapUser(found);
      }),

  // Only block/unblock is supported server-side; map a status patch to it.
  update: (id: string, patch: Partial<User>) => {
    const isBlocked = patch.status ? patch.status !== 'active' : undefined;
    return api
      .patch<Envelope<{ id: string; isBlocked: boolean }>>(`/admin/users/${id}/block`, { isBlocked })
      .then((r) => ({ id: r.data.data.id, status: r.data.data.isBlocked ? 'blocked' : 'active' } as unknown as User));
  },

  remove: (id: string) =>
    api
      .delete<Envelope<{ deleted: boolean }>>(`/admin/users/${id}`)
      .then((r) => ({ success: r.data.success, message: 'User deleted' })),
};
