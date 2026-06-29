/**
 * Adapters that map the Align backend's `{ success, data }` responses into the
 * richer view models the admin UI already consumes. This keeps the pages and
 * hooks untouched while the service layer talks to the real API.
 */
import {
  Admin,
  Match,
  Report,
  ReportStatus,
  Subscription,
  SubscriptionPlan,
  SubscriptionStatus,
  User,
  UserStatus,
  ChatPreview,
  ChatDetail,
  NotificationItem,
} from '../types/models';

/** Backend response envelopes. */
export interface Envelope<T> {
  success: boolean;
  data: T;
}

export interface PaginatedEnvelope<T> {
  success: boolean;
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const mapAdmin = (a: {
  id: string;
  email?: string | null;
  role: string;
}): Admin => ({
  id: a.id,
  name: a.email ? a.email.split('@')[0] : 'Admin',
  email: a.email ?? '',
  role: a.role === 'MODERATOR' ? 'moderator' : 'admin',
});

const userStatus = (isBlocked: boolean): UserStatus => (isBlocked ? 'blocked' : 'active');

export const mapUser = (u: {
  id: string;
  phone: string;
  email?: string | null;
  role: string;
  isVerified: boolean;
  isBlocked: boolean;
  name?: string | null;
  age?: number | null;
  gender?: string | null;
  location?: string | null;
  createdAt: string;
}): User => ({
  id: u.id,
  name: u.name ?? '',
  email: u.email ?? '',
  age: u.age ?? 0,
  gender: u.gender ?? '',
  location: u.location ?? '',
  phone: u.phone,
  photo: '',
  interests: [],
  verified: u.isVerified,
  premium: false,
  status: userStatus(u.isBlocked),
  reportsCount: 0,
  swipes: 0,
  matchesCount: 0,
  createdAt: u.createdAt,
  lastActiveAt: u.createdAt,
});

const reportStatusFromApi = (s: string): ReportStatus => {
  if (s === 'ACTION_TAKEN') return 'approved';
  if (s === 'REVIEWED') return 'rejected';
  return 'pending';
};

export const reportStatusToApi = (s?: string): string | undefined => {
  if (s === 'approved') return 'ACTION_TAKEN';
  if (s === 'rejected') return 'REVIEWED';
  if (s === 'pending') return 'PENDING';
  return undefined;
};

export const mapReport = (r: {
  id: string;
  reason: string;
  description?: string | null;
  status: string;
  createdAt: string;
  reporterId?: string;
  reportedUserId?: string;
  reporter?: { id: string; profile?: { name?: string | null } | null };
  reported?: { id: string; profile?: { name?: string | null } | null };
}): Report => ({
  id: r.id,
  reportedUser: { id: r.reported?.id ?? r.reportedUserId ?? '', name: r.reported?.profile?.name ?? '', photo: '' },
  reportedBy: { id: r.reporter?.id ?? r.reporterId ?? '', name: r.reporter?.profile?.name ?? '' },
  reason: r.reason,
  description: r.description ?? '',
  status: reportStatusFromApi(r.status),
  action: null,
  createdAt: r.createdAt,
  resolvedAt: r.status === 'PENDING' ? null : r.createdAt,
});

export const mapMatch = (m: {
  id: string;
  status: string;
  createdAt: string;
  userOne: { id: string; name: string };
  userTwo: { id: string; name: string };
  messageCount: number;
}): Match => ({
  id: m.id,
  userA: { id: m.userOne.id, name: m.userOne.name, photo: '' },
  userB: { id: m.userTwo.id, name: m.userTwo.name, photo: '' },
  status: m.status === 'UNMATCHED' ? 'unmatched' : 'active',
  messagesCount: m.messageCount,
  createdAt: m.createdAt,
});

export const mapChat = (c: {
  id: string;
  matchId: string;
  participants: string[];
  messageCount: number;
  createdAt: string;
}): ChatPreview => ({
  id: c.id,
  matchId: c.matchId,
  participants: c.participants.map((name, index) => ({ id: `${c.id}-${index}`, name, photo: '' })),
  messagesCount: c.messageCount,
  flaggedCount: 0,
  lastMessageAt: c.createdAt,
  lastMessage: '',
  createdAt: c.createdAt,
});

const planFromApi = (p: string): SubscriptionPlan => {
  if (p === 'GOLD') return 'yearly';
  if (p === 'PLATINUM') return 'lifetime';
  return 'monthly';
};

const subStatusFromApi = (s: string): SubscriptionStatus => {
  if (s === 'ACTIVE') return 'active';
  if (s === 'EXPIRED') return 'expired';
  return 'cancelled';
};

export const mapSubscription = (s: {
  id: string;
  plan: string;
  status: string;
  amount: number;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  user: { id: string; name: string; email?: string | null };
}): Subscription => ({
  id: s.id,
  user: { id: s.user.id, name: s.user.name, email: s.user.email ?? '' },
  plan: planFromApi(s.plan),
  amount: s.amount,
  currency: 'USD',
  status: subStatusFromApi(s.status),
  startedAt: s.startDate ?? s.createdAt,
  expiresAt: s.endDate ?? '',
  createdAt: s.createdAt,
});

export const mapChatDetail = (c: {
  id: string;
  matchId: string;
  participants: { id: string; name: string; photo?: string | null }[];
  flaggedCount: number;
  lastMessageAt: string;
  createdAt: string;
  messages: { id: string; senderId: string; senderName: string; text: string; flagged: boolean; createdAt: string }[];
}): ChatDetail => ({
  id: c.id,
  matchId: c.matchId,
  participants: c.participants.map((p) => ({ id: p.id, name: p.name, photo: p.photo ?? '' })),
  flaggedCount: c.flaggedCount,
  lastMessageAt: c.lastMessageAt,
  createdAt: c.createdAt,
  messages: c.messages.map((m) => ({
    id: m.id,
    senderId: m.senderId,
    senderName: m.senderName,
    text: m.text,
    flagged: m.flagged,
    createdAt: m.createdAt,
  })),
});

export const mapNotification = (n: {
  id: string;
  title: string;
  body: string;
  audience: string;
  recipients: number;
  sentBy?: string | null;
  createdAt: string;
}): NotificationItem => ({
  id: n.id,
  title: n.title,
  body: n.body,
  audience: n.audience,
  sentBy: n.sentBy ?? 'system',
  recipients: n.recipients,
  createdAt: n.createdAt,
});
