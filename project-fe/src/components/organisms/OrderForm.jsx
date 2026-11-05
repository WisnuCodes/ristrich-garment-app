import React, { useState, useRef } from 'react';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import Input from '../atoms/Input';
import Select from '../atoms/Select';
import Textarea from '../atoms/Textarea';
import Button from '../atoms/Button';
import SizeCounter from '../molecules/SizeCounter';
import { usePesananStore } from '../../stores/pesananStore';
import { usePesanan } from '../../hooks/usePesanan';

const KATEGORI_OPTIONS = [
  'Kemeja PDH & PDL Instansi',
  'Kaos Oblong & Sablon Distro',
  'Polo Shirt Bordir Komputer',
  'Jaket Bomber, Parka & Hoodie',
  'Rompi Safety Lapangan & Wearpack',
  'Jersey Printing Sublimasi Custom',
];

const REKOMENDASI_BAHAN = {
  'Kemeja PDH & PDL Instansi': ['American Drill 1919', 'Nagata Drill Japan', 'Taipan Tropical', 'Castillo Drill'],
  'Kaos Oblong & Sablon Distro': ['Cotton Combed 30s Reaktif', 'Cotton Combed 24s', 'Cotton Bamboo 30s', 'Supima Cotton'],
  'Polo Shirt Bordir Komputer': ['Lacoste Pique CVC 24s', 'Lacoste Katun 100%', 'Katun Honeycomb Pique'],
  'Jaket Bomber, Parka & Hoodie': ['Cotton Fleece Tebal 300gsm', 'Taslan Waterproof Balon', 'Baby Terry Premium'],
  'Rompi Safety Lapangan & Wearpack': ['Ribstop Tornado', 'Drill Heavy Weight', 'Parasut Ripstop Furing Mesh'],
  'Jersey Printing Sublimasi Custom': ['Dryfit Milano', 'Dryfit Brazil', 'Serena Premium', 'Waffle Hexagon'],
};

export function OrderForm({ onSuccess, initialKategori = '' }) {
  const fileInputRef = useRef(null);
  const { draftSizes, totalPcs, resetDraft } = usePesananStore();
  const { submitOrder, loading, error, fieldErrors } = usePesanan();

  const [kategori, setKategori] = useState(initialKategori);
  const [jenisBahan, setJenisBahan] = useState(() => {
    const saran = REKOMENDASI_BAHAN[initialKategori];
    return (saran && saran.length > 0) ? saran[0] : '';
  });
  const [warnaKain, setWarnaKain] = useState('');
  const [catatan, setCatatan] = useState('');
  const [fileDesain, setFileDesain] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Update saran bahan saat kategori berubah
  const handleKategoriChange = (val) => {
    setKategori(val);
    const saran = REKOMENDASI_BAHAN[val];
    if (saran && saran.length > 0) {
      setJenisBahan(saran[0]);
    }
  };

  const handleFileChange = (file) => {
    if (!file) return;

    // Check extension
    const allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'zip', 'cdr', 'ai'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !allowedExts.includes(ext)) {
      alert('Format berkas tidak diizinkan. Harap unggah berkas dengan format JPG, PNG, WEBP, PDF, ZIP, CDR, atau AI.');
      return;
    }

    // Check size max 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran berkas melebihi batas maksimal 10 MB.');
      return;
    }

    setFileDesain(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (totalPcs < 1) {
      alert('Silakan masukkan kuantitas pakaian minimal 1 pcs pada bagian rincian ukuran.');
      return;
    }

    if (!fileDesain) {
      alert('Silakan unggah sketsa/mockup desain pakaian Anda (JPG, PNG, PDF, atau ZIP).');
      return;
    }

    const formData = new FormData();
    formData.append('kategori_pakaian', kategori);
    formData.append('jenis_bahan', jenisBahan);
    formData.append('warna_kain', warnaKain);
    formData.append('rincian_ukuran', JSON.stringify(draftSizes));
    formData.append('file_desain', fileDesain);
    if (catatan.trim()) {
      formData.append('catatan_pesanan', catatan.trim());
    }

    try {
      const createdOrder = await submitOrder(formData);
      resetDraft();
      if (onSuccess) {
        onSuccess(createdOrder);
      } else {
        // Redirect ke halaman sukses membawa resi
        window.location.href = `/pages/sukses.html?resi=${createdOrder.kode_resi}`;
      }
    } catch {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Bagian 1: Kategori & Bahan */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900 tracking-tight font-display">
            1. Pilihan Busana & Material Kain
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Tentukan jenis produk konveksi dan spesifikasi kain yang diinginkan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Kategori Pakaian"
            required
            options={KATEGORI_OPTIONS}
            value={kategori}
            onChange={(e) => handleKategoriChange(e.target.value)}
            error={fieldErrors.kategori_pakaian?.[0]}
            placeholder="-- Pilih Jenis Pakaian --"
          />

          <div>
            <Input
              label="Jenis Bahan Kain"
              required
              placeholder="Contoh: American Drill 1919"
              value={jenisBahan}
              onChange={(e) => setJenisBahan(e.target.value)}
              error={fieldErrors.jenis_bahan?.[0]}
            />
            {kategori && REKOMENDASI_BAHAN[kategori] && (
              <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                <span className="text-2xs text-slate-400 font-semibold uppercase">Rekomendasi:</span>
                {REKOMENDASI_BAHAN[kategori].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setJenisBahan(b)}
                    className={`text-2xs px-2 py-0.5 rounded border transition-colors ${
                      jenisBahan === b
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Warna Kain"
            required
            placeholder="Contoh: Navy Blue kombinasi Abu Muda"
            value={warnaKain}
            onChange={(e) => setWarnaKain(e.target.value)}
            error={fieldErrors.warna_kain?.[0]}
            helperText="Sebutkan kode warna spesifik bila ada (contoh: Hitam Reaktif, Putih Tulang)."
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Standar Jahitan & Kerapian
            </label>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
              <CheckCircleOutlineIcon className="text-emerald-600 text-sm" />
              <span>Jahitan stik balik 3 jarum, obras padat, dan steam uap finishing standar ekspor.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian 2: Kuantitas & Rincian Ukuran S-XXL */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900 tracking-tight font-display">
            2. Distribusi Kuantitas per Ukuran
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Gunakan tombol plus/minus atau ketik langsung jumlah pesanan per ukuran tubuh.
          </p>
        </div>

        <SizeCounter error={fieldErrors.rincian_ukuran?.[0]} />
      </div>

      {/* Bagian 3: Unggah Mockup Desain & Catatan */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900 tracking-tight font-display">
            3. Berkas Sketsa / Desain & Instruksi Tambahan
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Unggah file mockup, visual vektor, atau sketsa pakaian untuk dikonfirmasi pola produksinya.
          </p>
        </div>

        {/* Drag and drop upload zone */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            File Desain / Mockup <span className="text-rose-500">*</span>
          </label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-slate-900 bg-slate-50'
                : fileDesain
                ? 'border-emerald-400 bg-emerald-50/20'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf,.zip"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0])}
            />

            {fileDesain ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {filePreview ? (
                  <img
                    src={filePreview}
                    alt="Preview Mockup"
                    className="w-16 h-16 object-cover rounded-lg border border-slate-300 shadow-2xs"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                    <InsertDriveFileOutlinedIcon />
                  </div>
                )}
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900">{fileDesain.name}</p>
                  <p className="text-xs text-slate-500">
                    {(fileDesain.size / 1024 / 1024).toFixed(2)} MB • Berkas Siap Diunggah
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFileDesain(null);
                    setFilePreview(null);
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white"
                >
                  <DeleteOutlineOutlinedIcon />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
                  <CloudUploadOutlinedIcon />
                </div>
                <div className="text-sm text-slate-700">
                  <span className="font-bold text-slate-900 hover:underline">Klik untuk pilih file</span>{' '}
                  atau seret berkas ke area ini
                </div>
                <p className="text-2xs text-slate-500">
                  Format yang didukung: JPG, PNG, PDF, ZIP (Maksimal 10 MB per berkas)
                </p>
              </div>
            )}
          </div>
          {fieldErrors.file_desain && (
            <p className="mt-1.5 text-xs text-rose-600 font-medium">{fieldErrors.file_desain[0]}</p>
          )}
        </div>

        <Textarea
          label="Catatan Khusus / Detail Bordir & Sablon"
          placeholder="Contoh: Bordir logo instansi di dada kiri ukuran 7x7 cm, bendera merah putih di lengan kanan. Kancing baju warna senada kain..."
          rows={3}
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          error={fieldErrors.catatan_pesanan?.[0]}
        />
      </div>

      {/* Ringkasan & Tombol Submit */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div>
          <span className="text-2xs font-extrabold uppercase tracking-widest text-amber-400">
            Ringkasan Konfirmasi Pesanan
          </span>
          <div className="text-xl sm:text-2xl font-black mt-1 font-display tracking-tight">
            {totalPcs} Pcs Busana {kategori ? `(${kategori})` : ''}
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Bahan: <strong className="text-white">{jenisBahan || '-'}</strong> | Warna: <strong className="text-white">{warnaKain || '-'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            type="submit"
            variant="accent"
            size="lg"
            loading={loading}
            className="w-full md:w-auto font-bold px-8 shadow-sm"
          >
            Kirim Pemesanan Sekarang
          </Button>
        </div>
      </div>
    </form>
  );
}

export default OrderForm;

