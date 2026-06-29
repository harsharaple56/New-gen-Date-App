import { useMemo, useState } from 'react';
import { Search, Trash2, AlertTriangle, MessageSquare } from 'lucide-react';
import { useChats, useChat, useDeleteMessage } from '../hooks/useChats';
import DataTable, { Column } from '../components/DataTable';
import Button from '../components/ui/Button';
import { Select } from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import { ChatPreview } from '../types/models';
import { timeAgo } from '../utils/format';
import { cn } from '../utils/cn';

export default function ChatsPage() {
  const [search, setSearch] = useState('');
  const [flagged, setFlagged] = useState('');
  const [page, setPage] = useState(1);
  const [openChatId, setOpenChatId] = useState<string | null>(null);

  const params = useMemo(() => ({ page, limit: 10, search, flagged }), [page, search, flagged]);
  const { data, isLoading, isFetching } = useChats(params);

  const columns: Column<ChatPreview>[] = [
    {
      key: 'participants',
      header: 'Conversation',
      render: (c) => (
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {c.participants.map((p) => (
              <img key={p.id} src={p.photo} alt={p.name} className="h-8 w-8 rounded-full border-2 border-white object-cover" />
            ))}
          </div>
          <span className="font-medium text-ink">{c.participants.map((p) => p.name).join(' & ')}</span>
        </div>
      ),
    },
    { key: 'lastMessage', header: 'Last message', render: (c) => <span className="line-clamp-1 max-w-xs text-ink-soft">{c.lastMessage}</span> },
    { key: 'messagesCount', header: 'Messages', render: (c) => `${c.messagesCount}` },
    {
      key: 'flaggedCount',
      header: 'Flagged',
      render: (c) =>
        c.flaggedCount > 0 ? (
          <Badge tone="red">
            <AlertTriangle size={12} className="mr-1" /> {c.flaggedCount}
          </Badge>
        ) : (
          '—'
        ),
    },
    { key: 'lastMessageAt', header: 'Activity', render: (c) => <span className="text-ink-soft">{timeAgo(c.lastMessageAt)}</span> },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (c) => (
        <div className="flex justify-end">
          <Button size="sm" variant="outline" onClick={() => setOpenChatId(c.id)}>
            <MessageSquare size={14} /> View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by participant name…"
            className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <Select className="sm:w-44" value={flagged} onChange={(e) => { setFlagged(e.target.value); setPage(1); }}>
          <option value="">All chats</option>
          <option value="true">Flagged only</option>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        rowKey={(c) => c.id}
        loading={isLoading || isFetching}
        page={data?.page}
        totalPages={data?.totalPages}
        total={data?.total}
        onPageChange={setPage}
        emptyMessage="No conversations found"
      />

      <ChatViewerModal chatId={openChatId} onClose={() => setOpenChatId(null)} />
    </div>
  );
}

function ChatViewerModal({ chatId, onClose }: { chatId: string | null; onClose: () => void }) {
  const { data: chat, isLoading } = useChat(chatId);
  const deleteMessage = useDeleteMessage();

  return (
    <Modal open={Boolean(chatId)} onClose={onClose} title="Conversation" className="max-w-2xl">
      {isLoading || !chat ? (
        <Spinner label="Loading messages…" />
      ) : (
        <div className="space-y-3">
          {chat.messages.length === 0 && <p className="text-center text-sm text-ink-muted">No messages.</p>}
          {chat.messages.map((m) => {
            const mine = m.senderId === chat.participants[0]?.id;
            return (
              <div key={m.id} className={cn('flex flex-col', mine ? 'items-start' : 'items-end')}>
                <div
                  className={cn(
                    'group relative max-w-[80%] rounded-2xl px-4 py-2 text-sm',
                    mine ? 'bg-surface-alt text-ink' : 'bg-brand text-white',
                    m.flagged && 'ring-2 ring-red-400',
                  )}
                >
                  <p className="mb-0.5 text-xs font-semibold opacity-70">{m.senderName}</p>
                  {m.text}
                  {m.flagged && (
                    <span className="ml-2 inline-flex items-center text-xs text-red-200">
                      <AlertTriangle size={11} className="mr-0.5" /> flagged
                    </span>
                  )}
                  <button
                    onClick={() => deleteMessage.mutate({ chatId: chat.id, messageId: m.id })}
                    className="absolute -right-2 -top-2 hidden rounded-full bg-red-500 p-1 text-white group-hover:block"
                    title="Delete message"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
                <span className="mt-0.5 text-[11px] text-ink-muted">{timeAgo(m.createdAt)}</span>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
