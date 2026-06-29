import { prisma } from '../config/db';
import { hashPassword, comparePassword } from '../utils/password';
import { signToken } from '../utils/jwt';
import { generateOtp, verifyOtp as checkOtp } from '../utils/otp';
import { ApiError } from '../utils/ApiError';
import { Role, User } from '@prisma/client';

/** Strip sensitive fields before returning a user to clients. */
export function publicUser(user: User) {
  return {
    id: user.id,
    phone: user.phone,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    isBlocked: user.isBlocked,
    createdAt: user.createdAt,
  };
}

/** Create the per-user default rows (preference + notification settings). */
async function ensureDefaults(userId: string) {
  await prisma.preference.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
  await prisma.notificationSetting.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
}

export const authService = {
  async register(input: { phone: string; email?: string; password: string }) {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ phone: input.phone }, ...(input.email ? [{ email: input.email }] : [])] },
    });
    if (existing) throw ApiError.conflict('An account with that phone or email already exists');

    const passwordHash = await hashPassword(input.password);
    const user = await prisma.user.create({
      data: { phone: input.phone, email: input.email, passwordHash },
    });
    await ensureDefaults(user.id);

    const token = signToken({ sub: user.id, role: user.role });
    return { token, user: publicUser(user) };
  },

  async login(input: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !user.passwordHash) throw ApiError.unauthorized('Invalid email or password');
    if (user.isBlocked) throw ApiError.forbidden('Account is blocked');

    const valid = await comparePassword(input.password, user.passwordHash);
    if (!valid) throw ApiError.unauthorized('Invalid email or password');

    const token = signToken({ sub: user.id, role: user.role });
    return { token, user: publicUser(user) };
  },

  async sendOtp(phone: string) {
    generateOtp(phone);
    return { otpSent: true, phone };
  },

  /** Verify OTP, creating a passwordless account on first login. */
  async verifyOtp(phone: string, otp: string) {
    const result = checkOtp(phone, otp);
    if (!result.ok) throw ApiError.badRequest(result.reason ?? 'Invalid OTP');

    let user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await prisma.user.create({ data: { phone, isVerified: true } });
      await ensureDefaults(user.id);
    } else if (!user.isVerified) {
      user = await prisma.user.update({ where: { id: user.id }, data: { isVerified: true } });
    }
    if (user.isBlocked) throw ApiError.forbidden('Account is blocked');

    const hasProfile = (await prisma.profile.count({ where: { userId: user.id } })) > 0;
    const token = signToken({ sub: user.id, role: user.role });
    return { token, user: publicUser(user), onboardingComplete: hasProfile };
  },

  async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, notificationSetting: true },
    });
    if (!user) throw ApiError.notFound('Account not found');
    return {
      ...publicUser(user),
      profile: user.profile,
      onboardingComplete: Boolean(user.profile),
      notificationSetting: user.notificationSetting,
    };
  },

  async adminLogin(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) throw ApiError.unauthorized('Invalid credentials');
    if (user.role !== Role.ADMIN && user.role !== Role.MODERATOR) {
      throw ApiError.forbidden('Not an admin account');
    }
    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) throw ApiError.unauthorized('Invalid credentials');

    const token = signToken({ sub: user.id, role: user.role });
    return { token, admin: publicUser(user) };
  },
};

export default authService;
