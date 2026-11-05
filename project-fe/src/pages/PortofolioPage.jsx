import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/templates/MainLayout';
import PortfolioGrid from '../components/organisms/PortfolioGrid';
import Button from '../components/atoms/Button';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';

export default function PortofolioPage() {
  return (
    <MainLayout activePage="/portofolio">
      {/* Header */}
      <section className="mb-10 text-center max-w-2xl mx-auto">
        <span className="text-2xs font-extrabold uppercase tracking-widest text-amber-700">
          Dokumentasi Produksi Asli
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1 font-display">
          Galeri Portofolio & Klien
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          Bukti nyata hasil pengerjaan seragam instansi, bordir komputer presisi, dan sablon pakaian pesanan klien CV Ristrich Garment di berbagai daerah.
        </p>
      </section>

      {/* Grid Portofolio */}
      <section className="mb-16">
        <PortfolioGrid initialCategory="Semua" showFilters={true} />
      </section>

      {/* CTA Box */}
      <section className="bg-slate-900 text-white rounded-2xl p-8 text-center max-w-3xl mx-auto" data-ui="cta-box">
        <h3 className="text-xl font-bold font-display">Tertarik Membuat Model Serupa?</h3>
        <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto">
          Konsultasikan model jahitan dan kebutuhan bahan Anda dengan tim spesialis kami sekarang.
        </p>
        <div className="mt-5">
          <Link to="/pesan">
            <Button variant="accent" size="md" className="font-bold">
              Buat Pesanan Custom
              <ArrowForwardOutlinedIcon sx={{ fontSize: 16, ml: 1 }} />
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}

