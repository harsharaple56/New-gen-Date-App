export type Role = 'admin' | 'moderator';

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export type UserStatus = 'active' | 'blocked' | 'banned';

export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  location: string;
  phone: string;
  photo: string;
  bio?: string;
  interests: string[];
  verified: boolean;
  premium: boolean;
  status: UserStatus;
  reportsCount: number;
  swipes: number;
  matchesCount: number;
  createdAt: string;
  lastActiveAt: string;
}

export interface MatchUser {
  id: string;
  name: string;
  photo: string;
}

export interface Match {
  id: string;
  userA: MatchUser;
  userB: MatchUser;
  status: 'active' | 'unmatched';
  messagesCount: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  flagged: boolean;
  createdAt: string;
}

export interface ChatPreview {
  id: string;
  matchId: string;
  participants: MatchUser[];
  messagesCount: number;
  flaggedCount: number;
  lastMessageAt: string;
  lastMessage: string;
  createdAt: string;
}

export interface ChatDetail extends Omit<ChatPreview, 'lastMessage' | 'messagesCount'> {
  messages: ChatMessage[];
}

export type ReportStatus = 'pending' | 'approved' | 'rejected';

export interface Report {
  id: string;
  reportedUser: MatchUser;
  reportedBy: { id: string; name: string };
  reason: string;
  description: string;
  status: ReportStatus;
  action: string | null;
  createdAt: string;
  resolvedAt: string | null;
  resolvedBy?: string;
}

export type SubscriptionPlan = 'monthly' | 'yearly' | 'lifetime';
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled';

export interface Subscription {
  id: string;
  user: { id: string; name: string; email: string };
  plan: SubscriptionPlan;
  amount: number;
  currency: string;
  status: SubscriptionStatus;
  startedAt: string;
  expiresAt: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  audience: string;
  sentBy: string;
  recipients: number;
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  premiumUsers: number;
  blockedUsers: number;
  totalMatches: number;
  totalSwipes: number;
  totalMessages: number;
  flaggedMessages: number;
  pendingReports: number;
  totalRevenue: number;
  mrr: number;
  activeSubscriptions: number;
}

export interface DashboardCharts {
  usersByMonth: { month: string; users: number }[];
  revenueByMonth: { month: string; revenue: number }[];
  matchesByMonth: { month: string; matches: number }[];
  subscriptionBreakdown: { name: string; value: number; revenue: number }[];
  genderDistribution: { name: string; value: number }[];
}

export interface PaymentStats {
  totalRevenue: number;
  activeSubscriptions: number;
  premiumUsers: number;
  mrr: number;
  byPlan: { plan: string; count: number; revenue: number }[];
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
