import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Heart,
  MessageSquare,
  Flag,
  CreditCard,
  Bell,
  Sparkles,
} from 'lucide-react';
import { cn } from '../utils/cn';

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/matches', label: 'Matches', icon: Heart },
  { to: '/chats', label: 'Chats', icon: MessageSquare },
  { to: '/reports', label: 'Reports', icon: Flag },
  { to: '/payments', label: 'Payments', icon: CreditCard },
  { to: '/notifications', label: 'Notifications', icon: Bell },
];

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={onClose} aria-hidden />}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-100 bg-white transition-transform lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center gap-2 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-ink">Align</p>
            <p className="-mt-0.5 text-xs text-ink-muted">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-brand-100 text-brand-700' : 'text-ink-soft hover:bg-surface-alt',
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="m-3 rounded-xl bg-surface-alt p-4">
          <p className="text-xs font-semibold text-ink">Need help?</p>
          <p className="mt-1 text-xs text-ink-muted">Check the docs or contact support.</p>
        </div>
      </aside>
    </>
  );
}
