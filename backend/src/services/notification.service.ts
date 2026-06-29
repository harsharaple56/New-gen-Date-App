import { prisma } from '../config/db';
import { ApiError } from '../utils/ApiError';

export const notificationService = {
  async get(userId: string) {
    const settings = await prisma.notificationSetting.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
    return settings;
  },

  async update(
    userId: string,
    patch: { matchNotifications?: boolean; chatNotifications?: boolean; promoNotifications?: boolean },
  ) {
    const exists = await prisma.notificationSetting.findUnique({ where: { userId } });
    if (!exists) throw ApiError.notFound('Notification settings not found');
    return prisma.notificationSetting.update({ where: { userId }, data: patch });
  },
};

export default notificationService;
