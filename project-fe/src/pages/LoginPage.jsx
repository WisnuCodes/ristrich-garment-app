import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../components/templates/AuthLayout';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import { useAuth } from '../hooks/useAuth';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '';
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!email.trim() || !password.trim()) {
      setLocalError('Harap isi alamat email dan password Anda.');
      return;
    }

    try {
      const res = await login({ email: email.trim(), password });
      const user = res.data?.user;

      if (redirect) {
        navigate(redirect);
      } else if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Email atau password yang Anda masukkan tidak valid.');
    }
  };

  return (
    <AuthLayout
      title="Masuk ke Akun"
      subtitle="Akses portal pemesanan, pantau status produksi, dan kelola riwayat pesanan."
      maxWidth="max-w-sm"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {localError && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <ErrorOutlineOutlinedIcon sx={{ fontSize: 16, color: '#e11d48', mt: 0.2 }} />
            <span>{localError}</span>
          </div>
        )}

        <Input
          label="Alamat Email"
          type="email"
          placeholder="nama@instansi.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />

        <Input
          label="Kata Sandi / Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isLoading}
            className="w-full justify-center font-bold py-2.5"
          >
            Masuk Sekarang
          </Button>
        </div>

        <div className="text-center pt-3">
          <p className="text-xs text-slate-500">
            Belum memiliki akun pelanggan?{' '}
            <Link
              to={redirect ? `/register?redirect=${encodeURIComponent(redirect)}` : '/register'}
              className="text-slate-900 font-bold hover:underline"
            >
              Daftar di sini
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
