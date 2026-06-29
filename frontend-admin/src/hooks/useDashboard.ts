import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import { useDashboardStore } from '../store/dashboardStore';
import { queryKeys } from '../queryClient';

export function useDashboardStats() {
  const setStats = useDashboardStore((s) => s.setStats);
  const query = useQuery({ queryKey: queryKeys.dashboardStats, queryFn: dashboardService.stats });

  useEffect(() => {
    if (query.data) setStats(query.data);
  }, [query.data, setStats]);

  return query;
}

export function useDashboardCharts() {
  const setCharts = useDashboardStore((s) => s.setCharts);
  const query = useQuery({ queryKey: queryKeys.dashboardCharts, queryFn: dashboardService.charts });

  useEffect(() => {
    if (query.data) setCharts(query.data);
  }, [query.data, setCharts]);

  return query;
}
