import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getChats,
  getMatches,
  getMe,
  getMessages,
  getProfiles,
  login,
  sendMessage,
  swipeProfile,
  verifyOtp,
} from './api';
import { queryKeys } from './queryClient';
import { useAppStore } from '../store/useAppStore';

/* ----------------------------- Auth ----------------------------- */

export function useLogin() {
  return useMutation({ mutationFn: (phone: string) => login(phone) });
}

export function useVerifyOtp() {
  const loginToStore = useAppStore((s) => s.login);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  return useMutation({
    mutationFn: ({ phone, code }: { phone: string; code: string }) => verifyOtp(phone, code),
    onSuccess: ({ user, token, onboardingComplete }) => {
      loginToStore(user, token);
      if (onboardingComplete) completeOnboarding();
    },
  });
}

/* --------------------------- Profiles --------------------------- */

export function useProfiles() {
  const setProfiles = useAppStore((s) => s.setProfiles);
  const query = useQuery({ queryKey: queryKeys.profiles, queryFn: getProfiles });

  useEffect(() => {
    if (query.data) setProfiles(query.data);
  }, [query.data, setProfiles]);

  return query;
}

export function useSwipe() {
  const queryClient = useQueryClient();
  const removeProfile = useAppStore((s) => s.removeProfile);
  const addMatch = useAppStore((s) => s.addMatch);

  return useMutation({
    mutationFn: ({ profileId, direction }: { profileId: string; direction: 'like' | 'pass' }) =>
      swipeProfile(profileId, direction),
    onSuccess: (result, variables) => {
      const swiped = useAppStore.getState().profiles.find((p) => p.id === variables.profileId);
      removeProfile(variables.profileId);
      if (result.matched && result.matchId && swiped) {
        addMatch({ id: result.matchId, profile: swiped, matchedAt: new Date().toISOString() });
        queryClient.invalidateQueries({ queryKey: queryKeys.matches });
      }
    },
  });
}

/* ---------------------------- Matches --------------------------- */

export function useMatches() {
  const setMatches = useAppStore((s) => s.setMatches);
  const query = useQuery({ queryKey: queryKeys.matches, queryFn: getMatches });

  useEffect(() => {
    if (query.data) setMatches(query.data);
  }, [query.data, setMatches]);

  return query;
}

/* ----------------------------- Chats ---------------------------- */

export function useChats() {
  const setChats = useAppStore((s) => s.setChats);
  const query = useQuery({ queryKey: queryKeys.chats, queryFn: getChats });

  useEffect(() => {
    if (query.data) setChats(query.data);
  }, [query.data, setChats]);

  return query;
}

export function useMessages(chatId: string) {
  const setMessages = useAppStore((s) => s.setMessages);
  const query = useQuery({
    queryKey: queryKeys.messages(chatId),
    queryFn: () => getMessages(chatId),
    enabled: !!chatId,
  });

  useEffect(() => {
    if (query.data) setMessages(chatId, query.data);
  }, [query.data, chatId, setMessages]);

  return query;
}

export function useSendMessage(chatId: string) {
  return useMutation({ mutationFn: (text: string) => sendMessage(chatId, text) });
}

/* ------------------------------ Me ------------------------------ */

export function useMe() {
  const setUser = useAppStore((s) => s.setUser);
  const query = useQuery({ queryKey: queryKeys.me, queryFn: getMe });

  useEffect(() => {
    if (query.data) setUser(query.data);
  }, [query.data, setUser]);

  return query;
}
