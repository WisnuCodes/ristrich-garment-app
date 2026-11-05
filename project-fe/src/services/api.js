import axios from 'axios';
import { storage } from '../utils/storage';

// Base URL mengarah ke Laravel backend API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor: Sisipkan token Sanctum Bearer jika tersedia
api.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const res = error.response;
    if (res) {
      const currentPath = window.location.pathname;
      const isPublicPage = ['/login', '/register', '/lacak', '/', '/layanan', '/portofolio', '/profil'].some(p => currentPath === p);

      if (res.status === 401 || res.status === 419) {
        // Token expired atau sesi invalid
        if (!isPublicPage) {
          storage.clearAuth();
          const redirect = encodeURIComponent(currentPath + window.location.search);
          window.location.href = `/login?redirect=${redirect}`;
        }
      } else if (res.status === 403) {
        // Akses ditolak (misal pelanggan mengakses rute admin)
        console.warn('Security: Akses ditolak (403 Forbidden).');
        if (currentPath.startsWith('/admin')) {
          window.location.href = '/riwayat';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

