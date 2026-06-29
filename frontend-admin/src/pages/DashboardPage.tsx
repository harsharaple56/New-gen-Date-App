import { Users, Heart, CreditCard, Flag, MessageSquare, TrendingUp, ShieldAlert, Crown } from 'lucide-react';
import { useDashboardStats, useDashboardCharts } from '../hooks/useDashboard';
import StatCard from '../components/StatCard';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import RevenueLineChart from '../components/charts/RevenueLineChart';
import UsersBarChart from '../components/charts/UsersBarChart';
import DistributionPieChart from '../components/charts/DistributionPieChart';
import { formatCurrency, formatNumber } from '../utils/format';

export default function DashboardPage() {
  const statsQuery = useDashboardStats();
  const chartsQuery = useDashboardCharts();
  const stats = statsQuery.data;
  const charts = chartsQuery.data;

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      {statsQuery.isLoading || !stats ? (
        <Card>
          <Spinner label="Loading dashboard…" />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Users" value={formatNumber(stats.totalUsers)} icon={<Users size={20} />} tone="brand" hint={`${stats.activeUsers} active today`} />
          <StatCard label="Total Matches" value={formatNumber(stats.totalMatches)} icon={<Heart size={20} />} tone="red" hint={`${formatNumber(stats.totalSwipes)} swipes`} />
          <StatCard label="Revenue" value={formatCurrency(stats.totalRevenue)} icon={<CreditCard size={20} />} tone="green" hint={`${formatCurrency(stats.mrr)} MRR`} />
          <StatCard label="Pending Reports" value={stats.pendingReports} icon={<Flag size={20} />} tone="amber" hint={`${stats.flaggedMessages} flagged messages`} />
          <StatCard label="Premium Users" value={formatNumber(stats.premiumUsers)} icon={<Crown size={20} />} tone="brand" />
          <StatCard label="Active Subscriptions" value={formatNumber(stats.activeSubscriptions)} icon={<TrendingUp size={20} />} tone="green" />
          <StatCard label="Total Messages" value={formatNumber(stats.totalMessages)} icon={<MessageSquare size={20} />} tone="blue" />
          <StatCard label="Blocked / Banned" value={formatNumber(stats.blockedUsers)} icon={<ShieldAlert size={20} />} tone="red" />
        </div>
      )}

      {/* Charts */}
      {chartsQuery.isLoading || !charts ? (
        <Card>
          <Spinner label="Loading charts…" />
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle>Revenue (last 12 months)</CardTitle>
              </CardHeader>
              <CardBody>
                <RevenueLineChart data={charts.revenueByMonth} />
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plans</CardTitle>
              </CardHeader>
              <CardBody>
                <DistributionPieChart data={charts.subscriptionBreakdown} />
              </CardBody>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle>New Users (last 12 months)</CardTitle>
              </CardHeader>
              <CardBody>
                <UsersBarChart data={charts.usersByMonth} />
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
              </CardHeader>
              <CardBody>
                <DistributionPieChart data={charts.genderDistribution} />
              </CardBody>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
