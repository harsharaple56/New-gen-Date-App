import api from './api';
import { ChatDetail, ChatPreview, Paginated } from '../types/models';
import { Envelope, PaginatedEnvelope, mapChat, mapChatDetail } from './adapters';

export interface ChatQuery {
  page?: number;
  limit?: number;
  search?: string;
  flagged?: string;
}

type BackendChat = Parameters<typeof mapChat>[0];
type BackendChatDetail = Parameters<typeof mapChatDetail>[0];

export const chatService = {
  list: (params: ChatQuery): Promise<{ success: boolean } & Paginated<ChatPreview>> =>
    api
      .get<PaginatedEnvelope<BackendChat>>('/admin/chats', {
        params: { page: params.page, limit: params.limit },
      })
      .then((r) => ({
        success: r.data.success,
        data: r.data.data.map(mapChat),
        total: r.data.total,
        page: r.data.page,
        limit: r.data.limit,
        totalPages: r.data.totalPages,
      })),

  get: (id: string): Promise<ChatDetail> =>
    api.get<Envelope<BackendChatDetail>>(`/admin/chats/${id}`).then((r) => mapChatDetail(r.data.data)),

  deleteMessage: (id: string, messageId: string): Promise<ChatDetail> =>
    api
      .delete<Envelope<BackendChatDetail>>(`/admin/chats/${id}/messages/${messageId}`)
      .then((r) => mapChatDetail(r.data.data)),
};
