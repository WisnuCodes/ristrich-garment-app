import { create } from 'zustand';
import { storage } from '../utils/storage';
import { authService } from '../services/authService';

export const useAuthStore = create((set, get) => ({
  user: storage.getUser(),
  token: storage.getToken(),
  isAuthenticated: !!storage.getToken(),
  isLoading: false,
  error: null,

  initAuth: async () => {
    const token = storage.getToken();
    if (!token) {
      set({ user: null, token: null, isAuthenticated: false });
      return;
    }

    try {
      const res = await authService.getProfile();
      if (res?.data) {
        set({ user: res.data, isAuthenticated: true });
      }
    } catch {
      storage.clearAuth();
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.login(credentials);
      const user = res.data?.user;
      const token = res.data?.token;
      set({ user, token, isAuthenticated: true, isLoading: false });
      return res;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login gagal. Periksa kembali email dan password.';
      set({ error: msg, isLoading: false });
      throw err;
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.register(payload);
      const user = res.data?.user;
      const token = res.data?.token;
      set({ user, token, isAuthenticated: true, isLoading: false });
      return res;
    } catch (err) {
      const msg = err.response?.data?.message || 'Pendaftaran gagal.';
      set({ error: msg, isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
    } catch (e) {
      console.warn('Logout warning:', e);
    } finally {
      storage.clearAuth();
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      window.location.href = '/login';
    }
  },

  clearError: () => set({ error: null }),
}));

