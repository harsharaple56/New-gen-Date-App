import { useMemo, useState } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { useMatches, useDeleteMatch } from '../hooks/useMatches';
import DataTable, { Column } from '../components/DataTable';
import Button from '../components/ui/Button';
import { Select } from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { StatusBadge } from '../components/ui/Badge';
import { Match } from '../types/models';
import { formatDate } from '../utils/format';

export default function MatchesPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Match | null>(null);

  const params = useMemo(() => ({ page, limit: 10, search, status }), [page, search, status]);
  const { data, isLoading, isFetching } = useMatches(params);
  const deleteMatch = useDeleteMatch();

  const columns: Column<Match>[] = [
    {
      key: 'pair',
      header: 'Match',
      render: (m) => (
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            <img src={m.userA.photo} alt={m.userA.name} className="h-8 w-8 rounded-full border-2 border-white object-cover" />
            <img src={m.userB.photo} alt={m.userB.name} className="h-8 w-8 rounded-full border-2 border-white object-cover" />
          </div>
          <span className="font-medium text-ink">{m.userA.name} &amp; {m.userB.name}</span>
        </div>
      ),
    },
    { key: 'status', header: 'Status', render: (m) => <StatusBadge status={m.status} /> },
    { key: 'messagesCount', header: 'Messages', render: (m) => `${m.messagesCount}` },
    { key: 'createdAt', header: 'Matched on', render: (m) => <span className="text-ink-soft">{formatDate(m.createdAt)}</span> },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (m) => (
        <div className="flex justify-end">
          <button className="rounded-lg p-1.5 text-red-600 hover:bg-red-50" title="Delete match" onClick={() => setDeleteTarget(m)}>
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by participant name…"
            className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <Select className="sm:w-44" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All matches</option>
          <option value="active">Active</option>
          <option value="unmatched">Unmatched</option>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        rowKey={(m) => m.id}
        loading={isLoading || isFetching}
        page={data?.page}
        totalPages={data?.totalPages}
        total={data?.total}
        onPageChange={setPage}
        emptyMessage="No matches found"
      />

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete match"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button
              variant="danger"
              loading={deleteMatch.isPending}
              onClick={() => deleteTarget && deleteMatch.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-soft">
          Delete the match between <strong>{deleteTarget?.userA.name}</strong> and <strong>{deleteTarget?.userB.name}</strong>?
        </p>
      </Modal>
    </div>
  );
}
