import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Props {
  data: { month: string; users: number }[];
}

export default function UsersBarChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F3" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9A9AA2' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#9A9AA2' }} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(v: number) => [v, 'New users']}
          contentStyle={{ borderRadius: 12, border: '1px solid #EEF0F3', fontSize: 13 }}
        />
        <Bar dataKey="users" fill="#6C5CE7" radius={[6, 6, 0, 0]} maxBarSize={36} />
      </BarChart>
    </ResponsiveContainer>
  );
}
