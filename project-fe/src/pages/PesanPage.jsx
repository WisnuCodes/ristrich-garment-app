import React from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import MainLayout from '../components/templates/MainLayout';
import OrderForm from '../components/organisms/OrderForm';
import Button from '../components/atoms/Button';
import { useAuthStore } from '../stores/authStore';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function PesanPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialKategori = searchParams.get('kategori') || '';
  const { isAuthenticated, user } = useAuthStore();

  const handleSuccess = (pesananData) => {
    // Navigate to success page with resi parameter
    const resi = pesananData?.kode_resi || '';
    navigate(`/sukses?resi=${encodeURIComponent(resi)}`);
  };

  return (
    <MainLayout activePage="/pesan">
      {/* Header */}
      <section className="mb-8">
        <div className="max-w-3xl">
          <span className="text-2xs font-extrabold uppercase tracking-widest text-amber-700">
            Formulir Pemesanan Resmi
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1 font-display">
            Formulir Order Konveksi Busana
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Lengkapi spesifikasi busana yang Anda butuhkan. Sistem otomatis menghitung total pcs per ukuran dan langsung menerbitkan kode resi resmi workshop setelah formulir dikirim.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mb-16">
        {!isAuthenticated ? (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-4 border border-amber-200/80">
              <LockOutlinedIcon sx={{ fontSize: 28 }} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight font-display">
              Silakan Masuk Terlebih Dahulu
            </h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed max-w-md mx-auto">
              Untuk menjamin keamanan pemesanan, penerbitan invoice resmi, dan riwayat pesanan yang terintegrasi, harap masuk atau daftarkan akun Anda terlebih dahulu.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/login?redirect=/pesan" className="w-full sm:w-auto">
                <Button variant="accent" size="md" className="w-full sm:w-auto font-bold">
                  <LoginOutlinedIcon sx={{ fontSize: 16, mr: 1 }} />
                  Masuk ke Akun Saya
                </Button>
              </Link>
              <Link to="/register?redirect=/pesan" className="w-full sm:w-auto">
                <Button variant="outline" size="md" className="w-full sm:w-auto">
                  <PersonAddOutlinedIcon sx={{ fontSize: 16, mr: 1 }} />
                  Daftar Akun Baru
                </Button>
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-2xs text-slate-400">
              <InfoOutlinedIcon sx={{ fontSize: 14 }} />
              <span>Pendaftaran hanya membutuhkan nama, email, dan nomor WhatsApp.</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* User notification banner */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-xl px-4 py-3 flex items-center justify-between text-xs text-slate-700">
              <div>
                Memesan sebagai: <strong className="text-slate-900">{user?.name}</strong> ({user?.email} - {user?.phone_number || 'No. Telp belum terdaftar'})
              </div>
              <span className="text-3xs uppercase tracking-wider font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                Role: {user?.role}
              </span>
            </div>

            <OrderForm
              onSuccess={handleSuccess}
              initialKategori={initialKategori}
            />
          </div>
        )}
      </section>
    </MainLayout>
  );
}

