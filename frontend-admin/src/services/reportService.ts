import api from './api';
import { Paginated, Report } from '../types/models';
import { PaginatedEnvelope, Envelope, mapReport, reportStatusToApi } from './adapters';

export interface ReportQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export interface ReportActionPayload {
  reportId: string;
  decision: 'approve' | 'reject';
  action?: 'warning' | 'ban' | 'dismiss';
}

type BackendReport = Parameters<typeof mapReport>[0];

export const reportService = {
  list: (params: ReportQuery): Promise<{ success: boolean } & Paginated<Report>> =>
    api
      .get<PaginatedEnvelope<BackendReport>>('/admin/reports', {
        params: {
          page: params.page,
          limit: params.limit,
          status: reportStatusToApi(params.status),
        },
      })
      .then((r) => ({
        success: r.data.success,
        data: r.data.data.map(mapReport),
        total: r.data.total,
        page: r.data.page,
        limit: r.data.limit,
        totalPages: r.data.totalPages,
      })),

  action: (payload: ReportActionPayload) =>
    api
      .patch<Envelope<BackendReport>>(`/admin/reports/${payload.reportId}/action`, {
        status: payload.decision === 'approve' ? 'ACTION_TAKEN' : 'REVIEWED',
        blockUser: payload.action === 'ban',
      })
      .then((r) => mapReport(r.data.data)),
};
