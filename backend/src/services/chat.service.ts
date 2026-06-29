import { prisma } from '../config/db';
import { ApiError } from '../utils/ApiError';

async function loadChatForMember(userId: string, chatId: string) {
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: { match: true },
  });
  if (!chat) throw ApiError.notFound('Chat not found');

  const { userOneId, userTwoId, status } = chat.match;
  if (userOneId !== userId && userTwoId !== userId) {
    throw ApiError.forbidden('You are not part of this chat');
  }
  if (status !== 'ACTIVE') throw ApiError.forbidden('This conversation is no longer active');

  const otherUserId = userOneId === userId ? userTwoId : userOneId;
  return { chat, otherUserId };
}

async function isBlockedBetween(a: string, b: string) {
  const block = await prisma.block.findFirst({
    where: {
      OR: [
        { blockerId: a, blockedUserId: b },
        { blockerId: b, blockedUserId: a },
      ],
    },
  });
  return Boolean(block);
}

export const chatService = {
  async listChats(userId: string) {
    const chats = await prisma.chat.findMany({
      where: {
        match: { status: 'ACTIVE', OR: [{ userOneId: userId }, { userTwoId: userId }] },
      },
      include: {
        match: {
          include: {
            userOne: { select: { id: true, profile: { select: { name: true } }, photos: { where: { isPrimary: true }, take: 1, select: { imageUrl: true } } } },
            userTwo: { select: { id: true, profile: { select: { name: true } }, photos: { where: { isPrimary: true }, take: 1, select: { imageUrl: true } } } },
          },
        },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
        _count: { select: { messages: { where: { isRead: false, NOT: { senderId: userId } } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return chats.map((c) => {
      const other = c.match.userOneId === userId ? c.match.userTwo : c.match.userOne;
      const last = c.messages[0];
      return {
        chatId: c.id,
        matchId: c.matchId,
        user: {
          id: other.id,
          name: other.profile?.name ?? '',
          photo: other.photos[0]?.imageUrl ?? null,
        },
        lastMessage: last
          ? { text: last.text, imageUrl: last.imageUrl, createdAt: last.createdAt, senderId: last.senderId }
          : null,
        unreadCount: c._count.messages,
      };
    });
  },

  async getMessages(userId: string, chatId: string) {
    await loadChatForMember(userId, chatId);
    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
    });
    return messages;
  },

  async sendMessage(userId: string, chatId: string, input: { text?: string; imageUrl?: string }) {
    const { otherUserId } = await loadChatForMember(userId, chatId);
    if (await isBlockedBetween(userId, otherUserId)) {
      throw ApiError.forbidden('You cannot message this user');
    }
    const message = await prisma.message.create({
      data: { chatId, senderId: userId, text: input.text, imageUrl: input.imageUrl },
    });
    return { message, recipientId: otherUserId };
  },

  async markRead(userId: string, chatId: string) {
    await loadChatForMember(userId, chatId);
    const result = await prisma.message.updateMany({
      where: { chatId, isRead: false, NOT: { senderId: userId } },
      data: { isRead: true },
    });
    return { updated: result.count };
  },

  /** Used by the socket layer to authorise a join/message. */
  loadChatForMember,
};

export default chatService;
