import { create } from 'zustand';
import { Report } from '../types/models';

interface ReportState {
  reports: Report[];
  statusFilter: string;
  page: number;
  setReports: (reports: Report[]) => void;
  setStatusFilter: (status: string) => void;
  setPage: (page: number) => void;
}

export const useReportStore = create<ReportState>((set) => ({
  reports: [],
  statusFilter: '',
  page: 1,
  setReports: (reports) => set({ reports }),
  setStatusFilter: (statusFilter) => set({ statusFilter, page: 1 }),
  setPage: (page) => set({ page }),
}));
