import { useMemo, useState } from 'react';
import { Search, Trash2, Ban, ShieldCheck, Eye, ShieldX } from 'lucide-react';
import { useUsers, useUpdateUser, useDeleteUser } from '../hooks/useUsers';
import { useUserStore } from '../store/userStore';
import { useAuthStore } from '../store/authStore';
import DataTable, { Column } from '../components/DataTable';
import Button from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Badge, { StatusBadge } from '../components/ui/Badge';
import { User } from '../types/models';
import { formatDate, timeAgo } from '../utils/format';
import { USER_STATUS_OPTIONS } from '../utils/constants';

export default function UsersPage() {
  const { filters, setFilters } = useUserStore();
  const { adminUser } = useAuthStore();
  const isAdmin = adminUser?.role === 'admin';

  const params = useMemo(() => ({ ...filters }), [filters]);
  const { data, isLoading, isFetching } = useUsers(params);
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [viewUser, setViewUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const toggleSort = (key: string) => {
    setFilters({ sortBy: key, order: filters.sortBy === key && filters.order === 'asc' ? 'desc' : 'asc', page: filters.page });
  };

  const setStatus = (user: User, status: string) => updateUser.mutate({ id: user.id, patch: { status: status as User['status'] } });

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'User',
      sortable: true,
      render: (u) => (
        <div className="flex items-center gap-3">
          <img src={u.photo} alt={u.name} className="h-9 w-9 rounded-full object-cover" />
          <div>
            <p className="font-semibold text-ink">{u.name}</p>
            <p className="text-xs text-ink-muted">{u.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'age', header: 'Age', sortable: true, render: (u) => `${u.age}` },
    { key: 'location', header: 'Location', render: (u) => <span className="text-ink-soft">{u.location}</span> },
    {
      key: 'premium',
      header: 'Plan',
      render: (u) => (u.premium ? <Badge tone="purple">premium</Badge> : <Badge tone="gray">free</Badge>),
    },
    { key: 'status', header: 'Status', render: (u) => <StatusBadge status={u.status} /> },
    { key: 'reportsCount', header: 'Reports', sortable: true, render: (u) => (u.reportsCount > 0 ? <Badge tone="red">{u.reportsCount}</Badge> : '—') },
    { key: 'lastActiveAt', header: 'Last active', sortable: true, render: (u) => <span className="text-ink-soft">{timeAgo(u.lastActiveAt)}</span> },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (u) => (
        <div className="flex items-center justify-end gap-1">
          <button className="rounded-lg p-1.5 text-ink-soft hover:bg-surface-alt" title="View" onClick={() => setViewUser(u)}>
            <Eye size={16} />
          </button>
          <button className="rounded-lg p-1.5 text-ink-soft hover:bg-surface-alt" title="Edit" onClick={() => setEditUser(u)}>
            <ShieldCheck size={16} />
          </button>
          {u.status === 'active' ? (
            <button className="rounded-lg p-1.5 text-amber-600 hover:bg-amber-50" title="Block" onClick={() => setStatus(u, 'blocked')}>
              <Ban size={16} />
            </button>
          ) : (
            <button className="rounded-lg p-1.5 text-green-600 hover:bg-green-50" title="Unblock" onClick={() => setStatus(u, 'active')}>
              <ShieldCheck size={16} />
            </button>
          )}
          <button className="rounded-lg p-1.5 text-red-600 hover:bg-red-50" title="Ban" onClick={() => setStatus(u, 'banned')}>
            <ShieldX size={16} />
          </button>
          {isAdmin && (
            <button className="rounded-lg p-1.5 text-red-600 hover:bg-red-50" title="Delete" onClick={() => setDeleteTarget(u)}>
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            placeholder="Search by name, email or location…"
            className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <Select className="sm:w-40" value={filters.status} onChange={(e) => setFilters({ status: e.target.value })}>
          <option value="">All statuses</option>
          {USER_STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
        <Select className="sm:w-40" value={filters.premium} onChange={(e) => setFilters({ premium: e.target.value })}>
          <option value="">All plans</option>
          <option value="true">Premium</option>
          <option value="false">Free</option>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        rowKey={(u) => u.id}
        loading={isLoading || isFetching}
        page={data?.page}
        totalPages={data?.totalPages}
        total={data?.total}
        sortBy={filters.sortBy}
        order={filters.order}
        onSort={toggleSort}
        onPageChange={(page) => setFilters({ page })}
        emptyMessage="No users match your filters"
      />

      {/* View modal */}
      <Modal open={Boolean(viewUser)} onClose={() => setViewUser(null)} title="User Profile">
        {viewUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img src={viewUser.photo} alt={viewUser.name} className="h-16 w-16 rounded-2xl object-cover" />
              <div>
                <p className="text-lg font-bold text-ink">{viewUser.name}, {viewUser.age}</p>
                <p className="text-sm text-ink-soft">{viewUser.location}</p>
                <div className="mt-1 flex gap-2">
                  <StatusBadge status={viewUser.status} />
                  {viewUser.verified && <Badge tone="blue">verified</Badge>}
                  {viewUser.premium && <Badge tone="purple">premium</Badge>}
                </div>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <Detail label="Email" value={viewUser.email} />
              <Detail label="Phone" value={viewUser.phone} />
              <Detail label="Gender" value={viewUser.gender} />
              <Detail label="Joined" value={formatDate(viewUser.createdAt)} />
              <Detail label="Matches" value={String(viewUser.matchesCount)} />
              <Detail label="Swipes" value={String(viewUser.swipes)} />
            </dl>
            {viewUser.bio && <p className="rounded-lg bg-surface-alt p-3 text-sm text-ink-soft">{viewUser.bio}</p>}
            <div className="flex flex-wrap gap-2">
              {viewUser.interests.map((i) => (
                <Badge key={i} tone="gray">{i}</Badge>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Edit modal */}
      <EditUserModal
        user={editUser}
        onClose={() => setEditUser(null)}
        onSave={(patch) => {
          if (editUser) {
            updateUser.mutate({ id: editUser.id, patch }, { onSuccess: () => setEditUser(null) });
          }
        }}
        saving={updateUser.isPending}
      />

      {/* Delete confirm */}
      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete user"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button
              variant="danger"
              loading={deleteUser.isPending}
              onClick={() => deleteTarget && deleteUser.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-soft">
          Are you sure you want to permanently delete <strong>{deleteTarget?.name}</strong>? This cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-ink-muted">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}

function EditUserModal({
  user,
  onClose,
  onSave,
  saving,
}: {
  user: User | null;
  onClose: () => void;
  onSave: (patch: Partial<User>) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<Partial<User>>({});

  // Sync local form whenever a new user is opened.
  if (user && form.id !== user.id) {
    setForm({ id: user.id, name: user.name, email: user.email, location: user.location, status: user.status, premium: user.premium, verified: user.verified });
  }

  return (
    <Modal
      open={Boolean(user)}
      onClose={onClose}
      title="Edit User"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button loading={saving} onClick={() => onSave(form)}>Save changes</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input label="Name" value={form.name ?? ''} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        <Input label="Email" type="email" value={form.email ?? ''} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
        <Input label="Location" value={form.location ?? ''} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
        <Select label="Status" value={form.status ?? 'active'} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as User['status'] }))}>
          {USER_STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input type="checkbox" checked={Boolean(form.premium)} onChange={(e) => setForm((f) => ({ ...f, premium: e.target.checked }))} />
            Premium
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input type="checkbox" checked={Boolean(form.verified)} onChange={(e) => setForm((f) => ({ ...f, verified: e.target.checked }))} />
            Verified
          </label>
        </div>
      </div>
    </Modal>
  );
}
