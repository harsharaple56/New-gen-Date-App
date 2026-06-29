import { FormEvent, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useLogin } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function LoginPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const login = useLogin();
  const [email, setEmail] = useState('admin@align.app');
  const [password, setPassword] = useState('admin123');

  if (isAuthenticated) return <Navigate to="/" replace />;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-alt p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white">
            <Sparkles size={22} />
          </div>
          <h1 className="text-2xl font-bold text-ink">Align Admin</h1>
          <p className="mt-1 text-sm text-ink-soft">Sign in to manage your platform</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@align.app"
            autoComplete="username"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />

          {login.isError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {(login.error as { message?: string })?.message ?? 'Login failed'}
            </p>
          )}

          <Button type="submit" className="w-full" loading={login.isPending}>
            Sign In
          </Button>

          <p className="text-center text-xs text-ink-muted">
            Demo: admin@align.app / admin123 · mod@align.app / mod123
          </p>
        </form>
      </div>
    </div>
  );
}
