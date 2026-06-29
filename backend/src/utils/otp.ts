import { env } from '../config/env';

/**
 * Lightweight in-memory OTP store. Fine for development and a single instance.
 * For production scale, back this with Redis (same interface).
 */
interface OtpEntry {
  code: string;
  expiresAt: number;
  attempts: number;
}

const store = new Map<string, OtpEntry>();
const TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 5;

export function generateOtp(phone: string): string {
  // In dev mode use a fixed code so the flow is testable without SMS.
  const code = env.otpDevMode ? '123456' : String(Math.floor(100000 + Math.random() * 900000));
  store.set(phone, { code, expiresAt: Date.now() + TTL_MS, attempts: 0 });

  if (!env.isProd) {
    // eslint-disable-next-line no-console
    console.log(`[OTP] ${phone} -> ${code}`);
  }
  // TODO: integrate a real SMS provider (Twilio/MSG91) here in production.
  return code;
}

export function verifyOtp(phone: string, code: string): { ok: boolean; reason?: string } {
  const entry = store.get(phone);
  if (!entry) return { ok: false, reason: 'No OTP requested for this phone' };
  if (Date.now() > entry.expiresAt) {
    store.delete(phone);
    return { ok: false, reason: 'OTP expired' };
  }
  if (entry.attempts >= MAX_ATTEMPTS) {
    store.delete(phone);
    return { ok: false, reason: 'Too many attempts' };
  }
  entry.attempts += 1;
  if (entry.code !== code) return { ok: false, reason: 'Invalid OTP' };

  store.delete(phone);
  return { ok: true };
}
