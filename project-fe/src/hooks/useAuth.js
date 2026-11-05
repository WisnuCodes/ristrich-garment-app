import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

export function useAuth() {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    initAuth,
    clearError,
  } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return {
    user,
    token,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    isPelanggan: user?.role === 'pelanggan',
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };
}

