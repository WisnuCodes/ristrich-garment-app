import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../components/templates/MainLayout";
import Button from "../components/atoms/Button";
import SearchResiInput from "../components/molecules/SearchResiInput";
import Spinner from "../components/atoms/Spinner";
import { catalogService } from "../services/trackingService";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
import ContentCutOutlinedIcon from "@mui/icons-material/ContentCutOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

const ESTIMATOR_DATA = {
  "Kemeja PDH & PDL Instansi": {
    fabrics: [
      "Nagata Drill Japan",
      "American Drill 1919",
      "Taipan Tropical",
      "Castillo Drill",
    ],
    basePrice: 95000,
    leadDays: 14,
    technique: "Bordir Komputer Tajima Dada & Punggung",
  },
  "Kaos Oblong & Sablon Distro": {
    fabrics: [
      "Cotton Combed 30s Reaktif",
      "Cotton Combed 24s",
      "Cotton Bamboo 30s",
    ],
    basePrice: 48000,
    leadDays: 10,
    technique: "Sablon Plastisol / Discharge Presisi Curing",
  },
  "Polo Shirt Bordir Komputer": {
    fabrics: ["Lacoste Pique CVC 24s", "Lacoste Katun 100%", "Honeycomb Pique"],
    basePrice: 68000,
    leadDays: 12,
    technique: "Bordir Tajima Dada Kiri & Kerah Rajut",
  },
  "Jaket Bomber, Parka & Hoodie": {
    fabrics: ["Cotton Fleece 300gsm", "Taslan Waterproof Balon", "Baby Terry"],
    basePrice: 125000,
    leadDays: 18,
    technique: "Furing Quilting & Bordir Timbul",
  },
  "Rompi Safety & Wearpack": {
    fabrics: ["Ribstop Tornado", "Drill Heavy Weight", "Parasut Furing Mesh"],
    basePrice: 110000,
    leadDays: 14,
    technique: "Scotchlite Reflector 3M & Bordir K3",
  },
  "Jersey Sublimasi Printing": {
    fabrics: ["Dryfit Milano", "Dryfit Brazil", "Serena Premium"],
    basePrice: 65000,
    leadDays: 10,
    technique: "Full Print Sublimasi Anti-Luntur",
  },
};

const FAQ_LIST = [
  {
    q: "Berapa batas minimal pemesanan (MOQ) seragam di CV Ristrich Garment?",
    a: "Minimal pemesanan standar adalah 24 pcs per desain untuk seragam kemeja, polo shirt, dan kaos. Untuk pemesanan partai besar (di atas 100 pcs), kami memberikan penawaran harga khusus pabrik serta gratis sampel fisik.",
  },
  {
    q: "Apakah bisa dibuatkan sampel fisik (sample approval) sebelum produksi massal?",
    a: "Ya, tentu. Untuk pesanan skala instansi atau perusahaan (100 pcs ke atas), kami membuatkan 1 pcs sampel fisik lengkap dengan bordir, sablon, dan fitting ukuran yang disepakati untuk ditinjau dan disetujui klien sebelum proses pemotongan kain massal dimulai.",
  },
  {
    q: "Bagaimana sistem pembayaran dan apakah mendukung faktur pajak instansi?",
    a: "Kami menerapkan sistem pembayaran bertahap: DP 50% saat kesepakatan PO/SPK dan sisa pelunasan 50% saat seluruh pakaian lolos uji Quality Control dan siap dikirim. CV Ristrich Garment berbadan hukum resmi dengan NIB dan NPWP aktif sehingga dapat menerbitkan Faktur Pajak PPN/PPh, SPK formal, serta kuitansi resmi pengadaan pemerintah atau BUMN.",
  },
  {
    q: "Bagaimana cara melacak perkembangan pengerjaan seragam saya?",
    a: 'Setiap formulir pemesanan yang masuk otomatis menerbitkan kode resi resmi (format RG-YYYY-XXXX). Anda cukup memasukkan kode resi tersebut pada kolom "Lacak Resi" kapan saja untuk memantau 5 tahapan kerja secara langsung: Pesanan Diterima, Antrean Produksi, Potong & Jahit, QC & Finishing, hingga Selesai.',
  },
  {
    q: "Bagaimana jika terdapat cacat jahit atau ketidaksesuaian ukuran saat seragam diterima?",
    a: "Kami memberikan Garansi Retur & Perbaikan Penuh (100% replacement/repair) jika ditemukan cacat jahitan, jahitan lepas, atau selisih ukuran di luar batas toleransi standar garmen yang telah disepakati.",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [portofolioList, setPortofolioList] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Live Estimator State
  const [calcKategori, setCalcKategori] = useState("Kemeja PDH & PDL Instansi");
  const [calcBahan, setCalcBahan] = useState("Nagata Drill Japan");
  const [calcQty, setCalcQty] = useState(50);

  // FAQ Accordion State (default closed)
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const portofolioRes = await catalogService.getPortofolio();
        if (isMounted) {
          setPortofolioList((portofolioRes.data || []).slice(0, 6));
          setLoadingData(false);
        }
      } catch (err) {
        if (isMounted) {
          setLoadingData(false);
        }
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleTrackResi = (resi) => {
    if (!resi || !resi.trim()) return;
    navigate(`/lacak?resi=${encodeURIComponent(resi.trim())}`);
  };

  const handleKategoriChange = (newKat) => {
    setCalcKategori(newKat);
    const data = ESTIMATOR_DATA[newKat];
    if (data && data.fabrics.length > 0) {
      setCalcBahan(data.fabrics[0]);
    }
  };

  const currentEstimator =
    ESTIMATOR_DATA[calcKategori] || ESTIMATOR_DATA["Kemeja PDH & PDL Instansi"];
  // Discount factor based on quantity
  const qtyDiscount =
    calcQty >= 200 ? 0.88 : calcQty >= 100 ? 0.92 : calcQty >= 50 ? 0.96 : 1.0;
  const estimatedUnitPrice = Math.round(
    currentEstimator.basePrice * qtyDiscount,
  );
  const estimatedTotal = estimatedUnitPrice * calcQty;

  return (
    <MainLayout activePage="/" fullWidth={true}>
      {/* 1. HERO SECTION - Full-Bleed Atmospheric Industrial Workshop Canvas */}
      <section className="relative w-full min-h-[calc(100dvh-64px)] lg:h-[calc(100dvh-64px)] flex items-center bg-slate-950 text-white overflow-hidden">
        {/* Full-bleed Atmospheric Workshop Background Photo */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1920&auto=format&fit=crop&q=80"
            alt="Suasana Workshop Garmen CV Ristrich Garment"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-slate-950/80 pointer-events-none" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Proposition Column */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-2.5 text-xs">
                <span className="px-2.5 py-0.5 rounded bg-amber-400/10 text-amber-400 font-bold border border-amber-400/20 font-display">
                  CV RESMI
                </span>
                <span className="text-slate-300 font-medium">
                  Manufaktur Busana Kerja &amp; Bordir Komputer, Surakarta
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-black text-white tracking-tight leading-[1.14] font-display">
                Manufaktur Busana, <br className="hidden sm:inline" />
                <span className="text-amber-400">Skala Industri.</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                Spesialis produksi kemeja kerja PDH/PDL instansi pemerintah,
                polo shirt bordir Tajima Jepang, wearpack lapangan K3, dan
                seragam massal di Surakarta. Kapasitas 10.000 potong per bulan
                dengan sistem pelacakan resi real-time transparan.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link to="/pesan">
                  <Button variant="accent" size="md" className="font-bold px-5">
                    Mulai Order Pakaian
                    <ArrowForwardOutlinedIcon sx={{ fontSize: 16, ml: 1 }} />
                  </Button>
                </Link>
                <Link to="/layanan">
                  <Button
                    variant="secondary"
                    size="md"
                    className="font-semibold px-4 text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700"
                  >
                    Katalog Layanan &amp; Bahan
                  </Button>
                </Link>
                <Link
                  to="/lacak"
                  className="text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1 pl-2"
                >
                  <span>Lacak Resi Terbit</span>
                  <ArrowForwardOutlinedIcon sx={{ fontSize: 13 }} />
                </Link>
              </div>

              {/* Spec Bar (Solid Workshop Metrics) */}
              <div className="pt-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <div className="text-lg sm:text-xl font-black text-white tracking-tight tabular-nums">
                    10.000+
                  </div>
                  <div className="text-2xs text-slate-400 font-medium mt-0.5">
                    Pcs / Bln Kapasitas
                  </div>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <div className="text-lg sm:text-xl font-black text-white tracking-tight tabular-nums">
                    12 Kepala
                  </div>
                  <div className="text-2xs text-slate-400 font-medium mt-0.5">
                    Bordir Tajima Jepang
                  </div>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <div className="text-lg sm:text-xl font-black text-white tracking-tight">
                    CV Resmi
                  </div>
                  <div className="text-2xs text-slate-400 font-medium mt-0.5">
                    NIB &amp; Faktur Pajak
                  </div>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <div className="text-lg sm:text-xl font-black text-white tracking-tight tabular-nums">
                    5 Tahap
                  </div>
                  <div className="text-2xs text-slate-400 font-medium mt-0.5">
                    Kontrol Mutu &amp; Resi
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Production & Resi Tracking Terminal */}
            <div className="lg:col-span-5">
              <div data-ui="tracking-terminal" className="bg-slate-900/85 border border-slate-800 rounded-2xl p-6 sm:p-7 text-white space-y-4">
                <div className="flex items-center justify-between pb-1">
                  <div className="text-xs font-bold text-amber-400">
                    Sistem Pelacakan Pengerjaan
                  </div>
                  <span className="text-2xs text-slate-400 font-medium">
                    Layanan Online 24/7
                  </span>
                </div>

                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-display">
                    Cek Status Pengerjaan Pesanan
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Masukkan nomor resi resmi CV Ristrich Garment untuk memantau
                    tahap potong kain, bordir Tajima, penjahitan, hingga Quality
                    Control.
                  </p>
                </div>

                <div className="pt-1">
                  <SearchResiInput
                    onSearch={handleTrackResi}
                    placeholder="Contoh: RG-2026-8812"
                    dark={true}
                  />
                </div>

                <div className="pt-2 text-2xs text-slate-400 space-y-2">
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircleOutlinedIcon
                      sx={{ fontSize: 16, color: "#10b981" }}
                    />
                    <span>
                      Pelacakan 5 tahapan alur produksi transparan real-time.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircleOutlinedIcon
                      sx={{ fontSize: 16, color: "#10b981" }}
                    />
                    <span>
                      Nomor resi diterbitkan otomatis setelah kesepakatan PO /
                      SPK.
                    </span>
                  </div>
                </div>

                <div className="pt-1">
                  <Link
                    to="/lacak"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    <span>Pelajari Alur 5 Tahap Pengawasan Mutu</span>
                    <ArrowForwardOutlinedIcon sx={{ fontSize: 13 }} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WRAPPER FOR REMAINING SECTIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* 2. ALUR KERJA OPERASIONAL GARMEN (Transparent Manufacturing Pipeline) */}
        <section className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 mb-8 gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-600 font-display">
                <PrecisionManufacturingOutlinedIcon sx={{ fontSize: 16 }} />
                <span>STANDAR OPERASIONAL PRODUKSI • WORKSHOP SURAKARTA</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight mt-1 font-display">
                Alur Manufaktur Transparan, Dari Desain Sampai Resi Terbit.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Setiap pesanan seragam dinas dan busana massal dikerjakan melalui 5 tahapan kendali mutu terintegrasi dengan toleransi ukuran SNI dan sistem lacak resi transparan.
              </p>
            </div>
            <div className="shrink-0">
              <Link to="/layanan">
                <Button variant="outline" size="sm" className="font-bold">
                  Buka Seluruh Katalog &amp; Spesifikasi
                  <ArrowForwardOutlinedIcon sx={{ fontSize: 13, ml: 1 }} />
                </Button>
              </Link>
            </div>
          </div>

          {/* 5-Stage Process Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div
              data-ui="pipeline-step"
              className="bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between pb-3">
                  <span className="text-xs font-bold text-amber-700 font-display">Tahap 1</span>
                  <span className="text-3xs font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700">Tahap Awal</span>
                </div>
                <h3 className="text-sm font-bold text-slate-950 font-display">
                  Konsultasi &amp; Approval Sampel
                </h3>
                <p className="text-2xs text-slate-600 mt-2 leading-relaxed">
                  Penentuan gramasi kain (Nagata/Taipan/Lacoste), kesesuaian fitting ukuran SNI, dan pembuatan 1 pcs sampel fisik untuk persetujuan.
                </p>
              </div>
              <div className="pt-3 mt-4 flex items-center gap-1.5 text-3xs font-semibold text-slate-500">
                <CheckCircleOutlinedIcon sx={{ fontSize: 13, color: '#10b981' }} />
                <span>Free Sampel (100+ Pcs)</span>
              </div>
            </div>

            <div
              data-ui="pipeline-step"
              className="bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between pb-3">
                  <span className="text-xs font-bold text-slate-800 font-display">Tahap 2</span>
                  <span className="text-3xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">Digital Pola</span>
                </div>
                <h3 className="text-sm font-bold text-slate-950 font-display">
                  CAD Optitex &amp; Potong Elektrik
                </h3>
                <p className="text-2xs text-slate-600 mt-2 leading-relaxed">
                  Digitalisasi pola busana dengan akurasi presisi tinggi, kalkulasi efisiensi bentangan kain, dan pemotongan pisau elektrik otomatis.
                </p>
              </div>
              <div className="pt-3 mt-4 flex items-center gap-1.5 text-3xs font-semibold text-slate-500">
                <CheckCircleOutlinedIcon sx={{ fontSize: 13, color: '#10b981' }} />
                <span>Toleransi ±0.5 cm</span>
              </div>
            </div>

            <div
              data-ui="pipeline-step"
              className="bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between pb-3">
                  <span className="text-xs font-bold text-slate-800 font-display">Tahap 3</span>
                  <span className="text-3xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">Bordir &amp; Sablon</span>
                </div>
                <h3 className="text-sm font-bold text-slate-950 font-display">
                  Bordir Tajima 12 Kepala
                </h3>
                <p className="text-2xs text-slate-600 mt-2 leading-relaxed">
                  Penyematan identitas logo instansi memakai mesin Tajima Jepang 12 kepala berkecepatan 1.000 rpm untuk kerapatan benang sempurna.
                </p>
              </div>
              <div className="pt-3 mt-4 flex items-center gap-1.5 text-3xs font-semibold text-slate-500">
                <CheckCircleOutlinedIcon sx={{ fontSize: 13, color: '#10b981' }} />
                <span>1.000 Tusukan / Menit</span>
              </div>
            </div>

            <div
              data-ui="pipeline-step"
              className="bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between pb-3">
                  <span className="text-xs font-bold text-slate-800 font-display">Tahap 4</span>
                  <span className="text-3xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">Perakitan</span>
                </div>
                <h3 className="text-sm font-bold text-slate-950 font-display">
                  Jahit Garmen Juki Jarum 2
                </h3>
                <p className="text-2xs text-slate-600 mt-2 leading-relaxed">
                  Penjahitan garmen berstandar ekspor dengan jahitan rantai pundak, obras 5 benang anti-jebol, dan bartack penguat di titik kritis.
                </p>
              </div>
              <div className="pt-3 mt-4 flex items-center gap-1.5 text-3xs font-semibold text-slate-500">
                <CheckCircleOutlinedIcon sx={{ fontSize: 13, color: '#10b981' }} />
                <span>Juki DDL-9000 Industry</span>
              </div>
            </div>

            <div
              data-ui="pipeline-step"
              className="bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between pb-3">
                  <span className="text-xs font-bold text-emerald-800 font-display">Tahap 5</span>
                  <span className="text-3xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Final QC</span>
                </div>
                <h3 className="text-sm font-bold text-slate-950 font-display">
                  QC 5 Titik &amp; Terbit Resi
                </h3>
                <p className="text-2xs text-slate-600 mt-2 leading-relaxed">
                  Pemeriksaan ukuran dan jahitan, pembersihan sisa benang, setrika uap Stirovap, serta penerbitan nomor resi RG resmi secara real-time.
                </p>
              </div>
              <div className="pt-3 mt-4 flex items-center gap-1.5 text-3xs font-semibold text-slate-500">
                <CheckCircleOutlinedIcon sx={{ fontSize: 13, color: '#10b981' }} />
                <span>Resi Lacak Aktif</span>
              </div>
            </div>
          </div>

          {/* Quick Catalog Access Strip */}
          <div
            data-ui="catalog-banner"
            className="mt-6 bg-slate-50 rounded-2xl p-6 border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <VerifiedUserOutlinedIcon sx={{ fontSize: 20 }} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 font-display">
                  Cari Spesifikasi Kain, Ukuran Size Chart, dan Detail Paket Busana?
                </h4>
                <p className="text-2xs text-slate-500 mt-0.5">
                  Seluruh panduan teknis kemeja PDH, polo shirt, wearpack K3, dan jaket tersedia lengkap di katalog resmi kami.
                </p>
              </div>
            </div>
            <Link to="/layanan" className="shrink-0 w-full sm:w-auto">
              <Button variant="accent" size="sm" className="w-full sm:w-auto font-bold justify-center">
                Buka Katalog Layanan &amp; Bahan
                <ArrowForwardOutlinedIcon sx={{ fontSize: 13, ml: 1 }} />
              </Button>
            </Link>
          </div>
        </section>

        {/* 3. INTERACTIVE FEATURE: KALKULATOR ESTIMASI CEPAT (One Live Thing) */}
        <section className="mb-20 bg-white rounded-3xl border border-slate-200/90 p-7 sm:p-10">
          <div className="max-w-2xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight font-display">
              Kalkulator Estimasi Biaya &amp; Waktu Pengerjaan
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              Hitung perkiraan harga satuan, total biaya pengadaan, dan estimasi
              lama pengerjaan sesuai jumlah pesanan Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Controls */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  1. Pilih Kategori Busana:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.keys(ESTIMATOR_DATA).map((kat) => (
                    <button
                      key={kat}
                      type="button"
                      onClick={() => handleKategoriChange(kat)}
                      className={`p-3 rounded-xl text-left text-xs font-semibold transition-colors ${
                        calcKategori === kat
                          ? "bg-slate-950 text-white font-bold"
                          : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {kat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  2. Rekomendasi Bahan Kain:
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentEstimator.fabrics.map((fab) => (
                    <button
                      key={fab}
                      type="button"
                      onClick={() => setCalcBahan(fab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        calcBahan === fab
                          ? "bg-amber-600 text-white font-bold"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {fab}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800">
                    3. Jumlah Pesanan (Pcs):
                  </label>
                  <span className="text-sm font-black text-slate-900 tabular-nums">
                    {calcQty} Pcs
                  </span>
                </div>
                <input
                  type="range"
                  min="24"
                  max="1000"
                  step="1"
                  value={calcQty}
                  onChange={(e) => setCalcQty(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <div className="flex justify-between text-3xs text-slate-400 mt-1 tabular-nums">
                  <span>MOQ 24 Pcs</span>
                  <span>Partai Besar 100 Pcs+ (Diskon Pabrik)</span>
                  <span>1.000 Pcs</span>
                </div>
              </div>
            </div>

            {/* Result Card */}
            <div className="lg:col-span-5 bg-slate-950 text-white p-6 sm:p-7 rounded-2xl space-y-4">
              <div>
                <span className="text-2xs text-slate-400 font-bold block">
                  Ringkasan Estimasi
                </span>
                <div className="text-lg font-bold text-white mt-1 font-display">
                  {calcKategori}
                </div>
                <div className="text-2xs text-amber-400 mt-0.5">
                  Bahan: {calcBahan}
                </div>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60">
                  <span className="text-slate-400">Estimasi Harga Satuan</span>
                  <span className="font-bold text-white tabular-nums">
                    Rp {estimatedUnitPrice.toLocaleString("id-ID")} / pcs
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60">
                  <span className="text-slate-400">
                    Total Biaya ({calcQty} pcs)
                  </span>
                  <span className="font-black text-amber-400 text-base tabular-nums">
                    Rp {estimatedTotal.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60">
                  <span className="text-slate-400">
                    Estimasi Waktu Pengerjaan
                  </span>
                  <span className="font-bold text-white">
                    {currentEstimator.leadDays} Hari Kerja
                  </span>
                </div>

                <div className="text-2xs text-slate-300 pt-1 leading-relaxed">
                  Pengerjaan:{" "}
                  <strong className="text-white">
                    {currentEstimator.technique}
                  </strong>
                  . Bebas konsultasi ukuran dan gratis 1 pcs sampel fisik untuk
                  pesanan di atas 100 pcs.
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to={`/pesan?kategori=${encodeURIComponent(calcKategori)}`}
                  className="block w-full"
                >
                  <Button
                    variant="accent"
                    size="md"
                    className="w-full justify-center font-bold"
                  >
                    Pesan Spesifikasi Ini Sekarang
                    <ArrowForwardOutlinedIcon sx={{ fontSize: 14, ml: 1 }} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4. WORKSHOP SPECIFICATION SHEET */}
        <section className="mb-20 bg-white rounded-2xl border border-slate-200/90 p-7 sm:p-10">
          <div className="max-w-2xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight font-display">
              Fasilitas Produksi &amp; Standar Mutu
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              Spesifikasi mesin industri dan kepatuhan hukum untuk menjamin
              kualitas jahitan, ketahanan serat kain, dan kelancaran
              administrasi pengadaan instansi.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mesin & Alat Kerja */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-1 font-display">
                Mesin &amp; Peralatan Workshop
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 flex items-start gap-3.5">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-700 shrink-0 mt-0.5">
                    <PrecisionManufacturingOutlinedIcon sx={{ fontSize: 20 }} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">
                      Mesin Bordir Komputer Tajima 12 Kepala (Jepang)
                    </div>
                    <div className="text-slate-600 text-2xs mt-1 leading-relaxed">
                      Presisi tusukan benang hingga 1.000 rpm untuk kerapian
                      logo instansi, lencana, dan nama personil tanpa benang
                      loncat.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 flex items-start gap-3.5">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-700 shrink-0 mt-0.5">
                    <ContentCutOutlinedIcon sx={{ fontSize: 20 }} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">
                      Mesin Jahit Juki DDL-8700 &amp; Obras Pegasus 5 Benang
                    </div>
                    <div className="text-slate-600 text-2xs mt-1 leading-relaxed">
                      Jahitan setik lurus rapat dan overlock obras tepi kain
                      berlapis untuk mencegah jahitan terurai saat pemakaian
                      lapangan.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 flex items-start gap-3.5">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-700 shrink-0 mt-0.5">
                    <WorkspacePremiumOutlinedIcon sx={{ fontSize: 20 }} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">
                      Meja Sablon Rel Presisi &amp; Curing Tunnel Oven
                    </div>
                    <div className="text-slate-600 text-2xs mt-1 leading-relaxed">
                      Tinta sablon plastisol dan rubber berdaya rekat ekspor
                      yang tahan cuci mesin dan tidak mudah retak.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 flex items-start gap-3.5">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-700 shrink-0 mt-0.5">
                    <CheckCircleOutlinedIcon sx={{ fontSize: 20 }} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">
                      Boiler Setrika Uap Industri &amp; Vacuum Table
                    </div>
                    <div className="text-slate-600 text-2xs mt-1 leading-relaxed">
                      Penghilangan kerutan serat kain dengan uap bertekanan
                      sebelum proses lipat dan kemasan akhir.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legalitas & Jaminan Layanan */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-1 font-display">
                Integritas &amp; Jaminan Pengadaan
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 flex items-start gap-3.5">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-700 shrink-0 mt-0.5">
                    <VerifiedUserOutlinedIcon sx={{ fontSize: 20 }} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">
                      Entitas Resmi CV dengan NIB &amp; NPWP Aktif
                    </div>
                    <div className="text-slate-600 text-2xs mt-1 leading-relaxed">
                      Mendukung penerbitan faktur pajak PPN/PPh, SPK formal,
                      kuitansi bermaterai, dan invoice pengadaan instansi
                      pemerintah atau BUMN.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 flex items-start gap-3.5">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-700 shrink-0 mt-0.5">
                    <WorkspacePremiumOutlinedIcon sx={{ fontSize: 20 }} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">
                      Bahan Baku Asli Bersertifikat Pabrik
                    </div>
                    <div className="text-slate-600 text-2xs mt-1 leading-relaxed">
                      Hanya menggunakan bahan rol pabrik resmi (Nagata Drill
                      Japan, American Drill 1919, Cotton Combed 30s Reaktif)
                      bebas luntur.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 flex items-start gap-3.5">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-700 shrink-0 mt-0.5">
                    <FactCheckOutlinedIcon sx={{ fontSize: 20 }} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">
                      Garansi Kesesuaian Sampel (Sample Approval)
                    </div>
                    <div className="text-slate-600 text-2xs mt-1 leading-relaxed">
                      Kami menyediakan sampel ukuran fisik untuk pemesanan
                      partai besar. Garansi perbaikan penuh jika terjadi cacat
                      jahit di luar batas toleransi.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 flex items-start gap-3.5">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-700 shrink-0 mt-0.5">
                    <LocalShippingOutlinedIcon sx={{ fontSize: 20 }} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">
                      Pengiriman Kargo Terpercaya ke Seluruh Indonesia
                    </div>
                    <div className="text-slate-600 text-2xs mt-1 leading-relaxed">
                      Kerjasama dengan kargo darat, laut, dan udara (Baraka,
                      Indah Logistik, Dakota, JNE Trucking) dengan nomor resi
                      terdaftar.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. DOKUMENTASI PORTOFOLIO LIVE (`/api/portofolio`) */}
        <section className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 mb-6 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight font-display">
                Hasil Pengerjaan Klien
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Dokumentasi produksi nyata seragam pesanan instansi, BUMN, dan
                komunitas mitra kami.
              </p>
            </div>
            <Link to="/portofolio">
              <Button variant="outline" size="sm" className="font-semibold">
                Lihat Seluruh Portofolio
              </Button>
            </Link>
          </div>

          {loadingData ? (
            <div className="py-16 flex justify-center bg-white rounded-2xl border border-slate-200">
              <Spinner label="Memuat foto portofolio..." />
            </div>
          ) : portofolioList.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
              Belum ada dokumentasi portofolio yang tersimpan di sistem.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {portofolioList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden"
                >
                  <div className="h-56 bg-slate-100 overflow-hidden relative">
                    <img
                      src={item.foto_url || "/images/placeholder-portfolio.jpg"}
                      alt={item.judul}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=600&auto=format&fit=crop&q=80";
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-slate-900 text-white text-3xs font-semibold px-2.5 py-1 rounded-md">
                      {item.kategori}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-3xs text-slate-400 font-bold mb-1">
                      {item.klien || "Mitra Instansi"}
                    </div>
                    <h3 className="text-sm font-bold text-slate-950 font-display">
                      {item.judul}
                    </h3>
                    <p className="text-2xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {item.deskripsi_singkat || item.deskripsi}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 6. FAQ ACCORDION SECTION (Pertanyaan Umum Pemesanan) */}
        <section className="mb-20 bg-slate-50 rounded-2xl p-7 sm:p-10 border border-slate-200/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Context & Direct Contact */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="text-xs font-bold text-amber-600 font-display">
                  TANYA JAWAB PENGADAAN
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight font-display mt-1 leading-tight">
                  Pertanyaan Umum Seputar Pemesanan.
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Kumpulan jawaban resmi terkait batas minimal pemesanan (MOQ), prosedur sampel fisik, pembayaran faktur pajak, dan garansi jahitan.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-3">
                <div className="text-xs font-bold text-slate-900">
                  Butuh Penawaran Khusus atau SPK Instansi?
                </div>
                <p className="text-2xs text-slate-500 leading-relaxed">
                  Tim administrasi kami siap membantu penerbitan surat penawaran harga resmi, konsultasi jenis kain, dan jadwal fitting ukuran langsung di lokasi instansi Anda.
                </p>
                <a
                  href="https://wa.me/6281234567890?text=Halo%20CV%20Ristrich%20Garment,%20saya%20ingin%20konsultasi%20pengadaan%20seragam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors pt-1"
                >
                  <WhatsAppIcon sx={{ fontSize: 16 }} />
                  <span>Konsultasi Admin WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right Column: Accordion List */}
            <div className="lg:col-span-7 space-y-3">
              {FAQ_LIST.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-xl border transition-colors ${
                      isOpen
                        ? 'bg-white border-slate-300'
                        : 'bg-white border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900"
                    >
                      <span>{faq.q}</span>
                      <div
                        className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-amber-600' : 'text-slate-400'}`}
                      >
                        <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-5 text-xs text-slate-600 leading-relaxed pt-1">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7. BOTTOM CTA BANNER */}
        <section className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
              Siap Memproduksi Seragam Instansi Anda?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Dapatkan konsultasi pemilihan bahan kain, estimasi lead time
              pengerjaan, dan penerbitan penawaran harga resmi hari ini.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <Link to="/pesan" className="w-full sm:w-auto">
              <Button
                variant="accent"
                size="lg"
                className="w-full sm:w-auto font-bold px-6"
              >
                Buat Pesanan Online
              </Button>
            </Link>
            <a
              href="https://wa.me/6281234567890?text=Halo%20CV%20Ristrich%20Garment,%20saya%20ingin%20konsultasi%20pembuatan%20seragam"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
            >
              <WhatsAppIcon sx={{ fontSize: 16 }} />
              <span>Konsultasi WhatsApp</span>
            </a>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
