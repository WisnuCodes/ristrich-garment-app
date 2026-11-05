import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/templates/MainLayout';
import Button from '../components/atoms/Button';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';

export default function ProfilPage() {
  const machineryList = [
    {
      name: 'Mesin Bordir Komputer Tajima (12 Kepala)',
      origin: 'Jepang',
      capacity: 'Presisi tinggi hingga 1.000 jahitan/menit, mendukung benang metalik & gradasi.',
      count: '2 Unit',
    },
    {
      name: 'Mesin Jahit Single Needle Juki DDL-8700',
      origin: 'Jepang',
      capacity: 'Jahitan lurus rapat dan stabil untuk bahan katun, drill, hingga twill tebal.',
      count: '24 Unit',
    },
    {
      name: 'Mesin Obras High-Speed Pegasus 5 Benang',
      origin: 'Jepang',
      capacity: 'Tepi kain terkunci rapi dengan jahitan overlock anti-brodol.',
      count: '8 Unit',
    },
    {
      name: 'Mesin Potong Kain Otomatis (End-Cutter & Vertical Knife)',
      origin: 'Taiwan',
      capacity: 'Pemotongan presisi tumpukan kain hingga tebal 15 cm sesuai pola CAD.',
      count: '3 Unit',
    },
    {
      name: 'Mesin Sablon Presisi & Meja Rel Presisi Ekspor',
      origin: 'Lokal Presisi',
      capacity: 'Sablon plastisol, discharge, rubber dengan curing oven anti-retak.',
      count: '1 Studio (12 Meja)',
    },
    {
      name: 'Steam Station & Boiler Setrika Uap Industri',
      origin: 'Korea',
      capacity: 'Finishing pakaian bebas kerut dengan suhu uap terukur sebelum packing.',
      count: '4 Station',
    },
  ];

  return (
    <MainLayout activePage="/profil">
      {/* Header */}
      <section className="mb-12">
        <div className="max-w-3xl">
          <span className="text-2xs font-extrabold uppercase tracking-widest text-amber-700">
            Profil & Spesifikasi Workshop
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1 font-display">
            CV Ristrich Garment
          </h1>
          <p className="text-sm text-slate-600 mt-3 leading-relaxed">
            Perusahaan manufaktur konveksi busana dan garmen skala industri yang berdedikasi menghadirkan seragam berstandar mutu tinggi, presisi ukuran, dan transparansi proses produksi bagi instansi pemerintah, BUMN, korporasi swasta, dan organisasi di seluruh Indonesia.
          </p>
        </div>
      </section>

      {/* Legalitas & Nilai Inti */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center mb-4">
            <BusinessOutlinedIcon sx={{ fontSize: 20 }} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 uppercase font-display mb-1">
            Entitas Bisnis Resmi
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Berbadan hukum resmi CV dengan NIB dan NPWP lengkap, melayani transaksi formal faktur pajak dan pengadaan barang/jasa instansi.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center mb-4">
            <FactCheckOutlinedIcon sx={{ fontSize: 20 }} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 uppercase font-display mb-1">
            3-Tier Quality Control
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Setiap busana melewati inspeksi pra-potong bahan, verifikasi kerapian bordir/sablon, dan uji kelayakan jahitan akhir sebelum dipacking.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center mb-4">
            <GroupsOutlinedIcon sx={{ fontSize: 20 }} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 uppercase font-display mb-1">
            Penjahit Berpengalaman
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Dikelola oleh lebih dari 35 tenaga terampil ahli pola garmen, operator bordir komputer, dan penjahit busana profesional berpengalaman 10+ tahun.
          </p>
        </div>
      </section>

      {/* Mesin & Fasilitas Workshop */}
      <section className="mb-16">
        <div className="mb-6">
          <span className="text-2xs font-extrabold uppercase tracking-widest text-amber-700">
            Infrastruktur Teknis
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1 font-display">
            Fasilitas Mesin & Peralatan Workshop
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Investasi pada mesin modern guna menjamin efisiensi waktu dan konsistensi kerapian produk.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-3xs font-bold">
                <tr>
                  <th className="py-3 px-4">Nama Fasilitas & Mesin</th>
                  <th className="py-3 px-4">Asal Teknologi</th>
                  <th className="py-3 px-4">Spesifikasi & Kegunaan</th>
                  <th className="py-3 px-4 text-right">Jumlah Unit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {machineryList.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {m.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {m.origin}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-md">
                      {m.capacity}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                      {m.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Kapasitas Produksi Bulanan */}
      <section className="mb-16">
        <div className="mb-6">
          <span className="text-2xs font-extrabold uppercase tracking-widest text-amber-700">
            Volume & Skala Produksi
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1 font-display">
            Estimasi Kapasitas Produksi Per Bulan
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-xs">
            <span className="text-3xs text-slate-400 uppercase tracking-wider block font-medium">Kemeja PDH / PDL</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono mt-2">4.500+</div>
            <span className="text-3xs text-emerald-600 font-semibold mt-1 block">Pcs / Bulan</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-xs">
            <span className="text-3xs text-slate-400 uppercase tracking-wider block font-medium">Kaos Sablon Distro</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono mt-2">12.000+</div>
            <span className="text-3xs text-emerald-600 font-semibold mt-1 block">Pcs / Bulan</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-xs">
            <span className="text-3xs text-slate-400 uppercase tracking-wider block font-medium">Polo Shirt Bordir</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono mt-2">6.000+</div>
            <span className="text-3xs text-emerald-600 font-semibold mt-1 block">Pcs / Bulan</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-xs">
            <span className="text-3xs text-slate-400 uppercase tracking-wider block font-medium">Jaket & Rompi</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono mt-2">3.500+</div>
            <span className="text-3xs text-emerald-600 font-semibold mt-1 block">Pcs / Bulan</span>
          </div>
        </div>
      </section>

      {/* Alamat & Kontak Workshop */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-2xs font-extrabold uppercase tracking-widest text-amber-700">
              Lokasi & Kunjungan Workshop
            </span>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-1 font-display">
              Workshop & Studio Produksi Pusat
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Kami menyambut baik calon mitra instansi dan perusahaan yang ingin melakukan inspeksi langsung, melihat sampel bahan kain, serta memverifikasi alur kerja workshop kami.
            </p>

            <div className="mt-6 space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <LocationOnOutlinedIcon sx={{ fontSize: 18, color: '#f59e0b', mt: 0.2 }} />
                <span>Kawasan Industri Garmen & Tekstil, Jl. Konveksi Mandiri No. 18, Surakarta, Jawa Tengah 57126</span>
              </div>
              <div className="flex items-center gap-3">
                <PhoneOutlinedIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
                <span className="font-mono">+62 812-3456-7890 (Customer Care & Pemesanan)</span>
              </div>
              <div className="flex items-center gap-3">
                <EmailOutlinedIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
                <span className="font-mono">produksi@ristrich.com / halo@ristrich.com</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold mb-3">
              <ContentCutIcon sx={{ fontSize: 24 }} />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Konsultasi Desain & Sampel Bahan</h4>
            <p className="text-2xs text-slate-500 mt-1 max-w-xs">
              Butuh sampel kain fisik atau konsultasi ukuran sebelum memesan partai besar? Tim kami siap mengirimkan katalog swatch kain.
            </p>
            <div className="mt-4">
              <Link to="/pesan">
                <Button variant="accent" size="sm">
                  Mulai Konsultasi Pesanan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

