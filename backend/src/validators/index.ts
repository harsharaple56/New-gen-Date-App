import { z } from 'zod';

/* ------------------------------- Auth ------------------------------ */

export const registerSchema = z.object({
  body: z.object({
    phone: z.string().min(7, 'A valid phone number is required'),
    email: z.string().email().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('A valid email is required'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const sendOtpSchema = z.object({
  body: z.object({
    phone: z.string().min(7, 'A valid phone number is required'),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    phone: z.string().min(7),
    otp: z.string().length(6, 'OTP must be 6 digits'),
  }),
});

/* ------------------------------ Profile ---------------------------- */

export const upsertProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(60),
    age: z.coerce.number().int().min(18).max(120),
    gender: z.string().min(1),
    bio: z.string().max(500).optional(),
    location: z.string().max(120).optional(),
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
    occupation: z.string().max(120).optional(),
    education: z.string().max(120).optional(),
    height: z.coerce.number().int().min(120).max(250).optional(),
    drinking: z.string().max(40).optional(),
    smoking: z.string().max(40).optional(),
    relationshipGoal: z.string().max(60).optional(),
  }),
});

export const interestsSchema = z.object({
  body: z.object({
    interestIds: z.array(z.string()).min(1, 'Select at least one interest'),
  }),
});

export const preferencesSchema = z.object({
  body: z.object({
    minAge: z.coerce.number().int().min(18).max(120),
    maxAge: z.coerce.number().int().min(18).max(120),
    distanceKm: z.coerce.number().int().min(1).max(500),
    genderPreference: z.string().min(1),
  }),
});

/* ------------------------------- Swipe ----------------------------- */

export const swipeSchema = z.object({
  body: z.object({
    swipedUserId: z.string().min(1),
    action: z.enum(['LIKE', 'PASS', 'SUPERLIKE']),
  }),
});

/* ------------------------------- Intro ----------------------------- */

export const introSchema = z.object({
  body: z.object({
    receiverId: z.string().min(1),
    message: z.string().min(1).max(500),
  }),
});

export const introRespondSchema = z.object({
  body: z.object({
    status: z.enum(['ACCEPTED', 'REJECTED']),
  }),
});

/* ------------------------------- Chat ------------------------------ */

export const sendMessageSchema = z.object({
  body: z
    .object({
      text: z.string().max(2000).optional(),
      imageUrl: z.string().url().optional(),
    })
    .refine((b) => b.text || b.imageUrl, { message: 'A message must include text or an image' }),
});

/* --------------------------- Report / Block ------------------------ */

export const reportSchema = z.object({
  body: z.object({
    reportedUserId: z.string().min(1),
    reason: z.string().min(1, 'A reason is required'),
    description: z.string().max(1000).optional(),
  }),
});

export const blockSchema = z.object({
  body: z.object({
    blockedUserId: z.string().min(1),
  }),
});

/* ---------------------------- Subscription ------------------------- */

export const createSubscriptionSchema = z.object({
  body: z.object({
    plan: z.enum(['PREMIUM', 'GOLD', 'PLATINUM']),
    provider: z.string().min(1),
  }),
});

export const confirmSubscriptionSchema = z.object({
  body: z.object({
    paymentId: z.string().min(1),
    status: z.enum(['ACTIVE', 'CANCELLED', 'EXPIRED']),
  }),
});

/* ------------------------------- Admin ----------------------------- */

export const adminLoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});

export const reportActionSchema = z.object({
  body: z.object({
    status: z.enum(['REVIEWED', 'ACTION_TAKEN', 'PENDING']),
    blockUser: z.boolean().optional(),
  }),
});

export const broadcastNotificationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'A title is required').max(120),
    body: z.string().min(1, 'A message body is required').max(1000),
    audience: z.enum(['all', 'active', 'premium', 'free']).optional(),
  }),
});
