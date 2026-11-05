import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import { useAuthStore } from '../../stores/authStore';
import Button from '../atoms/Button';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout, initAuth } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    initAuth();
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [initAuth]);

  const navLinks = [
    { label: 'Beranda', path: '/' },
    { label: 'Katalog Layanan', path: '/layanan' },
    { label: 'Portofolio', path: '/portofolio' },
    { label: 'Profil Workshop', path: '/profil' },
    { label: 'Lacak Resi', path: '/lacak' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-white transition-colors duration-200 ${
        scrolled ? 'py-2.5' : 'py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Bespoke Tailor Monogram Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-md bg-slate-950 text-amber-400 flex items-center justify-center font-black text-xs tracking-tighter border border-slate-800 group-hover:bg-slate-900 transition-colors">
              RG
            </div>
            <div>
              <div className="text-sm font-black tracking-tight text-slate-950 uppercase font-display leading-none">
                CV Ristrich Garment
              </div>
              <div className="text-3xs font-medium text-slate-500 uppercase tracking-widest mt-0.5">
                Surakarta Apparel &amp; Uniform
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-xs font-semibold px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'text-slate-950 bg-slate-100 font-bold'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Action / Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/pesan">
              <Button variant="accent" size="sm" className="font-bold">
                Pesan Busana
              </Button>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2">
                {user?.role === 'admin' ? (
                  <Link to="/admin/dashboard">
                    <Button variant="secondary" size="sm" className="font-semibold text-xs gap-1">
                      <DashboardOutlinedIcon sx={{ fontSize: 15 }} />
                      <span>Panel Admin</span>
                    </Button>
                  </Link>
                ) : (
                  <Link to="/riwayat">
                    <Button variant="secondary" size="sm" className="font-semibold text-xs gap-1">
                      <ReceiptLongOutlinedIcon sx={{ fontSize: 15 }} />
                      <span>Pesanan Saya</span>
                    </Button>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  title="Keluar dari akun"
                  className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                >
                  <LogoutOutlinedIcon sx={{ fontSize: 17 }} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-xs font-semibold">
                    Masuk
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="sm" className="text-xs font-semibold">
                    Daftar
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-50 px-4 pt-3 pb-6 space-y-2 mt-3 animate-in fade-in duration-150">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2 rounded-md text-xs font-semibold ${
                  location.pathname === item.path
                    ? 'bg-slate-200 text-slate-950 font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="pt-3 flex flex-col gap-2">
            <Link to="/pesan" onClick={() => setMobileOpen(false)}>
              <Button variant="accent" size="sm" className="w-full justify-center font-bold">
                Pesan Busana Sekarang
              </Button>
            </Link>

            {isAuthenticated ? (
              <div className="space-y-2 pt-1">
                {user?.role === 'admin' ? (
                  <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)}>
                    <Button variant="secondary" size="sm" className="w-full justify-center font-semibold">
                      Buka Panel Admin
                    </Button>
                  </Link>
                ) : (
                  <Link to="/riwayat" onClick={() => setMobileOpen(false)}>
                    <Button variant="secondary" size="sm" className="w-full justify-center font-semibold">
                      Riwayat Pesanan Saya
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="w-full justify-center text-rose-600"
                >
                  Keluar Akun
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-center">
                    Masuk
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full justify-center">
                    Daftar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
