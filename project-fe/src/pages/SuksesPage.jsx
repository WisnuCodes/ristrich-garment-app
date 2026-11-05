import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import MainLayout from '../components/templates/MainLayout';
import Button from '../components/atoms/Button';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

export default function SuksesPage() {
  const [searchParams] = useSearchParams();
  const resi = searchParams.get('resi') || 'RG-2026-XXXX';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(resi);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto py-8 sm:py-16 text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200 shadow-xs">
          <CheckCircleOutlineIcon sx={{ fontSize: 36 }} />
        </div>

        <span className="text-2xs font-extrabold uppercase tracking-widest text-emerald-700">
          Pesanan Berhasil Dikirim
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1 font-display">
          Terima Kasih, Pesanan Anda Telah Masuk!
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-lg mx-auto leading-relaxed">
          Formulir pemesanan konveksi Anda telah tersimpan di sistem CV Ristrich Garment. Simpan nomor resi di bawah ini untuk melacak setiap tahapan produksi.
        </p>

        {/* Resi Box */}
        <div className="my-8 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 max-w-md mx-auto shadow-xs">
          <span className="text-3xs uppercase tracking-wider text-slate-400 font-bold block mb-1">
            Nomor Resi Resmi Pemesanan
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-wider py-2 select-all">
            {resi}
          </div>

          <div className="mt-4 flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-1.5"
            >
              {copied ? (
                <>
                  <DoneAllOutlinedIcon sx={{ fontSize: 16, color: '#059669' }} />
                  <span className="text-emerald-700 font-bold">Resi Berhasil Disalin!</span>
                </>
              ) : (
                <>
                  <ContentCopyOutlinedIcon sx={{ fontSize: 16 }} />
                  <span>Salin Nomor Resi</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to={`/lacak?resi=${encodeURIComponent(resi)}`} className="w-full sm:w-auto">
            <Button variant="accent" size="md" className="w-full sm:w-auto font-bold shadow-xs">
              <LocalShippingOutlinedIcon sx={{ fontSize: 16, mr: 1 }} />
              Lacak Status Produksi Sekarang
            </Button>
          </Link>
          <Link to="/riwayat" className="w-full sm:w-auto">
            <Button variant="outline" size="md" className="w-full sm:w-auto">
              <ListAltOutlinedIcon sx={{ fontSize: 16, mr: 1 }} />
              Lihat Riwayat Pesanan Saya
            </Button>
          </Link>
          <Link to="/pesan" className="w-full sm:w-auto">
            <Button variant="ghost" size="md" className="w-full sm:w-auto text-slate-600">
              <AddCircleOutlineOutlinedIcon sx={{ fontSize: 16, mr: 1 }} />
              Buat Pesanan Baru
            </Button>
          </Link>
        </div>

        {/* Next Steps Guidance */}
        <div className="mt-12 bg-slate-50 border border-slate-200/80 rounded-xl p-5 text-left text-xs text-slate-600 space-y-2">
          <div className="font-bold text-slate-900 uppercase tracking-wider text-2xs">
            Langkah Selanjutnya:
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-600 text-2xs leading-relaxed">
            <li>Admin konveksi akan memverifikasi berkas desain mockup dan ketersediaan kain dalam waktu 1x24 jam kerja.</li>
            <li>Status awal pesanan Anda adalah <strong>"Menunggu Konfirmasi"</strong>.</li>
            <li>Setelah DP dikonfirmasi, status akan otomatis beralih ke <strong>"Dikonfirmasi"</strong> dan masuk ke antrean potong kain / bordir.</li>
          </ol>
        </div>
      </div>
    </MainLayout>
  );
}

