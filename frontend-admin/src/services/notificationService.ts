import api from './api';
import { NotificationItem } from '../types/models';
import { Envelope, PaginatedEnvelope, mapNotification } from './adapters';

export interface BroadcastPayload {
  title: string;
  body: string;
  audience: string;
}

type BackendNotification = Parameters<typeof mapNotification>[0];

export const notificationService = {
  list: (): Promise<NotificationItem[]> =>
    api
      .get<PaginatedEnvelope<BackendNotification>>('/admin/notifications', { params: { page: 1, limit: 50 } })
      .then((r) => r.data.data.map(mapNotification)),

  broadcast: (payload: BroadcastPayload): Promise<NotificationItem> =>
    api
      .post<Envelope<BackendNotification>>('/admin/notifications', payload)
      .then((r) => mapNotification(r.data.data)),
};
