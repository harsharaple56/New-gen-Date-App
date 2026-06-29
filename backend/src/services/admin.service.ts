import { prisma } from '../config/db';
import { ApiError } from '../utils/ApiError';
import { Prisma, Role, ReportStatus, SubscriptionPlan } from '@prisma/client';
import { PLAN_PRICES } from './subscription.service';

export const adminService = {
  async dashboard() {
    const [totalUsers, activeUsers, totalMatches, totalReports, activeSubs] = await Promise.all([
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.user.count({ where: { role: 'USER', isVerified: true, isBlocked: false } }),
      prisma.match.count({ where: { status: 'ACTIVE' } }),
      prisma.report.count(),
      prisma.subscription.findMany({ where: { status: 'ACTIVE' }, select: { userId: true, plan: true } }),
    ]);

    const premiumUsers = new Set(activeSubs.filter((s) => s.plan !== 'FREE').map((s) => s.userId)).size;
    const revenue = Number(
      activeSubs.reduce((sum, s) => sum + (PLAN_PRICES[s.plan] ?? 0), 0).toFixed(2),
    );

    return { totalUsers, activeUsers, totalMatches, totalReports, premiumUsers, revenue };
  },

  async listUsers(params: { page: number; limit: number; search?: string; role?: Role; isBlocked?: boolean }) {
    const { page, limit, search, role, isBlocked } = params;
    const where: Prisma.UserWhereInput = {
      ...(role ? { role } : {}),
      ...(isBlocked !== undefined ? { isBlocked } : {}),
      ...(search
        ? {
            OR: [
              { phone: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { profile: { name: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: { profile: { select: { name: true, age: true, gender: true, location: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    const data = items.map((u) => ({
      id: u.id,
      phone: u.phone,
      email: u.email,
      role: u.role,
      isVerified: u.isVerified,
      isBlocked: u.isBlocked,
      name: u.profile?.name ?? null,
      age: u.profile?.age ?? null,
      gender: u.profile?.gender ?? null,
      location: u.profile?.location ?? null,
      createdAt: u.createdAt,
    }));
    return { items: data, total };
  },

  async setUserBlocked(userId: string, isBlocked: boolean) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!user) throw ApiError.notFound('User not found');
    return prisma.user.update({
      where: { id: userId },
      data: { isBlocked },
      select: { id: true, isBlocked: true },
    });
  },

  async deleteUser(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true } });
    if (!user) throw ApiError.notFound('User not found');
    if (user.role === 'ADMIN') throw ApiError.forbidden('Admin accounts cannot be deleted');
    await prisma.user.delete({ where: { id: userId } });
    return { deleted: true };
  },

  async listReports(params: { page: number; limit: number; status?: ReportStatus }) {
    const { page, limit, status } = params;
    const where: Prisma.ReportWhereInput = status ? { status } : {};
    const [items, total] = await Promise.all([
      prisma.report.findMany({
        where,
        include: {
          reporter: { select: { id: true, profile: { select: { name: true } } } },
          reported: { select: { id: true, isBlocked: true, profile: { select: { name: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.report.count({ where }),
    ]);
    return { items, total };
  },

  async actionReport(reportId: string, status: ReportStatus, blockUser?: boolean) {
    const report = await prisma.report.findUnique({ where: { id: reportId } });
    if (!report) throw ApiError.notFound('Report not found');

    const updated = await prisma.report.update({ where: { id: reportId }, data: { status } });
    if (blockUser) {
      await prisma.user.update({ where: { id: report.reportedUserId }, data: { isBlocked: true } });
    }
    return updated;
  },

  async listMatches(params: { page: number; limit: number }) {
    const { page, limit } = params;
    const [items, total] = await Promise.all([
      prisma.match.findMany({
        include: {
          userOne: { select: { id: true, profile: { select: { name: true } } } },
          userTwo: { select: { id: true, profile: { select: { name: true } } } },
          chat: { select: { _count: { select: { messages: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.match.count(),
    ]);
    const data = items.map((m) => ({
      id: m.id,
      status: m.status,
      createdAt: m.createdAt,
      userOne: { id: m.userOne.id, name: m.userOne.profile?.name ?? '' },
      userTwo: { id: m.userTwo.id, name: m.userTwo.profile?.name ?? '' },
      messageCount: m.chat?._count.messages ?? 0,
    }));
    return { items: data, total };
  },

  async listChats(params: { page: number; limit: number }) {
    const { page, limit } = params;
    const [items, total] = await Promise.all([
      prisma.chat.findMany({
        include: {
          match: {
            include: {
              userOne: { select: { id: true, profile: { select: { name: true } } } },
              userTwo: { select: { id: true, profile: { select: { name: true } } } },
            },
          },
          _count: { select: { messages: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.chat.count(),
    ]);
    const data = items.map((c) => ({
      id: c.id,
      matchId: c.matchId,
      participants: [c.match.userOne.profile?.name ?? '', c.match.userTwo.profile?.name ?? ''],
      messageCount: c._count.messages,
      createdAt: c.createdAt,
    }));
    return { items: data, total };
  },

  async listSubscriptions(params: { page: number; limit: number }) {
    const { page, limit } = params;
    const [items, total] = await Promise.all([
      prisma.subscription.findMany({
        include: { user: { select: { id: true, email: true, phone: true, profile: { select: { name: true } } } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.subscription.count(),
    ]);
    const data = items.map((s) => ({
      id: s.id,
      plan: s.plan,
      status: s.status,
      provider: s.provider,
      amount: PLAN_PRICES[s.plan] ?? 0,
      startDate: s.startDate,
      endDate: s.endDate,
      user: { id: s.user.id, name: s.user.profile?.name ?? '', email: s.user.email, phone: s.user.phone },
      createdAt: s.createdAt,
    }));
    return { items: data, total };
  },

  async getChat(chatId: string) {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        match: {
          include: {
            userOne: { select: { id: true, profile: { select: { name: true } }, photos: { where: { isPrimary: true }, take: 1, select: { imageUrl: true } } } },
            userTwo: { select: { id: true, profile: { select: { name: true } }, photos: { where: { isPrimary: true }, take: 1, select: { imageUrl: true } } } },
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { sender: { select: { id: true, profile: { select: { name: true } } } } },
        },
      },
    });
    if (!chat) throw ApiError.notFound('Chat not found');

    const one = chat.match.userOne;
    const two = chat.match.userTwo;
    const lastMessageAt = chat.messages.length ? chat.messages[chat.messages.length - 1].createdAt : chat.createdAt;

    return {
      id: chat.id,
      matchId: chat.matchId,
      participants: [
        { id: one.id, name: one.profile?.name ?? '', photo: one.photos[0]?.imageUrl ?? '' },
        { id: two.id, name: two.profile?.name ?? '', photo: two.photos[0]?.imageUrl ?? '' },
      ],
      flaggedCount: 0,
      lastMessageAt,
      createdAt: chat.createdAt,
      messages: chat.messages.map((m) => ({
        id: m.id,
        senderId: m.senderId,
        senderName: m.sender.profile?.name ?? '',
        text: m.text ?? '',
        flagged: false,
        createdAt: m.createdAt,
      })),
    };
  },

  async deleteMessage(chatId: string, messageId: string) {
    const message = await prisma.message.findFirst({ where: { id: messageId, chatId }, select: { id: true } });
    if (!message) throw ApiError.notFound('Message not found');
    await prisma.message.delete({ where: { id: messageId } });
    return this.getChat(chatId);
  },

  async unmatch(matchId: string) {
    const match = await prisma.match.findUnique({ where: { id: matchId }, select: { id: true } });
    if (!match) throw ApiError.notFound('Match not found');
    const updated = await prisma.match.update({
      where: { id: matchId },
      data: { status: 'UNMATCHED' },
      select: { id: true, status: true },
    });
    return updated;
  },

  async listNotifications(params: { page: number; limit: number }) {
    const { page, limit } = params;
    const [items, total] = await Promise.all([
      prisma.notification.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count(),
    ]);
    return { items, total };
  },

  async broadcast(input: { title: string; body: string; audience?: string }, sentBy?: string) {
    const audience = input.audience ?? 'all';

    const activeSubs = await prisma.subscription.findMany({
      where: { status: 'ACTIVE' },
      select: { userId: true, plan: true },
    });
    const premiumUserIds = new Set(activeSubs.filter((s) => s.plan !== 'FREE').map((s) => s.userId));
    const totalUsers = await prisma.user.count({ where: { role: 'USER' } });

    let recipients = totalUsers;
    if (audience === 'premium') recipients = premiumUserIds.size;
    else if (audience === 'free') recipients = Math.max(0, totalUsers - premiumUserIds.size);
    else if (audience === 'active') {
      recipients = await prisma.user.count({ where: { role: 'USER', isVerified: true, isBlocked: false } });
    }

    return prisma.notification.create({
      data: { title: input.title, body: input.body, audience, recipients, sentBy: sentBy ?? null },
    });
  },

  async analytics() {
    const now = new Date();
    const buckets: { key: string; label: string }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      buckets.push({ key, label });
    }
    const monthKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    const [users, subs, matches, profiles] = await Promise.all([
      prisma.user.findMany({ where: { role: 'USER' }, select: { createdAt: true } }),
      prisma.subscription.findMany({ select: { plan: true, status: true, createdAt: true } }),
      prisma.match.findMany({ select: { createdAt: true } }),
      prisma.profile.findMany({ select: { gender: true } }),
    ]);

    const usersByMonth = buckets.map((b) => ({
      month: b.label,
      users: users.filter((u) => monthKey(u.createdAt) === b.key).length,
    }));
    const matchesByMonth = buckets.map((b) => ({
      month: b.label,
      matches: matches.filter((m) => monthKey(m.createdAt) === b.key).length,
    }));
    const revenueByMonth = buckets.map((b) => ({
      month: b.label,
      revenue: Number(
        subs
          .filter((s) => monthKey(s.createdAt) === b.key)
          .reduce((sum, s) => sum + (PLAN_PRICES[s.plan] ?? 0), 0)
          .toFixed(2),
      ),
    }));

    const planNames: SubscriptionPlan[] = ['FREE', 'PREMIUM', 'GOLD', 'PLATINUM'];
    const subscriptionBreakdown = planNames
      .map((plan) => {
        const ofPlan = subs.filter((s) => s.plan === plan);
        return {
          name: plan,
          value: ofPlan.length,
          revenue: Number(
            ofPlan
              .filter((s) => s.status === 'ACTIVE')
              .reduce((sum, s) => sum + (PLAN_PRICES[s.plan] ?? 0), 0)
              .toFixed(2),
          ),
        };
      })
      .filter((p) => p.value > 0);

    const genderMap = new Map<string, number>();
    for (const p of profiles) {
      const g = p.gender || 'unknown';
      genderMap.set(g, (genderMap.get(g) ?? 0) + 1);
    }
    const genderDistribution = Array.from(genderMap.entries()).map(([name, value]) => ({ name, value }));

    return { usersByMonth, revenueByMonth, matchesByMonth, subscriptionBreakdown, genderDistribution };
  },
};

export default adminService;
