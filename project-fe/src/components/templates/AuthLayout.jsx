import React from 'react';
import { Link } from 'react-router-dom';

export function AuthLayout({ children, title, subtitle, maxWidth = 'max-w-sm', imageSide = true }) {
  return (
    <div className="min-h-[100dvh] lg:h-[100dvh] lg:max-h-[100dvh] lg:overflow-hidden grid grid-cols-1 lg:grid-cols-12 bg-white selection:bg-amber-100 selection:text-amber-900">
      {/* Left Column: Form Panel */}
      <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-between p-6 sm:p-8 lg:px-12 lg:py-7 h-full overflow-y-auto lg:overflow-hidden">
        {/* Brand Header */}
        <div>
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-md bg-slate-950 text-amber-400 flex items-center justify-center font-black text-xs border border-slate-800">
              RG
            </div>
            <div>
              <span className="text-xs font-black tracking-tight text-slate-950 uppercase font-display block leading-tight">
                CV Ristrich Garment
              </span>
              <span className="text-3xs text-slate-500 uppercase tracking-widest block font-medium">
                Portal Pelanggan &amp; Mitra
              </span>
            </div>
          </Link>
        </div>

        {/* Center Content / Form Container */}
        <div className={`w-full ${maxWidth} mx-auto my-auto py-2`}>
          <div className="mb-4">
            <h1 className="text-2xl font-black text-slate-950 tracking-tight font-display">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {children}
        </div>

        {/* Bottom footer note */}
        <div className="text-3xs text-slate-400 text-center sm:text-left pt-2">
          © {new Date().getFullYear()} CV Ristrich Garment. Layanan Konveksi &amp; Tailor Online Surakarta.
        </div>
      </div>

      {/* Right Column: Editorial Visual Showcase */}
      {imageSide && (
        <div className="hidden lg:flex lg:col-span-7 xl:col-span-7 bg-slate-950 text-white relative overflow-hidden flex flex-col justify-between p-10 lg:p-14 h-full">
          {/* Background image overlay */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1600&auto=format&fit=crop&q=80"
              alt="Workshop CV Ristrich Garment"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Top Brand Stamp */}
          <div className="relative z-10">
            <span className="text-3xs font-bold uppercase tracking-widest text-slate-400">
              CV Ristrich Garment • Workshop Manufaktur
            </span>
          </div>

          {/* Center Editorial Showcase */}
          <div className="relative z-10 space-y-5 max-w-lg">
            <h2 className="text-2xl xl:text-3xl font-extrabold tracking-tight leading-tight font-display text-white">
              Kualitas Jahitan Presisi, Kapasitas Produksi Skala Massal.
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Memproduksi kemeja kerja PDH/PDL instansi, polo shirt bordir komputer Tajima, wearpack lapangan, dan kaos sablon massal di Surakarta dengan sistem pelacakan resi pengerjaan transparan.
            </p>

            {/* Spec Sheet 2x2 Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-white text-sm tabular-nums">10.000+ Potong / Bln</div>
                <div className="text-slate-400 text-2xs">Kapasitas Produksi Massal</div>
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-white text-sm tabular-nums">12 Kepala Bordir Tajima</div>
                <div className="text-slate-400 text-2xs">Presisi Tusukan 1.000 rpm</div>
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-white text-sm">Resi RG Transparan</div>
                <div className="text-slate-400 text-2xs">Pantau 5 Tahap Realtime</div>
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-white text-sm">Legalitas Resmi CV</div>
                <div className="text-slate-400 text-2xs">NIB &amp; Faktur Pajak Pemerintah</div>
              </div>
            </div>
          </div>

          {/* Bottom Location Signature */}
          <div className="relative z-10 text-3xs text-slate-500">
            Kawasan Industri Garmen &amp; Tekstil, Surakarta, Jawa Tengah 57126
          </div>
        </div>
      )}
    </div>
  );
}

export default AuthLayout;
