import { create } from 'zustand';
import { DashboardStats, DashboardCharts } from '../types/models';

interface DashboardState {
  stats: DashboardStats | null;
  charts: DashboardCharts | null;
  setStats: (stats: DashboardStats) => void;
  setCharts: (charts: DashboardCharts) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  charts: null,
  setStats: (stats) => set({ stats }),
  setCharts: (charts) => set({ charts }),
}));
