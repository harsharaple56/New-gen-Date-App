import { FormEvent, useState } from 'react';
import { Send, Bell, Users, Crown, UserCheck } from 'lucide-react';
import { useNotifications, useBroadcast } from '../hooks/useNotifications';
import { useAuthStore } from '../store/authStore';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card';
import { Input, Textarea, Select } from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import { NOTIFICATION_AUDIENCES } from '../utils/constants';
import { timeAgo } from '../utils/format';

const audienceIcon: Record<string, JSX.Element> = {
  all: <Users size={14} />,
  active: <UserCheck size={14} />,
  premium: <Crown size={14} />,
  free: <Users size={14} />,
};

export default function NotificationsPage() {
  const { adminUser } = useAuthStore();
  const isAdmin = adminUser?.role === 'admin';
  const { data: history, isLoading } = useNotifications();
  const broadcast = useBroadcast();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState('all');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    broadcast.mutate(
      { title, body, audience },
      {
        onSuccess: () => {
          setTitle('');
          setBody('');
          setAudience('all');
          setSent(true);
          setTimeout(() => setSent(false), 3000);
        },
      },
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Composer */}
      <Card>
        <CardHeader>
          <CardTitle>Send Broadcast</CardTitle>
        </CardHeader>
        <CardBody>
          {!isAdmin ? (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
              Only administrators can send broadcasts.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New feature available!" required />
              <Textarea label="Message" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your push notification…" rows={4} required />
              <Select label="Audience" value={audience} onChange={(e) => setAudience(e.target.value)}>
                {NOTIFICATION_AUDIENCES.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </Select>

              {sent && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">Broadcast sent successfully.</p>}
              {broadcast.isError && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {(broadcast.error as { message?: string })?.message ?? 'Failed to send'}
                </p>
              )}

              <Button type="submit" loading={broadcast.isPending}>
                <Send size={15} /> Send Notification
              </Button>
            </form>
          )}
        </CardBody>
      </Card>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Broadcasts</CardTitle>
        </CardHeader>
        <CardBody className="space-y-3">
          {isLoading ? (
            <Spinner label="Loading…" />
          ) : !history || history.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-muted">No broadcasts yet.</p>
          ) : (
            history.map((n) => (
              <div key={n.id} className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                      <Bell size={15} />
                    </div>
                    <p className="font-semibold text-ink">{n.title}</p>
                  </div>
                  <Badge tone="purple">
                    {audienceIcon[n.audience]}
                    <span className="ml-1">{n.audience}</span>
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-ink-soft">{n.body}</p>
                <p className="mt-2 text-xs text-ink-muted">
                  {n.recipients} recipients · by {n.sentBy} · {timeAgo(n.createdAt)}
                </p>
              </div>
            ))
          )}
        </CardBody>
      </Card>
    </div>
  );
}
