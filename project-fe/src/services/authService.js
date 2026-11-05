import api from './api';
import { storage } from '../utils/storage';

export const authService = {
  async register(payload) {
    const res = await api.post('/auth/register', payload);
    if (res.data?.token) {
      storage.setToken(res.data.token);
      storage.setUser(res.data.user);
    }
    return res;
  },

  async login(credentials) {
    const res = await api.post('/auth/login', credentials);
    if (res.data?.token) {
      storage.setToken(res.data.token);
      storage.setUser(res.data.user);
    }
    return res;
  },

  async getProfile() {
    const res = await api.get('/auth/me');
    if (res.data) {
      storage.setUser(res.data);
    }
    return res;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      storage.clearAuth();
    }
  },
};

