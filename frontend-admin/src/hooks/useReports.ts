import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reportService, ReportQuery, ReportActionPayload } from '../services/reportService';
import { useReportStore } from '../store/reportStore';
import { queryKeys } from '../queryClient';

export function useReports(params: ReportQuery) {
  const setReports = useReportStore((s) => s.setReports);
  const query = useQuery({
    queryKey: queryKeys.reports(params),
    queryFn: () => reportService.list(params),
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    if (query.data?.data) setReports(query.data.data);
  }, [query.data, setReports]);

  return query;
}

export function useReportAction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReportActionPayload) => reportService.action(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
