import api from './api';
import { Admin } from '../types/models';
import { useAuthStore } from '../store/authStore';
import { Envelope, mapAdmin } from './adapters';

export interface LoginResponse {
  success: boolean;
  token: string;
  admin: Admin;
}

export const authService = {
  login: (email: string, password: string) =>
    api
      .post<Envelope<{ token: string; admin: Parameters<typeof mapAdmin>[0] }>>('/admin/login', {
        email,
        password,
      })
      .then((r) => ({
        success: r.data.success,
        token: r.data.data.token,
        admin: mapAdmin(r.data.data.admin),
      })),

  // The backend has no dedicated `me` endpoint; the session is restored from
  // the persisted admin in the auth store.
  me: () => {
    const admin = useAuthStore.getState().adminUser;
    if (!admin) return Promise.reject(new Error('Not authenticated'));
    return Promise.resolve(admin);
  },
};
