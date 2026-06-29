import { prisma } from '../config/db';
import { ApiError } from '../utils/ApiError';
import { SubscriptionPlan, SubscriptionStatus } from '@prisma/client';

/** Monthly price per plan (in the smallest currency unit's major form). */
export const PLAN_PRICES: Record<SubscriptionPlan, number> = {
  FREE: 0,
  PREMIUM: 9.99,
  GOLD: 19.99,
  PLATINUM: 29.99,
};

/** Duration in days each paid plan grants. */
const PLAN_DURATION_DAYS = 30;

export const subscriptionService = {
  async getMine(userId: string) {
    const active = await prisma.subscription.findFirst({
      where: { userId, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
    });
    const history = await prisma.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return { active, plan: active?.plan ?? SubscriptionPlan.FREE, history };
  },

  async create(userId: string, plan: SubscriptionPlan, provider: string) {
    const subscription = await prisma.subscription.create({
      data: { userId, plan, provider, status: 'PENDING' },
    });
    // In production you'd create a provider order here and return its id/secret.
    return {
      subscription,
      amount: PLAN_PRICES[plan],
      provider,
    };
  },

  async confirm(userId: string, paymentId: string, status: SubscriptionStatus) {
    const pending = await prisma.subscription.findFirst({
      where: { userId, status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
    });
    if (!pending) throw ApiError.notFound('No pending subscription to confirm');

    const now = new Date();
    const endDate =
      status === 'ACTIVE' ? new Date(now.getTime() + PLAN_DURATION_DAYS * 24 * 60 * 60 * 1000) : null;

    return prisma.subscription.update({
      where: { id: pending.id },
      data: { status, paymentId, startDate: status === 'ACTIVE' ? now : null, endDate },
    });
  },
};

export default subscriptionService;
