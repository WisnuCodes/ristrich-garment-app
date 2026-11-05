import React from 'react';
import { Link } from 'react-router-dom';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs mt-24">
      {/* 1. TOP CLOSING STATEMENT & WORKSHOP COLOPHON */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start pb-12">
          {/* Main Statement */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-slate-900 text-amber-400 flex items-center justify-center font-black text-sm border border-slate-800">
                RG
              </div>
              <div>
                <span className="text-base font-black tracking-tight text-white uppercase font-display block leading-tight">
                  CV Ristrich Garment
                </span>
                <span className="text-2xs text-slate-400 font-medium block">
                  Surakarta Apparel &amp; Uniform • Jawa Tengah
                </span>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight font-display leading-snug">
              Manufaktur Busana &amp; Seragam Kerja Skala Industri.
            </h3>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
              Memproduksi kemeja dinas PDH/PDL instansi pemerintah, polo shirt bordir Tajima Jepang, wearpack lapangan K3, dan busana massal berbadan hukum resmi dengan NIB dan NPWP aktif di Surakarta.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-2xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <VerifiedUserOutlinedIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                <span>NIB &amp; Faktur Pajak Resmi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <PrecisionManufacturingOutlinedIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                <span>Kapasitas 10.000 Pcs/Bulan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FactCheckOutlinedIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                <span>Garansi Mutu QC 100%</span>
              </div>
            </div>
          </div>

          {/* Quick Workshop Dispatch & Contact Box */}
          <div data-ui="footer-dispatch" className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 font-display">
                Kontak &amp; Administrasi Workshop
              </span>
              <span className="text-3xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded">
                Senin - Sabtu Buka
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <LocationOnOutlinedIcon sx={{ fontSize: 17 }} className="text-amber-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 leading-relaxed">
                  Jl. Raya Solo - Wonogiri, Sukoharjo / Surakarta, Jawa Tengah 57528
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <PhoneOutlinedIcon sx={{ fontSize: 17 }} className="text-amber-400 shrink-0" />
                <span className="text-slate-300 tabular-nums">Hotline: (0271) 789-2244</span>
              </div>

              <div className="flex items-center gap-2.5">
                <EmailOutlinedIcon sx={{ fontSize: 17 }} className="text-amber-400 shrink-0" />
                <span className="text-slate-300">order@ristrich.com</span>
              </div>

              <div className="flex items-center gap-2.5">
                <AccessTimeOutlinedIcon sx={{ fontSize: 17 }} className="text-amber-400 shrink-0" />
                <span className="text-slate-300">08.00 - 17.00 WIB (Waktu Indonesia Barat)</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/6281234567890?text=Halo%20CV%20Ristrich%20Garment,%20saya%20ingin%20konsultasi%20pembuatan%20seragam"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
              >
                <WhatsAppIcon sx={{ fontSize: 16 }} />
                <span>Konsultasi Cepat via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* 2. THREE-PILLAR NAVIGATION & PROCUREMENT MATRIX */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          {/* Col A: Layanan Produksi */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white font-display">
              Katalog Produksi Garmen
            </h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>
                <Link to="/layanan" className="hover:text-amber-400 transition-colors flex items-center justify-between">
                  <span>Kemeja PDH &amp; PDL Dinas Instansi</span>
                  <ArrowForwardOutlinedIcon sx={{ fontSize: 12, opacity: 0.5 }} />
                </Link>
              </li>
              <li>
                <Link to="/layanan" className="hover:text-amber-400 transition-colors flex items-center justify-between">
                  <span>Polo Shirt Bordir Tajima Jepang</span>
                  <ArrowForwardOutlinedIcon sx={{ fontSize: 12, opacity: 0.5 }} />
                </Link>
              </li>
              <li>
                <Link to="/layanan" className="hover:text-amber-400 transition-colors flex items-center justify-between">
                  <span>Wearpack Lapangan &amp; Rompi Safety K3</span>
                  <ArrowForwardOutlinedIcon sx={{ fontSize: 12, opacity: 0.5 }} />
                </Link>
              </li>
              <li>
                <Link to="/layanan" className="hover:text-amber-400 transition-colors flex items-center justify-between">
                  <span>Jaket Bomber, Parka &amp; Hoodie Korporat</span>
                  <ArrowForwardOutlinedIcon sx={{ fontSize: 12, opacity: 0.5 }} />
                </Link>
              </li>
              <li>
                <Link to="/layanan" className="hover:text-amber-400 transition-colors flex items-center justify-between">
                  <span>Kaos Sablon Distro &amp; Raglan Komunitas</span>
                  <ArrowForwardOutlinedIcon sx={{ fontSize: 12, opacity: 0.5 }} />
                </Link>
              </li>
              <li>
                <Link to="/layanan" className="hover:text-amber-400 transition-colors flex items-center justify-between">
                  <span>Jersey Printing Sublimasi Olahraga</span>
                  <ArrowForwardOutlinedIcon sx={{ fontSize: 12, opacity: 0.5 }} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col B: Layanan Pelanggan & Lacak */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white font-display">
              Akses Sistem &amp; Informasi
            </h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>
                <Link to="/lacak" className="hover:text-amber-400 transition-colors flex items-center justify-between">
                  <span>Pelacakan Nomor Resi Produksi Real-Time</span>
                  <ArrowForwardOutlinedIcon sx={{ fontSize: 12, opacity: 0.5 }} />
                </Link>
              </li>
              <li>
                <Link to="/pesan" className="hover:text-amber-400 transition-colors flex items-center justify-between">
                  <span>Formulir Pemesanan Seragam Online</span>
                  <ArrowForwardOutlinedIcon sx={{ fontSize: 12, opacity: 0.5 }} />
                </Link>
              </li>
              <li>
                <Link to="/portofolio" className="hover:text-amber-400 transition-colors flex items-center justify-between">
                  <span>Dokumentasi Portofolio Instansi &amp; BUMN</span>
                  <ArrowForwardOutlinedIcon sx={{ fontSize: 12, opacity: 0.5 }} />
                </Link>
              </li>
              <li>
                <Link to="/profil" className="hover:text-amber-400 transition-colors flex items-center justify-between">
                  <span>Profil Mesin Bordir &amp; Standar Mutu QC</span>
                  <ArrowForwardOutlinedIcon sx={{ fontSize: 12, opacity: 0.5 }} />
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-amber-400 transition-colors flex items-center justify-between">
                  <span>Portal Masuk Pelanggan &amp; Riwayat PO</span>
                  <ArrowForwardOutlinedIcon sx={{ fontSize: 12, opacity: 0.5 }} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col C: Kepatuhan & Standar Mutu */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white font-display">
              Standar Legalitas &amp; Pengadaan
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400 leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="font-bold text-white text-2xs">Faktur Pajak PPN &amp; PPh Resmi</div>
                <div className="text-3xs text-slate-400 mt-0.5">Mendukung SPK formal, kuitansi bermaterai, dan faktur pajak elektronik untuk instansi pemerintah dan BUMN.</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="font-bold text-white text-2xs">Garansi Retur / Perbaikan 100%</div>
                <div className="text-3xs text-slate-400 mt-0.5">Perbaikan penuh bebas biaya jika terjadi ketidaksesuaian ukuran sampel atau cacat jahitan saat diterima.</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. SIGNATURE COLOPHON BAR */}
        <div className="mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-2xs text-slate-500">
          <p>© {new Date().getFullYear()} CV Ristrich Garment. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex flex-wrap items-center gap-3">
            <span>Surakarta Apparel &amp; Uniform</span>
            <span>•</span>
            <span>Sentra Manufaktur Garmen Jawa Tengah</span>
            <span>•</span>
            <span className="text-slate-400">NIB: 1289000451234</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
