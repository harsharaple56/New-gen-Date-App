import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Props {
  data: { month: string; revenue: number }[];
}

export default function RevenueLineChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F3" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9A9AA2' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#9A9AA2' }} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(v: number) => [`$${Number(v).toLocaleString()}`, 'Revenue']}
          contentStyle={{ borderRadius: 12, border: '1px solid #EEF0F3', fontSize: 13 }}
        />
        <Line type="monotone" dataKey="revenue" stroke="#6C5CE7" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
