import { useMemo, useState } from 'react';
import { CreditCard, TrendingUp, Crown, DollarSign } from 'lucide-react';
import { usePayments, usePaymentStats } from '../hooks/usePayments';
import DataTable, { Column } from '../components/DataTable';
import StatCard from '../components/StatCard';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card';
import { Select } from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import Badge, { StatusBadge } from '../components/ui/Badge';
import DistributionPieChart from '../components/charts/DistributionPieChart';
import { Subscription } from '../types/models';
import { formatCurrency, formatDate } from '../utils/format';
import { SUBSCRIPTION_PLANS } from '../utils/constants';

export default function PaymentsPage() {
  const [plan, setPlan] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const statsQuery = usePaymentStats();
  const params = useMemo(() => ({ page, limit: 10, plan, status }), [page, plan, status]);
  const { data, isLoading, isFetching } = usePayments(params);
  const stats = statsQuery.data;

  const columns: Column<Subscription>[] = [
    {
      key: 'user',
      header: 'User',
      render: (s) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-600">
            {s.user.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-ink">{s.user.name}</p>
            <p className="text-xs text-ink-muted">{s.user.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'plan', header: 'Plan', render: (s) => <Badge tone="purple">{s.plan}</Badge> },
    { key: 'amount', header: 'Amount', render: (s) => <span className="font-semibold text-ink">{formatCurrency(s.amount)}</span> },
    { key: 'status', header: 'Status', render: (s) => <StatusBadge status={s.status} /> },
    { key: 'startedAt', header: 'Started', render: (s) => <span className="text-ink-soft">{formatDate(s.startedAt)}</span> },
    { key: 'expiresAt', header: 'Expires', render: (s) => <span className="text-ink-soft">{formatDate(s.expiresAt)}</span> },
  ];

  return (
    <div className="space-y-6">
      {statsQuery.isLoading || !stats ? (
        <Card><Spinner label="Loading…" /></Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={<DollarSign size={20} />} tone="green" />
          <StatCard label="MRR" value={formatCurrency(stats.mrr)} icon={<TrendingUp size={20} />} tone="brand" />
          <StatCard label="Active Subscriptions" value={stats.activeSubscriptions} icon={<CreditCard size={20} />} tone="blue" />
          <StatCard label="Premium Users" value={stats.premiumUsers} icon={<Crown size={20} />} tone="amber" />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>Transactions</CardTitle>
              <div className="flex gap-2">
                <Select className="w-36" value={plan} onChange={(e) => { setPlan(e.target.value); setPage(1); }}>
                  <option value="">All plans</option>
                  {SUBSCRIPTION_PLANS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </Select>
                <Select className="w-36" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
                  <option value="">All statuses</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <DataTable
              columns={columns}
              data={data?.data ?? []}
              rowKey={(s) => s.id}
              loading={isLoading || isFetching}
              page={data?.page}
              totalPages={data?.totalPages}
              total={data?.total}
              onPageChange={setPage}
              emptyMessage="No transactions found"
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Plan</CardTitle>
          </CardHeader>
          <CardBody>
            {stats?.byPlan ? (
              <DistributionPieChart data={stats.byPlan.map((p) => ({ name: p.plan, value: p.revenue }))} />
            ) : (
              <Spinner />
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
