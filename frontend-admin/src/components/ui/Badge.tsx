import { cn } from '../../utils/cn';

type Tone = 'gray' | 'green' | 'red' | 'amber' | 'purple' | 'blue';

const tones: Record<Tone, string> = {
  gray: 'bg-gray-100 text-gray-700',
  green: 'bg-green-100 text-green-700',
  red: 'bg-red-100 text-red-700',
  amber: 'bg-amber-100 text-amber-700',
  purple: 'bg-brand-100 text-brand-700',
  blue: 'bg-blue-100 text-blue-700',
};

export default function Badge({ tone = 'gray', children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', tones[tone])}>
      {children}
    </span>
  );
}

/** Maps a domain status string to a coloured badge. */
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, Tone> = {
    active: 'green',
    blocked: 'amber',
    banned: 'red',
    pending: 'amber',
    approved: 'green',
    rejected: 'gray',
    expired: 'gray',
    cancelled: 'red',
    unmatched: 'gray',
  };
  return <Badge tone={map[status] ?? 'gray'}>{status}</Badge>;
}
