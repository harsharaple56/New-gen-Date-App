import { Menu, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useLogout } from '../hooks/useAuth';
import Badge from '../components/ui/Badge';

export default function Topbar({ onMenu, title }: { onMenu: () => void; title: string }) {
  const admin = useAuthStore((s) => s.adminUser);
  const logout = useLogout();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-100 bg-white/90 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenu} className="rounded-lg p-2 text-ink-soft hover:bg-surface-alt lg:hidden" aria-label="Menu">
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-bold text-ink">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-ink">{admin?.name}</p>
          <p className="-mt-0.5 text-xs text-ink-muted">{admin?.email}</p>
        </div>
        {admin && <Badge tone={admin.role === 'admin' ? 'purple' : 'blue'}>{admin.role}</Badge>}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
          {admin?.name?.charAt(0) ?? 'A'}
        </div>
        <button onClick={logout} className="rounded-lg p-2 text-ink-soft hover:bg-surface-alt" aria-label="Log out" title="Log out">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
