import { ReactNode } from 'react';
import { cn } from '../utils/cn';

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  tone?: 'brand' | 'green' | 'amber' | 'red' | 'blue';
  hint?: string;
}

const tones = {
  brand: 'bg-brand-100 text-brand-600',
  green: 'bg-green-100 text-green-600',
  amber: 'bg-amber-100 text-amber-600',
  red: 'bg-red-100 text-red-600',
  blue: 'bg-blue-100 text-blue-600',
};

export default function StatCard({ label, value, icon, tone = 'brand', hint }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-ink-soft">{label}</p>
          <p className="mt-2 text-2xl font-bold text-ink">{value}</p>
          {hint && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
        </div>
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', tones[tone])}>{icon}</div>
      </div>
    </div>
  );
}
