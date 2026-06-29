import api from './api';
import { DashboardStats, DashboardCharts } from '../types/models';
import { Envelope } from './adapters';

interface BackendDashboard {
  totalUsers: number;
  activeUsers: number;
  totalMatches: number;
  totalReports: number;
  premiumUsers: number;
  revenue: number;
}

const emptyCharts: DashboardCharts = {
  usersByMonth: [],
  revenueByMonth: [],
  matchesByMonth: [],
  subscriptionBreakdown: [],
  genderDistribution: [],
};

export const dashboardService = {
  stats: () =>
    api.get<Envelope<BackendDashboard>>('/admin/dashboard').then((r): DashboardStats => {
      const d = r.data.data;
      return {
        totalUsers: d.totalUsers,
        activeUsers: d.activeUsers,
        premiumUsers: d.premiumUsers,
        blockedUsers: Math.max(0, d.totalUsers - d.activeUsers),
        totalMatches: d.totalMatches,
        totalSwipes: 0,
        totalMessages: 0,
        flaggedMessages: 0,
        pendingReports: d.totalReports,
        totalRevenue: d.revenue,
        mrr: d.revenue,
        activeSubscriptions: d.premiumUsers,
      };
    }),

  charts: () =>
    api
      .get<Envelope<DashboardCharts>>('/admin/dashboard/charts')
      .then((r) => r.data.data)
      .catch(() => emptyCharts),
};
