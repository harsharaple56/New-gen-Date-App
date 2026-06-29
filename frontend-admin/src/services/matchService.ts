import api from './api';
import { Match, Paginated } from '../types/models';
import { Envelope, PaginatedEnvelope, mapMatch } from './adapters';

export interface MatchQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

type BackendMatch = Parameters<typeof mapMatch>[0];

export const matchService = {
  list: (params: MatchQuery): Promise<{ success: boolean } & Paginated<Match>> =>
    api
      .get<PaginatedEnvelope<BackendMatch>>('/admin/matches', {
        params: { page: params.page, limit: params.limit },
      })
      .then((r) => ({
        success: r.data.success,
        data: r.data.data.map(mapMatch),
        total: r.data.total,
        page: r.data.page,
        limit: r.data.limit,
        totalPages: r.data.totalPages,
      })),

  remove: (id: string) =>
    api
      .delete<Envelope<{ id: string; status: string }>>(`/admin/matches/${id}`)
      .then((r) => ({ success: r.data.success, message: 'Match removed' })),
};
