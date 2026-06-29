import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: Array<'admin' | 'moderator'>;
}

/**
 * Guards admin routes. Redirects unauthenticated users to /login and
 * role-restricted routes to the dashboard when the role is insufficient.
 */
export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { isAuthenticated, adminUser } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && adminUser && !roles.includes(adminUser.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
