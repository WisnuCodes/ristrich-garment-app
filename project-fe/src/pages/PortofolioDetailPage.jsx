import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../components/templates/MainLayout';
import Button from '../components/atoms/Button';
import Spinner from '../components/atoms/Spinner';
import { catalogService } from '../services/trackingService';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';

export default function PortofolioDetailPage() {
  const { id } = useParams();
  const [portofolio, setPortofolio] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [detailRes, allRes] = await Promise.all([
          catalogService.getPortofolioDetail(id),
          catalogService.getPortofolio(),
        ]);
        if (isMounted) {
          setPortofolio(detailRes.data);
          const others = (allRes.data || [])
            .filter((item) => String(item.id) !== String(id))
            .slice(0, 3);
          setRelatedItems(others);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Data portofolio hasil produksi tidak ditemukan.');
          setLoading(false);
        }
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [id]);

  if (loading) {
    return (
      <MainLayout activePage="/portofolio">
        <div className="py-32 flex justify-center bg-white rounded-3xl border border-slate-200" data-ui="loading-state">
          <Spinner size={36} label="Memuat dokumentasi hasil produksi..." />
        </div>
      </MainLayout>
    );
  }

  if (error || !portofolio) {
    return (
      <MainLayout activePage="/portofolio">
        <div data-ui="error-state" className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto my-12 space-y-4">
          <div className="text-sm font-bold text-slate-900 font-display">Portofolio Tidak Ditemukan</div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {error || 'Dokumentasi portofolio yang Anda cari tidak tersedia di katalog.'}
          </p>
          <div className="pt-2">
            <Link to="/portofolio">
              <Button variant="outline" size="sm">
                <ArrowBackOutlinedIcon sx={{ fontSize: 14, mr: 1 }} />
                Kembali ke Galeri Portofolio
              </Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout activePage="/portofolio">
      {/* 1. BREADCRUMBS NAVIGATION */}
      <nav className="flex items-center gap-2 text-2xs text-slate-500 mb-8" data-ui="breadcrumbs">
        <Link to="/" className="hover:text-slate-900 transition-colors">Beranda</Link>
        <span>/</span>
        <Link to="/portofolio" className="hover:text-slate-900 transition-colors">Galeri Portofolio</Link>
        <span>/</span>
        <span className="font-semibold text-slate-900">{portofolio.judul}</span>
      </nav>

      {/* 2. PRIMARY PORTOFOLIO SHOWCASE */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16 items-start" data-ui="porto-showcase">
        {/* Visual Frame */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 overflow-hidden" data-ui="media-frame">
          <div className="h-96 sm:h-[460px] bg-slate-100 overflow-hidden relative">
            <img
              src={portofolio.gambar_url || portofolio.foto_url || 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=1200&auto=format&fit=crop&q=80'}
              alt={portofolio.judul}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=1200&auto=format&fit=crop&q=80';
              }}
            />
            <div className="absolute top-4 left-4 bg-slate-900/90 text-white text-3xs font-semibold px-3 py-1.5 rounded-lg">
              Kategori: {portofolio.kategori}
            </div>
            <div className="absolute top-4 right-4 bg-slate-900/90 text-amber-400 text-3xs font-bold px-3 py-1.5 rounded-lg tabular-nums">
              Volume: {portofolio.jumlah_produksi || 100} Pcs
            </div>
          </div>
          <div className="p-5 bg-slate-50 flex items-center justify-between text-2xs text-slate-600">
            <span className="font-medium">Dokumentasi Nyata Pengerjaan Workshop Surakarta</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircleOutlinedIcon sx={{ fontSize: 14 }} />
              100% Produksi Selesai &amp; Diserahkan
            </span>
          </div>
        </div>

        {/* Project Metadata & Detail Sheet */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 font-display">
              <VerifiedUserOutlinedIcon sx={{ fontSize: 16 }} />
              <span>DOKUMENTASI PRODUKSI GARMEN ASLI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-1 font-display">
              {portofolio.judul}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
              {portofolio.deskripsi_singkat || 'Pengerjaan busana kerja instansi dengan ketelitian jahitan garmen, kerapatan bordir komputer Tajima, dan kesesuaian fitting pola standar SNI.'}
            </p>
          </div>

          {/* Manufacturing Project Attributes Panel */}
          <div className="bg-slate-50 rounded-2xl p-5 space-y-3.5 text-xs" data-ui="specs-panel">
            {portofolio.klien && (
              <div className="flex items-center justify-between text-slate-600">
                <span>Klien / Instansi:</span>
                <strong className="text-slate-900 font-semibold">{portofolio.klien}</strong>
              </div>
            )}

            <div className="flex items-center justify-between text-slate-600">
              <span>Kategori Busana:</span>
              <strong className="text-slate-900 font-semibold">{portofolio.kategori}</strong>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Jumlah Pengerjaan:</span>
              <strong className="text-slate-900 font-bold tabular-nums">
                {(portofolio.jumlah_produksi || 100).toLocaleString('id-ID')} Pcs
              </strong>
            </div>

            {portofolio.bahan_terpakai && (
              <div className="flex items-center justify-between text-slate-600">
                <span>Material Bahan:</span>
                <strong className="text-slate-900 font-medium">{portofolio.bahan_terpakai}</strong>
              </div>
            )}

            <div className="flex items-center justify-between text-slate-600">
              <span>Aplikasi Identitas:</span>
              <strong className="text-slate-900 font-medium">{portofolio.teknik_identitas || 'Bordir Komputer Tajima / Sablon Presisi'}</strong>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Jaminan Kualitas:</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircleOutlinedIcon sx={{ fontSize: 13 }} />
                QC Lolos Toleransi ±0.5cm
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Faktur &amp; Pajak:</span>
              <span className="text-slate-900 font-medium">Tersedia Faktur Pajak Resmi Instansi</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <Link
              to={`/pesan?kategori=${encodeURIComponent(portofolio.kategori || 'Kemeja')}`}
              className="block w-full"
            >
              <Button variant="accent" size="lg" className="w-full font-bold justify-center">
                Pesan Model Serupa Seperti Ini
                <ArrowForwardOutlinedIcon sx={{ fontSize: 16, ml: 1 }} />
              </Button>
            </Link>

            <a
              href={`https://wa.me/6281234567890?text=Halo%20CV%20Ristrich%20Garment,%20saya%20ingin%20konsultasi%20pemesanan%20model%20serupa%20portofolio:%20${encodeURIComponent(portofolio.judul)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
            >
              <WhatsAppIcon sx={{ fontSize: 16 }} />
              <span>Konsultasi Model via WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 3. WORKSHOP TRUST MARKERS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 space-y-2" data-ui="feature-card">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <PrecisionManufacturingOutlinedIcon sx={{ fontSize: 20 }} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 font-display">Pola Potong CAD Presisi</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Setiap pakaian dipotong mengikuti pola digital terkalibrasi untuk menjamin keseragaman fitting dari ukuran S sampai ukuran jumbo 5XL.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 space-y-2" data-ui="feature-card">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircleOutlinedIcon sx={{ fontSize: 20 }} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 font-display">Approval Sampel Fisik</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Untuk pemesanan partai besar (100 pcs ke atas), kami membuatkan 1 pcs sampel fisik lengkap dengan bordir untuk diuji dan disetujui sebelum produksi massal.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 space-y-2" data-ui="feature-card">
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
            <LocalShippingOutlinedIcon sx={{ fontSize: 20 }} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 font-display">Ekspedisi Logistik Terpercaya</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Didukung kemasan karung goni berlapis plastik kedap air dan pengiriman via kargo darat, laut, atau udara dengan pelacakan resi transparan.
          </p>
        </div>
      </section>

      {/* 4. RELATED PORTFOLIO SHOWCASE */}
      {relatedItems.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between pb-6 mb-4">
            <div>
              <div className="text-2xs font-bold text-amber-600 font-display">HASIL KARYA LAINNYA</div>
              <h2 className="text-xl font-bold text-slate-950 font-display mt-0.5">
                Portofolio Produksi Terkait
              </h2>
            </div>
            <Link to="/portofolio" className="text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors">
              Lihat Seluruh Galeri →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedItems.map((item) => (
              <div
                key={item.id}
                data-ui="portfolio-card"
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-colors group"
              >
                <div>
                  <div className="h-44 bg-slate-100 overflow-hidden relative">
                    <img
                      src={item.gambar_url || item.foto_url || 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=600&auto=format&fit=crop&q=80'}
                      alt={item.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-slate-900/90 text-white text-3xs font-semibold px-2 py-0.5 rounded">
                      {item.kategori}
                    </div>
                  </div>
                  <div className="p-4">
                    <span className="text-3xs text-amber-700 font-bold block tabular-nums">
                      {item.jumlah_produksi ? `${item.jumlah_produksi} pcs` : 'Partai Massal'}
                    </span>
                    <h3 className="text-sm font-bold text-slate-950 font-display group-hover:text-amber-600 transition-colors mt-0.5">
                      {item.judul}
                    </h3>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Link to={`/portofolio/${item.id}`} className="block w-full">
                    <Button variant="outline" size="xs" className="w-full justify-center font-bold">
                      Lihat Detail Pengerjaan
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

