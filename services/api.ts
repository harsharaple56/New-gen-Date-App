import axios, { AxiosError, AxiosInstance } from 'axios';
import { ImageSourcePropType } from 'react-native';
import { Chat, Match, Message, Profile, User } from '../types/models';
import { useAppStore } from '../store/useAppStore';
import { mockBackend } from './mockBackend';

/**
 * Set to `true` to run fully offline against the in-memory mock backend.
 * `false` hits the real Align API (see `API_HOST`).
 */
export const USE_MOCK = false;

/**
 * Host of the Align backend.
 * - Production builds: set EXPO_PUBLIC_API_HOST (see eas.json) to your API URL.
 * - iOS simulator / web: http://localhost:5000
 * - Android emulator:     http://10.0.2.2:5000
 * - Physical device:      http://<your-machine-LAN-IP>:5000
 */
export const API_HOST = process.env.EXPO_PUBLIC_API_HOST ?? 'http://localhost:5000';
export const BASE_URL = `${API_HOST}/api`;

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the auth token to every outgoing request.
api.interceptors.request.use((config) => {
  const token = useAppStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Normalises Axios errors into a readable Error for the UI / React Query. */
export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;
    if (status === 401) {
      // Token expired / invalid — sign the user out.
      useAppStore.getState().logout();
    }
    const message =
      error.response?.data?.message ??
      error.message ??
      'Something went wrong. Please try again.';
    return Promise.reject(new ApiError(message, status));
  },
);

/* ------------------------------------------------------------------ *
 * Response envelope + mapping helpers
 * The backend wraps payloads as `{ success, data }`. These helpers map the
 * server shapes into the frontend domain models the screens already consume.
 * ------------------------------------------------------------------ */

type Envelope<T> = { success: boolean; data: T };

const fallbackPhoto = (name?: string): ImageSourcePropType => ({
  uri: `https://ui-avatars.com/api/?background=E5E0FF&color=4B2EAA&name=${encodeURIComponent(name || 'Align')}`,
});

const toImage = (url?: string | null, name?: string): ImageSourcePropType =>
  url ? { uri: url } : fallbackPhoto(name);

type DiscoverUser = {
  id: string;
  name: string;
  age: number | null;
  bio?: string;
  location?: string | null;
  photos: string[];
  interests: string[];
  distanceKm?: number | null;
};

function mapProfile(u: DiscoverUser): Profile {
  return {
    id: u.id,
    name: u.name,
    age: u.age ?? 0,
    location: u.location ?? '',
    photo: toImage(u.photos?.[0], u.name),
    tags: u.interests ?? [],
    bio: u.bio ?? '',
    aligned: typeof u.distanceKm === 'number' ? Math.max(40, 100 - u.distanceKm) : undefined,
  };
}

type BackendMatch = {
  matchId: string;
  chatId: string | null;
  createdAt: string;
  user: { id: string; name: string; age: number | null; photo: string | null };
};

function mapMatch(m: BackendMatch): Match {
  return {
    id: m.matchId,
    matchedAt: m.createdAt,
    profile: {
      id: m.user.id,
      name: m.user.name,
      age: m.user.age ?? 0,
      location: '',
      photo: toImage(m.user.photo, m.user.name),
      tags: [],
    },
  };
}

type BackendChat = {
  chatId: string;
  matchId: string;
  user: { id: string; name: string; photo: string | null };
  lastMessage: { text: string | null; imageUrl: string | null; createdAt: string } | null;
  unreadCount: number;
};

function formatTime(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function mapChat(c: BackendChat): Chat {
  return {
    id: c.chatId,
    name: c.user.name,
    avatar: toImage(c.user.photo, c.user.name),
    message: c.lastMessage?.text ?? (c.lastMessage?.imageUrl ? '📷 Photo' : 'Say hi 👋'),
    time: formatTime(c.lastMessage?.createdAt),
    unread: c.unreadCount > 0,
  };
}

type BackendMessage = {
  id: string;
  chatId: string;
  senderId: string;
  text: string | null;
  imageUrl: string | null;
  createdAt: string;
};

export function mapMessage(m: BackendMessage, currentUserId?: string): Message {
  return {
    id: m.id,
    chatId: m.chatId,
    text: m.text ?? '',
    fromMe: !!currentUserId && m.senderId === currentUserId,
    createdAt: m.createdAt,
  };
}

/* ------------------------------------------------------------------ *
 * API functions
 * Each returns a promise the screens consume via React Query / mutations.
 * ------------------------------------------------------------------ */

export type LoginResponse = { otpSent: boolean; phone: string };
export type VerifyOtpResponse = { token: string; user: User; onboardingComplete?: boolean };
export type SwipeResponse = { matched: boolean; matchId: string | null };

/** LoginScreen → requests an OTP for the given phone number. */
export async function login(phone: string): Promise<LoginResponse> {
  if (USE_MOCK) return mockBackend.login(phone);
  const { data } = await api.post<Envelope<{ otpSent: boolean; phone: string }>>('/auth/send-otp', { phone });
  return data.data;
}

/** OtpScreen → verifies the OTP and returns a session token + user. */
export async function verifyOtp(phone: string, code: string): Promise<VerifyOtpResponse> {
  if (USE_MOCK) return mockBackend.verifyOtp(phone, code);
  const { data } = await api.post<
    Envelope<{
      token: string;
      user: { id: string; phone: string; isVerified: boolean };
      onboardingComplete: boolean;
    }>
  >('/auth/verify-otp', { phone, otp: code });
  const d = data.data;
  return {
    token: d.token,
    onboardingComplete: d.onboardingComplete,
    user: {
      id: d.user.id,
      name: '',
      age: 0,
      location: '',
      phone: d.user.phone ?? phone,
      photo: fallbackPhoto(),
      bio: '',
      verified: !!d.user.isVerified,
      premium: false,
    },
  };
}

/** HomeScreen → discover stack of candidate profiles. */
export async function getProfiles(): Promise<Profile[]> {
  if (USE_MOCK) return mockBackend.getProfiles();
  const { data } = await api.get<Envelope<{ users: DiscoverUser[] }>>('/users/discover');
  return data.data.users.map(mapProfile);
}

/** Swipe → records a like/pass and reports whether it produced a match. */
export async function swipeProfile(
  profileId: string,
  direction: 'like' | 'pass',
): Promise<SwipeResponse> {
  if (USE_MOCK) return mockBackend.swipeProfile(profileId, direction);
  const action = direction === 'like' ? 'LIKE' : 'PASS';
  const { data } = await api.post<Envelope<{ isMatch: boolean; matchId: string | null }>>('/swipes', {
    swipedUserId: profileId,
    action,
  });
  return { matched: data.data.isMatch, matchId: data.data.matchId };
}

/** MatchesScreen → list of mutual matches. */
export async function getMatches(): Promise<Match[]> {
  if (USE_MOCK) return mockBackend.getMatches();
  const { data } = await api.get<Envelope<{ matches: BackendMatch[] }>>('/matches');
  return data.data.matches.map(mapMatch);
}

/** ChatListScreen → conversation previews. */
export async function getChats(): Promise<Chat[]> {
  if (USE_MOCK) return mockBackend.getChats();
  const { data } = await api.get<Envelope<{ chats: BackendChat[] }>>('/chats');
  return data.data.chats.map(mapChat);
}

/** ChatScreen → message history for a conversation. */
export async function getMessages(chatId: string): Promise<Message[]> {
  if (USE_MOCK) return mockBackend.getMessages(chatId);
  const currentUserId = useAppStore.getState().user?.id;
  const { data } = await api.get<Envelope<{ messages: BackendMessage[] }>>(`/chats/${chatId}/messages`);
  return data.data.messages.map((m) => mapMessage(m, currentUserId));
}

/** ChatScreen → send a message (also broadcast over Socket.IO by the server). */
export async function sendMessage(chatId: string, text: string): Promise<Message> {
  if (USE_MOCK) return mockBackend.sendMessage(chatId, text);
  const currentUserId = useAppStore.getState().user?.id;
  const { data } = await api.post<Envelope<BackendMessage>>(`/chats/${chatId}/messages`, { text });
  return mapMessage(data.data, currentUserId);
}

/** Profile → the authenticated user's full profile. */
export async function getMe(): Promise<User> {
  if (USE_MOCK) return mockBackend.getMe();
  const { data } = await api.get<
    Envelope<{
      id: string;
      name: string;
      age: number | null;
      location: string | null;
      bio?: string;
      photos: string[];
    }>
  >('/profile/me');
  const p = data.data;
  const existing = useAppStore.getState().user;
  return {
    id: p.id,
    name: p.name || existing?.name || '',
    age: p.age ?? existing?.age ?? 0,
    location: p.location ?? existing?.location ?? '',
    phone: existing?.phone ?? '',
    photo: toImage(p.photos?.[0], p.name),
    bio: p.bio ?? existing?.bio ?? '',
    verified: existing?.verified ?? true,
    premium: existing?.premium ?? false,
  };
}

export default api;
