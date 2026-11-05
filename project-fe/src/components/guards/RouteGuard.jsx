import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { storage } from '../../utils/storage';
import Spinner from '../atoms/Spinner';

/**
 * ProtectedRoute: Memastikan pengguna sudah login.
 * Jika `allowedRoles` didefinisikan, memastikan peran pengguna (misal: 'admin') cocok.
 */
export function ProtectedRoute({ children, allowedRoles = null }) {
  const location = useLocation();
  const { user, isAuthenticated, isLoading, initAuth } = useAuthStore();
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const check = async () => {
      // Jika ada token tetapi profil user belum dimuat ke memori, panggil initAuth
      const token = storage.getToken();
      if (token && !user) {
        await initAuth();
      }
      if (isMounted) {
        setHasInitialized(true);
      }
    };
    check();
    return () => {
      isMounted = false;
    };
  }, [initAuth, user]);

  // Tampilkan loading saat proses verifikasi token/profil berlangsung
  if (!hasInitialized || isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-slate-50 text-slate-900">
        <Spinner size={36} label="Memverifikasi izin akses pengguna..." />
      </div>
    );
  }

  // Jika tidak memiliki token / belum login
  if (!isAuthenticated && !storage.getToken()) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectUrl}`} replace />;
  }

  // Jika role dibatasi dan user tidak memenuhi role yang diizinkan
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Jika pelanggan mencoba mengakses panel admin, kembalikan ke beranda/riwayat
    if (user.role === 'pelanggan') {
      return <Navigate to="/riwayat" replace />;
    }
    // Jika admin mengakses rute khusus pelanggan, arahkan ke dashboard admin
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}

/**
 * GuestRoute: Khusus untuk halaman Login & Register.
 * Jika pengguna SUDAH login, cegah akses form login dan arahkan langsung ke dashboard sesuai role.
 */
export function GuestRoute({ children }) {
  const { user, isAuthenticated } = useAuthStore();
  const token = storage.getToken();

  if (isAuthenticated || token) {
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;

