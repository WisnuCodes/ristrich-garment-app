import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../components/templates/MainLayout';
import Button from '../components/atoms/Button';
import Spinner from '../components/atoms/Spinner';
import { catalogService } from '../services/trackingService';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';

const SIZE_CHART = [
  { size: 'S', dada: 48, badan: 68, lengan: 58 },
  { size: 'M', dada: 51, badan: 70, lengan: 59 },
  { size: 'L', dada: 54, badan: 72, lengan: 60 },
  { size: 'XL', dada: 57, badan: 74, lengan: 61 },
  { size: 'XXL', dada: 60, badan: 76, lengan: 62 },
  { size: '3XL', dada: 63, badan: 78, lengan: 63 },
];

export default function LayananDetailPage() {
  const { id } = useParams();
  const [layanan, setLayanan] = useState(null);
  const [allLayanan, setAllLayanan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [detailRes, listRes] = await Promise.all([
          catalogService.getLayananDetail(id),
          catalogService.getLayanan(),
        ]);
        if (isMounted) {
          setLayanan(detailRes.data);
          setAllLayanan(listRes.data || []);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Data layanan konveksi tidak ditemukan.');
          setLoading(false);
        }
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [id]);

  if (loading) {
    return (
      <MainLayout activePage="/layanan">
        <div className="py-32 flex justify-center bg-white rounded-3xl border border-slate-200" data-ui="loading-state">
          <Spinner size={36} label="Memuat spesifikasi teknis busana..." />
        </div>
      </MainLayout>
    );
  }

  if (error || !layanan) {
    return (
      <MainLayout activePage="/layanan">
        <div data-ui="error-state" className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto my-12 space-y-4">
          <div className="text-sm font-bold text-slate-900 font-display">Layanan Tidak Ditemukan</div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {error || 'Informasi paket layanan busana yang Anda cari tidak tersedia di database katalog.'}
          </p>
          <div className="pt-2">
            <Link to="/layanan">
              <Button variant="outline" size="sm">
                <ArrowBackOutlinedIcon sx={{ fontSize: 14, mr: 1 }} />
                Kembali ke Katalog
              </Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const relatedItems = allLayanan.filter((item) => String(item.id) !== String(id)).slice(0, 3);

  return (
    <MainLayout activePage="/layanan">
      {/* 1. BREADCRUMBS NAVIGATION */}
      <nav className="flex items-center gap-2 text-2xs text-slate-500 mb-8" data-ui="breadcrumbs">
        <Link to="/" className="hover:text-slate-900 transition-colors">Beranda</Link>
        <span>/</span>
        <Link to="/layanan" className="hover:text-slate-900 transition-colors">Katalog Layanan</Link>
        <span>/</span>
        <span className="font-semibold text-slate-900">{layanan.nama_layanan}</span>
      </nav>

      {/* 2. PRIMARY SPECIFICATION HERO */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16 items-start" data-ui="spec-hero">
        {/* Visual Frame */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 overflow-hidden" data-ui="media-frame">
          <div className="h-80 sm:h-96 bg-slate-100 overflow-hidden relative">
            <img
              src={layanan.gambar_url || layanan.foto_url || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200&auto=format&fit=crop&q=80'}
              alt={layanan.nama_layanan}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200&auto=format&fit=crop&q=80';
              }}
            />
            <div className="absolute top-4 left-4 bg-slate-900/90 text-white text-3xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <AccessTimeOutlinedIcon sx={{ fontSize: 13, color: '#f59e0b' }} />
              <span>{layanan.estimasi_hari ? `${layanan.estimasi_hari} Hari Kerja` : '10–14 Hari Kerja Standar'}</span>
            </div>
            <div className="absolute top-4 right-4 bg-slate-900/90 text-amber-400 text-3xs font-bold px-3 py-1.5 rounded-lg tabular-nums">
              MOQ {layanan.minimal_order || 24} Pcs
            </div>
          </div>
          <div className="p-5 bg-slate-50 flex items-center justify-between text-2xs text-slate-600">
            <span className="font-medium">Standar Pabrikasi: Garmen Industri Surakarta</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircleOutlinedIcon sx={{ fontSize: 14 }} />
              QC Grade A Lolos Toleransi
            </span>
          </div>
        </div>

        {/* Narrative & Technical Header */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 font-display">
              <VerifiedUserOutlinedIcon sx={{ fontSize: 16 }} />
              <span>SPESIFIKASI PRODUKSI GARMEN RESMI</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight mt-1 font-display">
              {layanan.nama_layanan}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
              {layanan.deskripsi}
            </p>
          </div>

          {/* Quick Technical Specs Panel */}
          <div className="bg-slate-50 rounded-2xl p-5 space-y-3.5 text-xs" data-ui="specs-panel">
            <div>
              <span className="text-slate-400 font-medium block text-2xs">Rekomendasi Bahan Kain:</span>
              <strong className="text-slate-900 text-sm block mt-0.5 font-display">
                {layanan.bahan_rekomendasi || 'Nagata Drill Japan / American 1919'}
              </strong>
            </div>

            <div className="flex items-center justify-between text-slate-600 pt-1">
              <span>Standar Mesin Perakitan:</span>
              <strong className="text-slate-900 font-medium">{layanan.standar_mesin || 'Bordir Komputer Tajima & Juki Jarum 2'}</strong>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Batas Toleransi Ukuran:</span>
              <strong className="text-slate-900 font-medium tabular-nums">{layanan.toleransi_qc || '±0.5 cm (Pola CAD Optitex)'}</strong>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Ketentuan Sampel Fisik:</span>
              <strong className="text-slate-900 font-medium">Gratis 1 Pcs Approval (Order 100+ Pcs)</strong>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Legalitas Transaksi:</span>
              <span className="text-slate-900 font-medium">Mendukung Faktur Pajak PPN / PPh Resmi</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Link
              to={`/pesan?kategori=${encodeURIComponent(layanan.nama_layanan)}`}
              className="w-full sm:w-auto"
            >
              <Button variant="accent" size="lg" className="w-full sm:w-auto font-bold px-8 justify-center">
                Pesan {layanan.nama_layanan}
                <ArrowForwardOutlinedIcon sx={{ fontSize: 16, ml: 1 }} />
              </Button>
            </Link>

            <a
              href={`https://wa.me/6281234567890?text=Halo%20CV%20Ristrich%20Garment,%20saya%20ingin%20konsultasi%20spesifikasi%20layanan:%20${encodeURIComponent(layanan.nama_layanan)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
            >
              <WhatsAppIcon sx={{ fontSize: 16 }} />
              <span>Konsultasi Teknis WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 3. SIZE CHART SPECIFICATION TABLE */}
      <section className="mb-16 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8" data-ui="size-table-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 font-display">
              <StraightenOutlinedIcon sx={{ fontSize: 16 }} />
              <span>PANDUAN UKURAN WORKSHOP (SIZE CHART SNI)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-950 font-display mt-0.5">
              Standarisasi Dimensi Pola Potong Digital
            </h2>
          </div>
          <span className="text-2xs text-slate-500">
            Toleransi jahit ±0.5 cm • Tersedia ukuran jumbo hingga 5XL
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs" data-ui="table-specs">
            <thead data-ui="table-head" className="bg-slate-50 border-b border-slate-200 text-slate-600 text-2xs font-bold">
              <tr>
                <th className="py-3 px-4">Ukuran Standar</th>
                <th className="py-3 px-4 text-center">Lebar Dada (cm)</th>
                <th className="py-3 px-4 text-center">Panjang Badan (cm)</th>
                <th className="py-3 px-4 text-center">Panjang Lengan (cm)</th>
                <th className="py-3 px-4 text-right">Rekomendasi Berat Badan</th>
              </tr>
            </thead>
            <tbody data-ui="table-body" className="divide-y divide-slate-100">
              {SIZE_CHART.map((row) => (
                <tr key={row.size} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 font-display">
                    Size {row.size}
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-slate-800 tabular-nums">
                    {row.dada} cm
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-slate-800 tabular-nums">
                    {row.badan} cm
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-slate-800 tabular-nums">
                    {row.lengan} cm
                  </td>
                  <td className="py-3 px-4 text-right text-slate-500 text-2xs">
                    Tersedia fitting sampel
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. WORKSHOP MANUFACTURING STANDARDS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 space-y-2" data-ui="feature-card">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <PrecisionManufacturingOutlinedIcon sx={{ fontSize: 20 }} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 font-display">Mesin Bordir Tajima Jepang</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Kerapatan benang bordir tinggi hingga 1000 RPM, memastikan detail logo instansi tajam, tidak mengkerut pada kain, dan awet dicuci berkali-kali.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 space-y-2" data-ui="feature-card">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircleOutlinedIcon sx={{ fontSize: 20 }} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 font-display">QC 5 Tahap Ketat</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Pemeriksaan menyeluruh dari inspeksi gulungan kain, ketepatan pola potong, kestabilan jahitan stik jarum dua, hingga steam press dan pembuangan sisa benang.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 space-y-2" data-ui="feature-card">
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
            <VerifiedUserOutlinedIcon sx={{ fontSize: 20 }} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 font-display">Garansi Pengerjaan 30 Hari</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Komitmen perbaikan atau penggantian 100% tanpa biaya tambahan apabila terdapat cacat jahit atau ketidaksesuaian ukuran di luar toleransi pesanan SPK.
          </p>
        </div>
      </section>

      {/* 5. RELATED SERVICES CARDS */}
      {relatedItems.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between pb-6 mb-4">
            <div>
              <div className="text-2xs font-bold text-amber-600 font-display">OPSI PRODUKSI LAINNYA</div>
              <h2 className="text-xl font-bold text-slate-950 font-display mt-0.5">
                Katalog Layanan Terkait
              </h2>
            </div>
            <Link to="/layanan" className="text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors">
              Lihat Seluruh Katalog →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedItems.map((item) => (
              <div
                key={item.id}
                data-ui="garment-card"
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-colors group"
              >
                <div>
                  <div className="h-44 bg-slate-100 overflow-hidden relative">
                    <img
                      src={item.gambar_url || item.foto_url || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&auto=format&fit=crop&q=80'}
                      alt={item.nama_layanan}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-slate-950 font-display group-hover:text-amber-600 transition-colors">
                      {item.nama_layanan}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {item.deskripsi}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Link to={`/layanan/${item.id}`} className="block w-full">
                    <Button variant="outline" size="xs" className="w-full justify-center font-bold">
                      Lihat Rincian Spesifikasi
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </MainLayout>
  );
}

