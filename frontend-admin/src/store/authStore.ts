import { create } from 'zustand';
import { Admin } from '../types/models';
import { TOKEN_KEY, ADMIN_KEY } from '../utils/constants';

interface AuthState {
  adminUser: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  setSession: (admin: Admin, token: string) => void;
  setAdmin: (admin: Admin) => void;
  logout: () => void;
}

function loadAdmin(): Admin | null {
  try {
    const raw = localStorage.getItem(ADMIN_KEY);
    return raw ? (JSON.parse(raw) as Admin) : null;
  } catch {
    return null;
  }
}

const initialToken = localStorage.getItem(TOKEN_KEY);
const initialAdmin = loadAdmin();

export const useAuthStore = create<AuthState>((set) => ({
  adminUser: initialAdmin,
  token: initialToken,
  isAuthenticated: Boolean(initialToken),

  setSession: (admin, token) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
    set({ adminUser: admin, token, isAuthenticated: true });
  },

  setAdmin: (admin) => {
    localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
    set({ adminUser: admin });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
    set({ adminUser: null, token: null, isAuthenticated: false });
  },
}));
