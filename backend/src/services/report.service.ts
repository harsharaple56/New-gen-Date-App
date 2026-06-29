import { prisma } from '../config/db';
import { ApiError } from '../utils/ApiError';

export const reportService = {
  async createReport(reporterId: string, input: { reportedUserId: string; reason: string; description?: string }) {
    if (reporterId === input.reportedUserId) throw ApiError.badRequest('You cannot report yourself');
    const target = await prisma.user.findUnique({ where: { id: input.reportedUserId }, select: { id: true } });
    if (!target) throw ApiError.notFound('User not found');

    return prisma.report.create({
      data: {
        reporterId,
        reportedUserId: input.reportedUserId,
        reason: input.reason,
        description: input.description,
      },
    });
  },

  async block(blockerId: string, blockedUserId: string) {
    if (blockerId === blockedUserId) throw ApiError.badRequest('You cannot block yourself');
    const target = await prisma.user.findUnique({ where: { id: blockedUserId }, select: { id: true } });
    if (!target) throw ApiError.notFound('User not found');

    await prisma.block.upsert({
      where: { blockerId_blockedUserId: { blockerId, blockedUserId } },
      create: { blockerId, blockedUserId },
      update: {},
    });

    // Unmatch any active match between the two users.
    const [a, b] = blockerId < blockedUserId ? [blockerId, blockedUserId] : [blockedUserId, blockerId];
    await prisma.match.updateMany({
      where: { userOneId: a, userTwoId: b },
      data: { status: 'UNMATCHED' },
    });

    return { blocked: true };
  },

  async unblock(blockerId: string, blockedUserId: string) {
    await prisma.block.deleteMany({ where: { blockerId, blockedUserId } });
    return { unblocked: true };
  },

  async listBlocks(userId: string) {
    const blocks = await prisma.block.findMany({
      where: { blockerId: userId },
      include: {
        blocked: { select: { id: true, profile: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return blocks.map((b) => ({
      id: b.blockedUserId,
      name: b.blocked.profile?.name ?? '',
      blockedAt: b.createdAt,
    }));
  },
};

export default reportService;
