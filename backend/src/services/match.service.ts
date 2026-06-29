import { prisma } from '../config/db';
import { ApiError } from '../utils/ApiError';
import { SwipeAction } from '@prisma/client';

/** Canonical ordering so a match between A and B is stored once. */
function orderedPair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

const otherUserSelect = {
  id: true,
  profile: { select: { name: true, age: true } },
  photos: { where: { isPrimary: true }, take: 1, select: { imageUrl: true } },
};

export const matchService = {
  /** Record a swipe and create a match when both users like each other. */
  async swipe(swiperId: string, swipedUserId: string, action: SwipeAction) {
    if (swiperId === swipedUserId) throw ApiError.badRequest('You cannot swipe on yourself');

    const target = await prisma.user.findUnique({ where: { id: swipedUserId }, select: { id: true } });
    if (!target) throw ApiError.notFound('User not found');

    await prisma.swipe.upsert({
      where: { swiperId_swipedUserId: { swiperId, swipedUserId } },
      create: { swiperId, swipedUserId, action },
      update: { action },
    });

    if (action === SwipeAction.PASS) return { isMatch: false, matchId: null };

    // Did the other person already like me?
    const reciprocal = await prisma.swipe.findUnique({
      where: { swiperId_swipedUserId: { swiperId: swipedUserId, swipedUserId: swiperId } },
    });
    const likedBack =
      reciprocal && (reciprocal.action === SwipeAction.LIKE || reciprocal.action === SwipeAction.SUPERLIKE);

    if (!likedBack) return { isMatch: false, matchId: null };

    const [userOneId, userTwoId] = orderedPair(swiperId, swipedUserId);
    const match = await prisma.match.upsert({
      where: { userOneId_userTwoId: { userOneId, userTwoId } },
      create: {
        userOneId,
        userTwoId,
        status: 'ACTIVE',
        chat: { create: {} },
      },
      update: { status: 'ACTIVE' },
      include: { chat: true },
    });

    return { isMatch: true, matchId: match.id, chatId: match.chat?.id ?? null };
  },

  async listMatches(userId: string) {
    const blocks = await prisma.block.findMany({
      where: { OR: [{ blockerId: userId }, { blockedUserId: userId }] },
      select: { blockerId: true, blockedUserId: true },
    });
    const blockedIds = new Set(blocks.flatMap((b) => [b.blockerId, b.blockedUserId]));
    blockedIds.delete(userId);

    const matches = await prisma.match.findMany({
      where: {
        status: 'ACTIVE',
        OR: [{ userOneId: userId }, { userTwoId: userId }],
      },
      include: {
        chat: {
          include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
        },
        userOne: { select: otherUserSelect },
        userTwo: { select: otherUserSelect },
      },
      orderBy: { createdAt: 'desc' },
    });

    return matches
      .map((m) => {
        const other = m.userOneId === userId ? m.userTwo : m.userOne;
        return { match: m, other };
      })
      .filter(({ other }) => !blockedIds.has(other.id))
      .map(({ match, other }) => ({
        matchId: match.id,
        chatId: match.chat?.id ?? null,
        createdAt: match.createdAt,
        user: {
          id: other.id,
          name: other.profile?.name ?? '',
          age: other.profile?.age ?? null,
          photo: other.photos[0]?.imageUrl ?? null,
        },
        lastMessage: match.chat?.messages[0]
          ? {
              text: match.chat.messages[0].text,
              imageUrl: match.chat.messages[0].imageUrl,
              createdAt: match.chat.messages[0].createdAt,
            }
          : null,
      }));
  },

  async unmatch(userId: string, matchId: string) {
    const match = await prisma.match.findUnique({ where: { id: matchId } });
    if (!match) throw ApiError.notFound('Match not found');
    if (match.userOneId !== userId && match.userTwoId !== userId) {
      throw ApiError.forbidden('You are not part of this match');
    }
    await prisma.match.update({ where: { id: matchId }, data: { status: 'UNMATCHED' } });
    return { unmatched: true };
  },

  /* ------------------------------ Intros ----------------------------- */

  async sendIntro(senderId: string, receiverId: string, message: string) {
    if (senderId === receiverId) throw ApiError.badRequest('You cannot intro yourself');
    const receiver = await prisma.user.findUnique({ where: { id: receiverId }, select: { id: true } });
    if (!receiver) throw ApiError.notFound('User not found');

    return prisma.intro.create({ data: { senderId, receiverId, message } });
  },

  async receivedIntros(userId: string) {
    return prisma.intro.findMany({
      where: { receiverId: userId, status: 'PENDING' },
      include: { sender: { select: otherUserSelect } },
      orderBy: { createdAt: 'desc' },
    });
  },

  async respondIntro(userId: string, introId: string, status: 'ACCEPTED' | 'REJECTED') {
    const intro = await prisma.intro.findUnique({ where: { id: introId } });
    if (!intro) throw ApiError.notFound('Intro not found');
    if (intro.receiverId !== userId) throw ApiError.forbidden('Not your intro to respond to');

    const updated = await prisma.intro.update({ where: { id: introId }, data: { status } });

    let matchId: string | null = null;
    if (status === 'ACCEPTED') {
      const [userOneId, userTwoId] = orderedPair(intro.senderId, intro.receiverId);
      const match = await prisma.match.upsert({
        where: { userOneId_userTwoId: { userOneId, userTwoId } },
        create: { userOneId, userTwoId, status: 'ACTIVE', chat: { create: {} } },
        update: { status: 'ACTIVE' },
      });
      matchId = match.id;
    }
    return { intro: updated, matchId };
  },
};

export default matchService;
