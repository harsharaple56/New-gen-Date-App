import api from './api';
import { Paginated, PaymentStats, Subscription } from '../types/models';
import { PaginatedEnvelope, mapSubscription } from './adapters';

export interface PaymentQuery {
  page?: number;
  limit?: number;
  status?: string;
  plan?: string;
  search?: string;
}

type BackendSub = Parameters<typeof mapSubscription>[0];

export const paymentService = {
  list: (params: PaymentQuery): Promise<{ success: boolean } & Paginated<Subscription>> =>
    api
      .get<PaginatedEnvelope<BackendSub>>('/admin/subscriptions', {
        params: { page: params.page, limit: params.limit },
      })
      .then((r) => ({
        success: r.data.success,
        data: r.data.data.map(mapSubscription),
        total: r.data.total,
        page: r.data.page,
        limit: r.data.limit,
        totalPages: r.data.totalPages,
      })),

  // Derive aggregate payment stats from the subscriptions list.
  stats: (): Promise<PaymentStats> =>
    api
      .get<PaginatedEnvelope<BackendSub>>('/admin/subscriptions', { params: { page: 1, limit: 1000 } })
      .then((r) => {
        const subs = r.data.data;
        const active = subs.filter((s) => s.status === 'ACTIVE');
        const totalRevenue = Number(active.reduce((sum, s) => sum + (s.amount ?? 0), 0).toFixed(2));
        const byPlanMap = new Map<string, { count: number; revenue: number }>();
        for (const s of active) {
          const entry = byPlanMap.get(s.plan) ?? { count: 0, revenue: 0 };
          entry.count += 1;
          entry.revenue += s.amount ?? 0;
          byPlanMap.set(s.plan, entry);
        }
        return {
          totalRevenue,
          activeSubscriptions: active.length,
          premiumUsers: new Set(active.map((s) => s.user.id)).size,
          mrr: totalRevenue,
          byPlan: Array.from(byPlanMap.entries()).map(([plan, v]) => ({
            plan,
            count: v.count,
            revenue: Number(v.revenue.toFixed(2)),
          })),
        };
      }),
};
