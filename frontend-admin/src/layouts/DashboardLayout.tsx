import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/users': 'User Management',
  '/matches': 'Match Management',
  '/chats': 'Chat Monitoring',
  '/reports': 'Reports & Moderation',
  '/payments': 'Payments & Subscriptions',
  '/notifications': 'Notifications',
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const title = TITLES[pathname] ?? 'Admin';

  return (
    <div className="flex min-h-screen bg-surface-alt">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
