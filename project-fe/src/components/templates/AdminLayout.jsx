import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PermMediaOutlinedIcon from '@mui/icons-material/PermMediaOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../atoms/Spinner';

export function AdminLayout({ children, activeTab = 'dashboard', title = 'Dashboard Administrator' }) {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: 'dashboard', label: 'Ringkasan Dashboard', path: '/admin/dashboard', icon: <DashboardOutlinedIcon sx={{ fontSize: 18 }} /> },
    { key: 'pesanan', label: 'Pesanan Masuk', path: '/admin/pesanan', icon: <ReceiptLongOutlinedIcon sx={{ fontSize: 18 }} /> },
    { key: 'pelanggan', label: 'Data Pelanggan', path: '/admin/pelanggan', icon: <PeopleAltOutlinedIcon sx={{ fontSize: 18 }} /> },
    { key: 'konten', label: 'Kelola Konten', path: '/admin/konten', icon: <PermMediaOutlinedIcon sx={{ fontSize: 18 }} /> },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-slate-900 text-white">
        <Spinner size={36} label="Memverifikasi izin akses admin..." />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-slate-100 text-slate-900 font-sans">
      {/* Sidebar Rail */}
      <aside className="w-full md:w-64 bg-slate-950 text-slate-300 flex flex-col shrink-0 border-r border-slate-900">
        {/* Brand */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-mono font-black text-xs">
            RG
          </div>
          <div>
            <div className="text-xs font-black tracking-tight text-white uppercase font-display leading-none">
              Ristrich Admin
            </div>
            <div className="text-3xs text-amber-400 uppercase tracking-widest mt-1 font-mono">
              Production Control
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-slate-900 bg-slate-900/50">
          <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
          <p className="text-2xs text-slate-400 truncate">{user?.email}</p>
          <span className="inline-block mt-1 text-3xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
            Role: Admin
          </span>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 flex-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || activeTab === item.key;
            return (
              <Link
                key={item.key}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-2xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-900 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <ArrowBackOutlinedIcon sx={{ fontSize: 16 }} />
            <span>Lihat Website Publik</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-950/40 transition-colors"
          >
            <LogoutOutlinedIcon sx={{ fontSize: 16 }} />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 font-display">
            {title}
          </h1>
          <div className="text-2xs text-slate-500">
            CV Ristrich Garment Management Console
          </div>
        </header>

        <main className="p-6 md:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
