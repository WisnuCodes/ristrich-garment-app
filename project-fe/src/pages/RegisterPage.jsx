import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../components/templates/AuthLayout';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import { useAuth } from '../hooks/useAuth';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '';
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    password_confirmation: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    if (formData.password !== formData.password_confirmation) {
      setFieldErrors((prev) => ({
        ...prev,
        password_confirmation: ['Konfirmasi kata sandi tidak cocok.'],
      }));
      return;
    }

    try {
      await register(formData);
      if (redirect) {
        navigate(redirect);
      } else {
        navigate('/');
      }
    } catch (err) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else {
        setGeneralError(err.response?.data?.message || 'Pendaftaran akun gagal. Silakan coba kembali.');
      }
    }
  };

  return (
    <AuthLayout
      title="Daftar Akun Baru"
      subtitle="Buat akun pelanggan untuk mengajukan pesanan seragam dan pelacakan resi."
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-2.5">
        {generalError && (
          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <ErrorOutlineOutlinedIcon sx={{ fontSize: 16, color: '#e11d48', mt: 0.2 }} />
            <span>{generalError}</span>
          </div>
        )}

        <Input
          label="Nama Lengkap / Instansi"
          name="name"
          placeholder="Budi Santoso / PT Samudera"
          value={formData.name}
          onChange={handleChange}
          error={fieldErrors.name?.[0]}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <Input
            label="Alamat Email"
            name="email"
            type="email"
            placeholder="nama@instansi.com"
            value={formData.email}
            onChange={handleChange}
            error={fieldErrors.email?.[0]}
            required
          />

          <Input
            label="Nomor WhatsApp"
            name="phone_number"
            placeholder="081234567890"
            value={formData.phone_number}
            onChange={handleChange}
            error={fieldErrors.phone_number?.[0]}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <Input
            label="Kata Sandi (Min. 6 Karakter)"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={fieldErrors.password?.[0]}
            required
          />

          <Input
            label="Konfirmasi Kata Sandi"
            name="password_confirmation"
            type="password"
            placeholder="••••••••"
            value={formData.password_confirmation}
            onChange={handleChange}
            error={fieldErrors.password_confirmation?.[0]}
            required
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isLoading}
            className="w-full justify-center font-bold py-2.5"
          >
            Daftar Akun Sekarang
          </Button>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            Sudah memiliki akun?{' '}
            <Link
              to={redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login'}
              className="text-slate-900 font-bold hover:underline"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
