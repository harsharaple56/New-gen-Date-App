import { prisma } from '../config/db';
import { ApiError } from '../utils/ApiError';
import { Prisma } from '@prisma/client';

/* ----------------------------- Helpers ----------------------------- */

function haversineKm(
  a: { lat?: number | null; lng?: number | null },
  b: { lat?: number | null; lng?: number | null },
): number | null {
  if (a.lat == null || a.lng == null || b.lat == null || b.lng == null) return null;
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

type UserWithRelations = Prisma.UserGetPayload<{
  include: { profile: true; photos: true; interests: { include: { interest: true } } };
}>;

/** Map a DB user into the frontend-friendly shape used across the app. */
export function formatUser(
  user: UserWithRelations,
  viewer?: { lat?: number | null; lng?: number | null },
) {
  const photos = [...user.photos]
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
    .map((p) => p.imageUrl);

  return {
    id: user.id,
    name: user.profile?.name ?? '',
    age: user.profile?.age ?? null,
    gender: user.profile?.gender ?? null,
    bio: user.profile?.bio ?? '',
    location: user.profile?.location ?? null,
    occupation: user.profile?.occupation ?? null,
    education: user.profile?.education ?? null,
    height: user.profile?.height ?? null,
    photos,
    interests: user.interests.map((i) => i.interest.name),
    distanceKm: viewer
      ? haversineKm(viewer, { lat: user.profile?.latitude, lng: user.profile?.longitude })
      : null,
  };
}

const fullInclude = {
  profile: true,
  photos: true,
  interests: { include: { interest: true } },
} satisfies Prisma.UserInclude;

/* ---------------------------- Block helpers ------------------------ */

async function blockedUserIds(userId: string): Promise<string[]> {
  const [made, received] = await Promise.all([
    prisma.block.findMany({ where: { blockerId: userId }, select: { blockedUserId: true } }),
    prisma.block.findMany({ where: { blockedUserId: userId }, select: { blockerId: true } }),
  ]);
  return [...made.map((b) => b.blockedUserId), ...received.map((b) => b.blockerId)];
}

/* ------------------------------ Service ---------------------------- */

export const userService = {
  async discover(userId: string) {
    const me = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, preference: true },
    });
    if (!me) throw ApiError.notFound('Account not found');

    const [blocked, swipes] = await Promise.all([
      blockedUserIds(userId),
      prisma.swipe.findMany({ where: { swiperId: userId }, select: { swipedUserId: true } }),
    ]);
    const excludeIds = [userId, ...blocked, ...swipes.map((s) => s.swipedUserId)];

    const pref = me.preference;
    const genderFilter =
      pref && pref.genderPreference && pref.genderPreference.toUpperCase() !== 'ALL'
        ? { equals: pref.genderPreference, mode: 'insensitive' as const }
        : undefined;

    const candidates = await prisma.user.findMany({
      where: {
        id: { notIn: excludeIds },
        isBlocked: false,
        role: 'USER',
        profile: {
          is: {
            ...(pref ? { age: { gte: pref.minAge, lte: pref.maxAge } } : {}),
            ...(genderFilter ? { gender: genderFilter } : {}),
          },
        },
      },
      include: fullInclude,
      take: 50,
    });

    const viewer = { lat: me.profile?.latitude, lng: me.profile?.longitude };
    let users = candidates.map((c) => formatUser(c, viewer));

    if (pref) {
      users = users.filter((u) => u.distanceKm == null || u.distanceKm <= pref.distanceKm);
    }

    return { users };
  },

  async getProfile(targetUserId: string) {
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: fullInclude,
    });
    if (!user) throw ApiError.notFound('User not found');
    return formatUser(user);
  },

  async getMyProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { ...fullInclude, preference: true },
    });
    if (!user) throw ApiError.notFound('Account not found');
    return { ...formatUser(user), preference: user.preference };
  },

  async upsertProfile(
    userId: string,
    data: {
      name: string;
      age: number;
      gender: string;
      bio?: string;
      location?: string;
      latitude?: number;
      longitude?: number;
      occupation?: string;
      education?: string;
      height?: number;
      drinking?: string;
      smoking?: string;
      relationshipGoal?: string;
    },
  ) {
    const profile = await prisma.profile.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
    return profile;
  },

  async addPhoto(userId: string, imageUrl: string, isPrimary = false) {
    if (isPrimary) {
      await prisma.userPhoto.updateMany({ where: { userId }, data: { isPrimary: false } });
    }
    const count = await prisma.userPhoto.count({ where: { userId } });
    return prisma.userPhoto.create({
      data: { userId, imageUrl, isPrimary: isPrimary || count === 0 },
    });
  },

  async deletePhoto(userId: string, photoId: string) {
    const photo = await prisma.userPhoto.findUnique({ where: { id: photoId } });
    if (!photo || photo.userId !== userId) throw ApiError.notFound('Photo not found');
    await prisma.userPhoto.delete({ where: { id: photoId } });
    return { deleted: true };
  },

  async setInterests(userId: string, interestIds: string[]) {
    const valid = await prisma.interest.findMany({ where: { id: { in: interestIds } }, select: { id: true } });
    const validIds = valid.map((i) => i.id);

    await prisma.$transaction([
      prisma.userInterest.deleteMany({ where: { userId } }),
      prisma.userInterest.createMany({
        data: validIds.map((interestId) => ({ userId, interestId })),
        skipDuplicates: true,
      }),
    ]);
    return { interestIds: validIds };
  },

  async setPreferences(
    userId: string,
    data: { minAge: number; maxAge: number; distanceKm: number; genderPreference: string },
  ) {
    return prisma.preference.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  },
};

export default userService;
