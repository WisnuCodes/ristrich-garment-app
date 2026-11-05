import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Route Guards
import { ProtectedRoute, GuestRoute } from './components/guards/RouteGuard';

// Public & Customer Pages
import HomePage from './pages/HomePage';
import ProfilPage from './pages/ProfilPage';
import LayananPage from './pages/LayananPage';
import LayananDetailPage from './pages/LayananDetailPage';
import PortofolioPage from './pages/PortofolioPage';
import PortofolioDetailPage from './pages/PortofolioDetailPage';
import LacakPage from './pages/LacakPage';
import PesanPage from './pages/PesanPage';
import SuksesPage from './pages/SuksesPage';
import RiwayatPage from './pages/RiwayatPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import PesananPage from './pages/admin/PesananPage';
import PelangganPage from './pages/admin/PelangganPage';
import KontenPage from './pages/admin/KontenPage';

export default function App() {
  return (
    <Routes>
      {/* 1. RUTE INFORMASI PUBLIK (Bebas diakses tanpa login) */}
      <Route path="/" element={<HomePage />} />
      <Route path="/profil" element={<ProfilPage />} />
      <Route path="/layanan" element={<LayananPage />} />
      <Route path="/layanan/:id" element={<LayananDetailPage />} />
      <Route path="/portofolio" element={<PortofolioPage />} />
      <Route path="/portofolio/:id" element={<PortofolioDetailPage />} />
      <Route path="/lacak" element={<LacakPage />} />
      <Route path="/sukses" element={<SuksesPage />} />
      <Route path="/pesan" element={<PesanPage />} />

      {/* 2. RUTE GUEST ONLY (Cegah akses jika pengguna sudah terautentikasi) */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />

      {/* 3. RUTE KHUSUS PELANGGAN TERDAFTAR (Protected) */}
      <Route
        path="/riwayat"
        element={
          <ProtectedRoute allowedRoles={['pelanggan', 'admin']}>
            <RiwayatPage />
          </ProtectedRoute>
        }
      />

      {/* 4. RUTE ADMINISTRATOR WORKSHOP (Protected Strict Admin) */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/pesanan"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <PesananPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/pelanggan"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <PelangganPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/konten"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <KontenPage />
          </ProtectedRoute>
        }
      />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

      {/* 5. FALLBACK / 404 NOT FOUND */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
