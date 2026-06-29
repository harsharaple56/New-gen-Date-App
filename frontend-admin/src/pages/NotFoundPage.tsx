import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-alt p-4 text-center">
      <p className="text-7xl font-bold text-brand">404</p>
      <h1 className="mt-2 text-xl font-semibold text-ink">Page not found</h1>
      <p className="mt-1 text-sm text-ink-soft">The page you are looking for doesn’t exist or has moved.</p>
      <Link to="/" className="mt-6">
        <Button>
          <Home size={16} /> Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
