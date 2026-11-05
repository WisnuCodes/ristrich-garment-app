import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/templates/MainLayout';
import Button from '../components/atoms/Button';
import Spinner from '../components/atoms/Spinner';
import Input from '../components/atoms/Input';
import { catalogService } from '../services/trackingService';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';

const CATEGORY_TABS = [
  'Semua Layanan',
  'Kemeja PDH & PDL',
  'Polo Shirt Bordir',
  'Wearpack & Rompi',
  'Jaket & Hoodie',
  'Kaos & Jersey',
];

const FABRIC_SWATCHES = [
  {
    nama: 'Nagata Drill Japan',
    komposisi: '80% Katun, 20% Polyester',
    karakter: 'Serat pintal tebal, permukaan halus dingin, warna tahan luntur >2 tahun.',
    aplikasi: 'Standar Utama Kemeja PDH / PDL Dinas Pemda & Kementerian',
  },
  {
    nama: 'Taipan Tropical',
    komposisi: 'Serat Terylene & Katun Berpori',
    karakter: 'Tekstur jatuh, ringan, sirkulasi udara maksimal untuk iklim tropis.',
    aplikasi: 'Seragam Eksekutif BUMN, Seragam Perbankan & Korporat',
  },
  {
    nama: 'Lacoste CVC 24s',
    komposisi: 'Campuran Cotton & Viscose Piqué',
    karakter: 'Anyaman rajut honeycomb tebal, menyerap keringat, tidak mudah melar.',
    aplikasi: 'Polo Shirt Formal Kantor & Kaos Kerah Event Resmi',
  },
  {
    nama: 'Ripstop Tornado K3',
    komposisi: 'Anyaman Grid Serat Tahan Robek',
    karakter: 'Konstruksi kotak penahan robekan, water-repellent, standar keselamatan.',
    aplikasi: 'Wearpack Tambang, Rompi Multi-Saku & Seragam Lapangan',
  },
  {
    nama: 'Cotton Combed 24s/30s',
    komposisi: '100% Serat Kapas Alami Reaktif',
    karakter: 'Gramasi 185–195 gsm, sangat lembut di kulit, permukaan halus untuk sablon.',
    aplikasi: 'Kaos Panitia, Event Gathering & Merchandise Distro',
  },
];

export default function LayananPage() {
  const [layananList, setLayananList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedTab, setSelectedTab] = useState('Semua Layanan');

  useEffect(() => {
    let isMounted = true;
    async function fetchLayanan() {
      setLoading(true);
      setError(null);
      try {
        const res = await catalogService.getLayanan();
        if (isMounted) {
          setLayananList(res.data || []);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Gagal memuat katalog layanan.');
          setLoading(false);
        }
      }
    }
    fetchLayanan();
    return () => { isMounted = false; };
  }, []);

  const filteredLayanan = layananList.filter((item) => {
    // 1. Text search filter
    const matchesSearch = !search.trim() || (
      item.nama_layanan?.toLowerCase().includes(search.toLowerCase()) ||
      item.deskripsi?.toLowerCase().includes(search.toLowerCase()) ||
      item.bahan_rekomendasi?.toLowerCase().includes(search.toLowerCase())
    );

    // 2. Category tab filter
    if (!matchesSearch) return false;
    if (selectedTab === 'Semua Layanan') return true;
    if (selectedTab === 'Kemeja PDH & PDL') return /kemeja|pdh|pdl/i.test(item.nama_layanan);
    if (selectedTab === 'Polo Shirt Bordir') return /polo/i.test(item.nama_layanan);
    if (selectedTab === 'Wearpack & Rompi') return /wearpack|rompi/i.test(item.nama_layanan);
    if (selectedTab === 'Jaket & Hoodie') return /jaket|hoodie|bomber|parka/i.test(item.nama_layanan);
    if (selectedTab === 'Kaos & Jersey') return /kaos|jersey/i.test(item.nama_layanan);
    return true;
  });

  return (
    <MainLayout activePage="/layanan">
      {/* 1. EDITORIAL HEADER SECTION */}
      <section className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 font-display">
              <VerifiedUserOutlinedIcon sx={{ fontSize: 16 }} />
              <span>KATALOG PRODUKSI GARMEN • WORKSHOP SURAKARTA</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight mt-1 font-display">
              Layanan Produksi Busana &amp; Seragam.
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Spesifikasi busana kerja dinas instansi, polo shirt bordir komputer Tajima, wearpack lapangan K3, dan busana massal dengan standar toleransi mutu garmen industri.
            </p>
          </div>

          <div className="w-full md:w-80 shrink-0">
            <Input
              placeholder="Cari jenis pakaian, bahan kain..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-xs"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORY_TABS.map((tab) => {
            const isActive = selectedTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedTab(tab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-slate-950 text-white font-bold'
                    : 'bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. CATALOG GRID */}
      {loading ? (
        <div className="py-20 flex justify-center bg-white rounded-2xl border border-slate-200">
          <Spinner size={32} label="Memuat katalog layanan dari workshop..." />
        </div>
      ) : error ? (
        <div data-ui="feedback-state" className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-2xl text-xs text-center">
          <p className="font-semibold">{error}</p>
        </div>
      ) : filteredLayanan.length === 0 ? (
        <div data-ui="feedback-state" className="bg-white border border-slate-200 p-12 rounded-2xl text-center text-slate-500 text-xs space-y-2">
          <p className="font-semibold text-slate-800 text-sm">Tidak ada layanan konveksi yang cocok.</p>
          <p>Coba kata kunci pencarian lain atau pilih tab kategori "Semua Layanan".</p>
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch('');
                setSelectedTab('Semua Layanan');
              }}
            >
              Reset Filter Pencarian
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredLayanan.map((item) => (
            <div
              key={item.id}
              data-ui="garment-card"
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-colors group"
            >
              <div>
                {/* Visual Header with Real Photography */}
                <div className="h-52 bg-slate-100 overflow-hidden relative">
                  <img
                    src={item.foto_url || '/images/placeholder-service.jpg'}
                    alt={item.nama_layanan}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-3xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5">
                    <AccessTimeOutlinedIcon sx={{ fontSize: 13, color: '#f59e0b' }} />
                    <span>{item.estimasi_hari ? `${item.estimasi_hari} Hari Kerja` : '10–14 Hari Kerja'}</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-slate-900/90 text-amber-400 text-3xs font-bold px-2.5 py-1 rounded-md tabular-nums">
                    MOQ {item.minimal_order || 24} Pcs
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <Link to={`/layanan/${item.id}`}>
                    <h3 className="text-base font-bold text-slate-950 font-display group-hover:text-amber-600 transition-colors">
                      {item.nama_layanan}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {item.deskripsi}
                  </p>

                  {/* Manufacturing Specs Panel */}
                  <div className="mt-4 p-3.5 rounded-xl bg-slate-50 space-y-2 text-2xs">
                    <div>
                      <span className="text-slate-400 font-medium block">Rekomendasi Bahan Kain:</span>
                      <strong className="text-slate-800 line-clamp-1">
                        {item.bahan_rekomendasi || 'Nagata Drill Japan / American 1919'}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-slate-500 pt-1">
                      <span>Standar Mesin:</span>
                      <strong className="text-slate-800">Bordir Tajima / Juki Industri</strong>
                    </div>

                    <div className="flex items-center justify-between text-slate-500">
                      <span>Jaminan Mutu:</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircleOutlinedIcon sx={{ fontSize: 12 }} />
                        QC Lolos Toleransi
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 flex items-center gap-2">
                <Link
                  to={`/layanan/${item.id}`}
                  className="flex-1"
                >
                  <Button variant="outline" size="sm" className="w-full justify-center font-bold text-slate-700">
                    Detail Spek
                  </Button>
                </Link>
                <Link
                  to={`/pesan?kategori=${encodeURIComponent(item.nama_layanan)}`}
                  className="flex-1"
                >
                  <Button variant="accent" size="sm" className="w-full justify-center font-bold">
                    Pesan
                    <ArrowForwardOutlinedIcon sx={{ fontSize: 13, ml: 0.5 }} />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MATERIAL SWATCH STRIP: PANDUAN BAHAN BAKU RESMI */}
      <div
        className="mb-14 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8"
        data-ui="fabric-guide"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6">
          <div>
            <div className="text-xs font-bold text-amber-600 font-display">
              STANDARISASI MATERIAL WORKSHOP
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-950 font-display mt-0.5">
              Panduan Karakteristik Kain Seragam Resmi
            </h3>
          </div>
          <span className="text-2xs text-slate-500">
            Tersedia buku katalog sampel fisik asli untuk pengadaan kantor &amp; dinas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FABRIC_SWATCHES.map((fabric) => (
            <div
              key={fabric.nama}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-slate-900 font-display">
                  {fabric.nama}
                </h4>
                <span className="text-3xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 shrink-0">
                  {fabric.komposisi}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {fabric.karakter}
              </p>
              <div className="pt-1 text-2xs text-slate-500">
                <span className="font-semibold text-slate-700 block">
                  Aplikasi Terbaik:
                </span>
                <span>{fabric.aplikasi}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. BESPOKE CUSTOM PROCUREMENT BANNER */}
      <section className="bg-slate-950 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
        <div className="space-y-2">
          <div className="text-xs font-bold text-amber-400 font-display">
            LAYANAN DESAIN KHUSUS
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
            Punya Model Desain Khusus di Luar Katalog?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Kami menerima pengerjaan seragam berpola custom instansi, rompi lapangan taktikal ber-reflektor 3M, jaket bolak-balik (reversible), dan aplikasi bordir timbul 3D.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
          <Link to="/pesan" className="w-full sm:w-auto">
            <Button variant="accent" size="lg" className="w-full sm:w-auto font-bold px-6">
              Formulir Pesanan Online
            </Button>
          </Link>
          <a
            href="https://wa.me/6281234567890?text=Halo%20CV%20Ristrich%20Garment,%20saya%20ingin%20konsultasi%20model%20seragam%20custom"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
          >
            <WhatsAppIcon sx={{ fontSize: 16 }} />
            <span>Konsultasi WhatsApp</span>
          </a>
        </div>
      </section>
    </MainLayout>
  );
}
