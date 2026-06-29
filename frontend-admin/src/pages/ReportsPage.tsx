import { useMemo, useState } from 'react';
import { Check, X, ShieldAlert, Eye } from 'lucide-react';
import { useReports, useReportAction } from '../hooks/useReports';
import { useReportStore } from '../store/reportStore';
import DataTable, { Column } from '../components/DataTable';
import Button from '../components/ui/Button';
import { Select } from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Badge, { StatusBadge } from '../components/ui/Badge';
import { Report } from '../types/models';
import { timeAgo } from '../utils/format';
import { REPORT_STATUS_OPTIONS } from '../utils/constants';

export default function ReportsPage() {
  const { statusFilter, setStatusFilter, page, setPage } = useReportStore();
  const action = useReportAction();
  const [active, setActive] = useState<Report | null>(null);

  const params = useMemo(() => ({ page, limit: 10, status: statusFilter }), [page, statusFilter]);
  const { data, isLoading, isFetching } = useReports(params);

  const resolve = (report: Report, decision: 'approve' | 'reject', actionType?: 'warning' | 'ban' | 'dismiss') => {
    action.mutate(
      { reportId: report.id, decision, action: actionType },
      { onSuccess: () => setActive(null) },
    );
  };

  const columns: Column<Report>[] = [
    {
      key: 'reported',
      header: 'Reported user',
      render: (r) => (
        <div className="flex items-center gap-2">
          <img src={r.reportedUser.photo} alt={r.reportedUser.name} className="h-8 w-8 rounded-full object-cover" />
          <span className="font-medium text-ink">{r.reportedUser.name}</span>
        </div>
      ),
    },
    { key: 'reason', header: 'Reason', render: (r) => <Badge tone="amber">{r.reason}</Badge> },
    { key: 'reportedBy', header: 'Reported by', render: (r) => <span className="text-ink-soft">{r.reportedBy.name}</span> },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'createdAt', header: 'Submitted', render: (r) => <span className="text-ink-soft">{timeAgo(r.createdAt)}</span> },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1">
          <button className="rounded-lg p-1.5 text-ink-soft hover:bg-surface-alt" title="Review" onClick={() => setActive(r)}>
            <Eye size={16} />
          </button>
          {r.status === 'pending' && (
            <>
              <button className="rounded-lg p-1.5 text-green-600 hover:bg-green-50" title="Approve & warn" onClick={() => resolve(r, 'approve', 'warning')}>
                <Check size={16} />
              </button>
              <button className="rounded-lg p-1.5 text-red-600 hover:bg-red-50" title="Reject" onClick={() => resolve(r, 'reject')}>
                <X size={16} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select className="sm:w-48" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All reports</option>
          {REPORT_STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        rowKey={(r) => r.id}
        loading={isLoading || isFetching}
        page={data?.page}
        totalPages={data?.totalPages}
        total={data?.total}
        onPageChange={setPage}
        emptyMessage="No reports found"
      />

      <Modal open={Boolean(active)} onClose={() => setActive(null)} title="Review Report">
        {active && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={active.reportedUser.photo} alt={active.reportedUser.name} className="h-14 w-14 rounded-2xl object-cover" />
              <div>
                <p className="font-bold text-ink">{active.reportedUser.name}</p>
                <div className="mt-1 flex gap-2">
                  <Badge tone="amber">{active.reason}</Badge>
                  <StatusBadge status={active.status} />
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-surface-alt p-3 text-sm text-ink-soft">{active.description}</div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-ink-muted">Reported by</dt>
                <dd className="font-medium text-ink">{active.reportedBy.name}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-muted">Submitted</dt>
                <dd className="font-medium text-ink">{timeAgo(active.createdAt)}</dd>
              </div>
            </dl>

            {active.status === 'pending' ? (
              <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                <Button variant="danger" loading={action.isPending} onClick={() => resolve(active, 'approve', 'ban')}>
                  <ShieldAlert size={15} /> Approve &amp; Ban
                </Button>
                <Button variant="secondary" loading={action.isPending} onClick={() => resolve(active, 'approve', 'warning')}>
                  Approve &amp; Warn
                </Button>
                <Button variant="outline" loading={action.isPending} onClick={() => resolve(active, 'reject')}>
                  Reject
                </Button>
              </div>
            ) : (
              <p className="border-t border-gray-100 pt-4 text-sm text-ink-muted">
                This report has been <strong>{active.status}</strong>
                {active.action ? ` · action: ${active.action}` : ''}.
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
