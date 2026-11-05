import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/templates/AdminLayout';
import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';
import Textarea from '../../components/atoms/Textarea';
import Select from '../../components/atoms/Select';
import Spinner from '../../components/atoms/Spinner';
import { catalogService } from '../../services/trackingService';
import PermMediaOutlinedIcon from '@mui/icons-material/PermMediaOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const PORTOFOLIO_CATEGORIES = ['Kemeja', 'Kaos', 'Polo Shirt', 'Jaket', 'Rompi', 'Jersey'];

export default function KontenPage() {
  const [activeTab, setActiveTab] = useState('portofolio'); // 'portofolio' | 'layanan'

  // Data lists
  const [portofolios, setPortofolios] = useState([]);
  const [layanans, setLayanans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals Create
  const [modalPortoOpen, setModalPortoOpen] = useState(false);
  const [modalLayananOpen, setModalLayananOpen] = useState(false);

  // Modals Edit
  const [modalEditPortoOpen, setModalEditPortoOpen] = useState(false);
  const [editingPorto, setEditingPorto] = useState(null);
  const [modalEditLayananOpen, setModalEditLayananOpen] = useState(false);
  const [editingLayanan, setEditingLayanan] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Portofolio Create Form state
  const [portoForm, setPortoForm] = useState({
    judul: '',
    kategori: 'Kemeja',
    klien: '',
    jumlah_produksi: '',
    teknik_identitas: 'Bordir Komputer Tajima',
    bahan_terpakai: '',
    deskripsi_singkat: '',
    gambar: null,
  });

  // Portofolio Edit Form state
  const [editPortoForm, setEditPortoForm] = useState({
    judul: '',
    kategori: 'Kemeja',
    klien: '',
    jumlah_produksi: '',
    teknik_identitas: 'Bordir Komputer Tajima',
    bahan_terpakai: '',
    deskripsi_singkat: '',
    gambar: null,
  });

  // Layanan Create Form state
  const [layananForm, setLayananForm] = useState({
    nama_layanan: '',
    deskripsi: '',
    bahan_rekomendasi: '',
    minimal_order: '24',
    estimasi_hari: '14',
    standar_mesin: 'Bordir Komputer Tajima & Juki Jarum 2',
    toleransi_qc: '±0.5 cm CAD Optitex',
    gambar: null,
  });

  // Layanan Edit Form state
  const [editLayananForm, setEditLayananForm] = useState({
    nama_layanan: '',
    deskripsi: '',
    bahan_rekomendasi: '',
    minimal_order: '24',
    estimasi_hari: '14',
    standar_mesin: 'Bordir Komputer Tajima & Juki Jarum 2',
    toleransi_qc: '±0.5 cm CAD Optitex',
    gambar: null,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'portofolio') {
        const res = await catalogService.getPortofolio();
        setPortofolios(res.data || []);
      } else {
        const res = await catalogService.getLayanan();
        setLayanans(res.data || []);
      }
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat konten katalog.');
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Portofolio Handlers - Create
  const handleCreatePortofolio = async (e) => {
    e.preventDefault();
    if (!portoForm.gambar) {
      alert('Harap pilih foto portofolio.');
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('judul', portoForm.judul);
      fd.append('kategori', portoForm.kategori);
      if (portoForm.klien) fd.append('klien', portoForm.klien);
      fd.append('jumlah_produksi', portoForm.jumlah_produksi || '100');
      if (portoForm.teknik_identitas) fd.append('teknik_identitas', portoForm.teknik_identitas);
      if (portoForm.bahan_terpakai) fd.append('bahan_terpakai', portoForm.bahan_terpakai);
      fd.append('deskripsi_singkat', portoForm.deskripsi_singkat);
      fd.append('gambar', portoForm.gambar);

      await catalogService.createPortofolio(fd);
      setModalPortoOpen(false);
      setPortoForm({
        judul: '',
        kategori: 'Kemeja',
        klien: '',
        jumlah_produksi: '',
        teknik_identitas: 'Bordir Komputer Tajima',
        bahan_terpakai: '',
        deskripsi_singkat: '',
        gambar: null,
      });
      setIsSubmitting(false);
      fetchData();
    } catch (err) {
      setIsSubmitting(false);
      alert(err.response?.data?.message || 'Gagal menambahkan portofolio.');
    }
  };

  // Portofolio Handlers - Edit
  const openEditPorto = (item) => {
    setEditingPorto(item);
    setEditPortoForm({
      judul: item.judul || '',
      kategori: item.kategori || 'Kemeja',
      klien: item.klien || '',
      jumlah_produksi: item.jumlah_produksi || '',
      teknik_identitas: item.teknik_identitas || 'Bordir Komputer Tajima',
      bahan_terpakai: item.bahan_terpakai || '',
      deskripsi_singkat: item.deskripsi_singkat || item.deskripsi || '',
      gambar: null,
    });
    setModalEditPortoOpen(true);
  };

  const handleUpdatePortofolio = async (e) => {
    e.preventDefault();
    if (!editingPorto) return;

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('judul', editPortoForm.judul);
      fd.append('kategori', editPortoForm.kategori);
      if (editPortoForm.klien) fd.append('klien', editPortoForm.klien);
      fd.append('jumlah_produksi', editPortoForm.jumlah_produksi || '100');
      if (editPortoForm.teknik_identitas) fd.append('teknik_identitas', editPortoForm.teknik_identitas);
      if (editPortoForm.bahan_terpakai) fd.append('bahan_terpakai', editPortoForm.bahan_terpakai);
      fd.append('deskripsi_singkat', editPortoForm.deskripsi_singkat);
      if (editPortoForm.gambar) {
        fd.append('gambar', editPortoForm.gambar);
      }
      fd.append('_method', 'PUT');

      await catalogService.updatePortofolio(editingPorto.id, fd);
      setModalEditPortoOpen(false);
      setEditingPorto(null);
      setIsSubmitting(false);
      fetchData();
    } catch (err) {
      setIsSubmitting(false);
      alert(err.response?.data?.message || 'Gagal memperbarui data portofolio.');
    }
  };

  const handleDeletePorto = async (id) => {
    if (!window.confirm('Yakin ingin menghapus portofolio ini dari katalog publik?')) return;
    try {
      await catalogService.deletePortofolio(id);
      fetchData();
    } catch (err) {
      alert('Gagal menghapus portofolio.');
    }
  };

  // Layanan Handlers - Create
  const handleCreateLayanan = async (e) => {
    e.preventDefault();
    if (!layananForm.gambar) {
      alert('Harap pilih gambar banner layanan.');
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('nama_layanan', layananForm.nama_layanan);
      fd.append('deskripsi', layananForm.deskripsi);
      fd.append('bahan_rekomendasi', layananForm.bahan_rekomendasi);
      fd.append('minimal_order', layananForm.minimal_order || '24');
      fd.append('estimasi_hari', layananForm.estimasi_hari || '14');
      if (layananForm.standar_mesin) fd.append('standar_mesin', layananForm.standar_mesin);
      if (layananForm.toleransi_qc) fd.append('toleransi_qc', layananForm.toleransi_qc);
      fd.append('gambar', layananForm.gambar);

      await catalogService.createLayanan(fd);
      setModalLayananOpen(false);
      setLayananForm({
        nama_layanan: '',
        deskripsi: '',
        bahan_rekomendasi: '',
        minimal_order: '24',
        estimasi_hari: '14',
        standar_mesin: 'Bordir Komputer Tajima & Juki Jarum 2',
        toleransi_qc: '±0.5 cm CAD Optitex',
        gambar: null,
      });
      setIsSubmitting(false);
      fetchData();
    } catch (err) {
      setIsSubmitting(false);
      alert(err.response?.data?.message || 'Gagal menambahkan layanan.');
    }
  };

  // Layanan Handlers - Edit
  const openEditLayanan = (item) => {
    setEditingLayanan(item);
    setEditLayananForm({
      nama_layanan: item.nama_layanan || '',
      deskripsi: item.deskripsi || '',
      bahan_rekomendasi: item.bahan_rekomendasi || '',
      minimal_order: String(item.minimal_order || 24),
      estimasi_hari: String(item.estimasi_hari || 14),
      standar_mesin: item.standar_mesin || 'Bordir Komputer Tajima & Juki Jarum 2',
      toleransi_qc: item.toleransi_qc || '±0.5 cm CAD Optitex',
      gambar: null,
    });
    setModalEditLayananOpen(true);
  };

  const handleUpdateLayanan = async (e) => {
    e.preventDefault();
    if (!editingLayanan) return;

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('nama_layanan', editLayananForm.nama_layanan);
      fd.append('deskripsi', editLayananForm.deskripsi);
      fd.append('bahan_rekomendasi', editLayananForm.bahan_rekomendasi);
      fd.append('minimal_order', editLayananForm.minimal_order || '24');
      fd.append('estimasi_hari', editLayananForm.estimasi_hari || '14');
      if (editLayananForm.standar_mesin) fd.append('standar_mesin', editLayananForm.standar_mesin);
      if (editLayananForm.toleransi_qc) fd.append('toleransi_qc', editLayananForm.toleransi_qc);
      if (editLayananForm.gambar) {
        fd.append('gambar', editLayananForm.gambar);
      }
      fd.append('_method', 'PUT');

      await catalogService.updateLayanan(editingLayanan.id, fd);
      setModalEditLayananOpen(false);
      setEditingLayanan(null);
      setIsSubmitting(false);
      fetchData();
    } catch (err) {
      setIsSubmitting(false);
      alert(err.response?.data?.message || 'Gagal memperbarui data layanan.');
    }
  };

  const handleDeleteLayanan = async (id) => {
    if (!window.confirm('Yakin ingin menghapus layanan ini dari katalog publik?')) return;
    try {
      await catalogService.deleteLayanan(id);
      fetchData();
    } catch (err) {
      alert('Gagal menghapus layanan.');
    }
  };

  return (
    <AdminLayout activeTab="konten" title="Manajemen Konten Publik">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-6 gap-4" data-ui="page-header">
        <div>
          <div className="text-2xs font-bold text-amber-700 font-display">
            SISTEM MANAJEMEN KATALOG &amp; DETAIL SPESIFIKASI
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-display mt-0.5">
            Kelola Galeri &amp; Katalog Layanan
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publikasikan dan sesuaikan rincian spesifikasi mesin, toleransi mutu, lead time, dan foto hasil pengerjaan.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {activeTab === 'portofolio' ? (
            <Button
              variant="accent"
              size="sm"
              onClick={() => setModalPortoOpen(true)}
              className="font-bold"
            >
              <AddCircleOutlineOutlinedIcon sx={{ fontSize: 16, mr: 1 }} />
              Tambah Portofolio
            </Button>
          ) : (
            <Button
              variant="accent"
              size="sm"
              onClick={() => setModalLayananOpen(true)}
              className="font-bold"
            >
              <AddCircleOutlineOutlinedIcon sx={{ fontSize: 16, mr: 1 }} />
              Tambah Layanan Baru
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 pb-2" data-ui="tab-group">
        <button
          type="button"
          onClick={() => setActiveTab('portofolio')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'portofolio'
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200/90 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <PermMediaOutlinedIcon sx={{ fontSize: 16 }} />
          <span>Galeri Portofolio ({portofolios.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('layanan')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'layanan'
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200/90 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <LayersOutlinedIcon sx={{ fontSize: 16 }} />
          <span>Katalog Layanan ({layanans.length})</span>
        </button>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="py-24 flex justify-center bg-white rounded-2xl border border-slate-200" data-ui="loading-state">
          <Spinner size={36} label="Memuat data katalog..." />
        </div>
      ) : error ? (
        <div data-ui="feedback-state" className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-2xl text-xs text-center">
          {error}
        </div>
      ) : activeTab === 'portofolio' ? (
        /* Portofolio Tab Content */
        portofolios.length === 0 ? (
          <div data-ui="feedback-state" className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
            <PermMediaOutlinedIcon sx={{ fontSize: 44, color: '#cbd5e1', mb: 1 }} />
            <h3 className="text-sm font-bold text-slate-800 mt-2">Belum Ada Portofolio</h3>
            <p className="text-2xs text-slate-400 mt-1">Tambahkan dokumentasi hasil jahitan pertama Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portofolios.map((item) => (
              <div
                key={item.id}
                data-ui="admin-card"
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="h-44 bg-slate-100 overflow-hidden relative">
                    <img
                      src={item.foto_url || '/images/placeholder-portfolio.jpg'}
                      alt={item.judul}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=600&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute top-2.5 left-2.5 bg-slate-900/90 text-white text-3xs font-semibold px-2 py-0.5 rounded">
                      {item.kategori}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between text-3xs text-amber-700 font-bold">
                      <span className="tabular-nums">{item.jumlah_produksi || 100} pcs produksi</span>
                      {item.klien && <span className="text-slate-500 line-clamp-1">{item.klien}</span>}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1 font-display">
                      {item.judul}
                    </h3>
                    <p className="text-2xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {item.deskripsi_singkat || item.deskripsi}
                    </p>
                    {item.teknik_identitas && (
                      <div className="mt-2 text-2xs text-slate-600 bg-slate-50 p-2 rounded-lg">
                        <span className="text-slate-400 block text-3xs">Aplikasi Identitas:</span>
                        <span className="font-semibold text-slate-800">{item.teknik_identitas}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => openEditPorto(item)}
                    className="gap-1 font-semibold text-slate-700"
                  >
                    <EditOutlinedIcon sx={{ fontSize: 13 }} />
                    <span>Edit Rincian</span>
                  </Button>
                  <Button
                    variant="danger"
                    size="xs"
                    onClick={() => handleDeletePorto(item.id)}
                    className="gap-1 font-semibold"
                  >
                    <DeleteOutlineOutlinedIcon sx={{ fontSize: 13 }} />
                    <span>Hapus</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Layanan Tab Content */
        layanans.length === 0 ? (
          <div data-ui="feedback-state" className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
            <LayersOutlinedIcon sx={{ fontSize: 44, color: '#cbd5e1', mb: 1 }} />
            <h3 className="text-sm font-bold text-slate-800 mt-2">Belum Ada Layanan</h3>
            <p className="text-2xs text-slate-400 mt-1">Tambahkan paket konveksi baru untuk klien Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {layanans.map((item) => (
              <div
                key={item.id}
                data-ui="admin-card"
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="h-44 bg-slate-100 overflow-hidden relative">
                    <img
                      src={item.foto_url || '/images/placeholder-service.jpg'}
                      alt={item.nama_layanan}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute top-2.5 left-2.5 bg-slate-900/90 text-white text-3xs font-semibold px-2.5 py-0.5 rounded tabular-nums">
                      {item.estimasi_hari ? `${item.estimasi_hari} Hari` : '10-14 Hari'}
                    </div>
                    <div className="absolute top-2.5 right-2.5 bg-slate-900/90 text-amber-400 text-3xs font-bold px-2.5 py-0.5 rounded tabular-nums">
                      MOQ {item.minimal_order || 24} Pcs
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-slate-900 font-display">
                      {item.nama_layanan}
                    </h3>
                    <p className="text-2xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {item.deskripsi}
                    </p>
                    <div className="mt-2.5 p-2 rounded-lg bg-slate-50 text-2xs text-slate-600 space-y-1">
                      <div>
                        <span className="text-slate-400 block text-3xs">Kain Rekomendasi:</span>
                        <strong className="text-slate-800 line-clamp-1">{item.bahan_rekomendasi}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-3xs">Standar Mesin:</span>
                        <span className="text-slate-700 font-medium line-clamp-1">{item.standar_mesin || 'Bordir Tajima & Juki Jarum 2'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => openEditLayanan(item)}
                    className="gap-1 font-semibold text-slate-700"
                  >
                    <EditOutlinedIcon sx={{ fontSize: 13 }} />
                    <span>Edit Spesifikasi</span>
                  </Button>
                  <Button
                    variant="danger"
                    size="xs"
                    onClick={() => handleDeleteLayanan(item.id)}
                    className="gap-1 font-semibold"
                  >
                    <DeleteOutlineOutlinedIcon sx={{ fontSize: 13 }} />
                    <span>Hapus</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Modal Tambah Portofolio */}
      <Dialog
        open={modalPortoOpen}
        onClose={() => setModalPortoOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px', padding: '12px' } }}
      >
        <form onSubmit={handleCreatePortofolio}>
          <DialogTitle sx={{ px: 2, py: 1, fontWeight: 800, fontSize: '1.125rem' }}>
            Tambah Portofolio Hasil Produksi
          </DialogTitle>
          <DialogContent sx={{ px: 2, py: 2 }}>
            <div className="space-y-3.5">
              <Input
                label="Judul Portofolio"
                placeholder="Contoh: Kemeja PDH Dinas Perhubungan"
                value={portoForm.judul}
                onChange={(e) => setPortoForm({ ...portoForm, judul: e.target.value })}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  label="Kategori Busana"
                  value={portoForm.kategori}
                  onChange={(e) => setPortoForm({ ...portoForm, kategori: e.target.value })}
                  options={PORTOFOLIO_CATEGORIES}
                />
                <Input
                  label="Nama Klien / Instansi (Opsional)"
                  placeholder="Contoh: Dinas Perhubungan Surakarta"
                  value={portoForm.klien}
                  onChange={(e) => setPortoForm({ ...portoForm, klien: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Jumlah Produksi (Pcs)"
                  type="number"
                  placeholder="Contoh: 250"
                  value={portoForm.jumlah_produksi}
                  onChange={(e) => setPortoForm({ ...portoForm, jumlah_produksi: e.target.value })}
                  required
                />
                <Input
                  label="Aplikasi Identitas Logo"
                  placeholder="Contoh: Bordir Tajima Dada & Punggung"
                  value={portoForm.teknik_identitas}
                  onChange={(e) => setPortoForm({ ...portoForm, teknik_identitas: e.target.value })}
                />
              </div>

              <Input
                label="Bahan Kain Terpakai (Opsional)"
                placeholder="Contoh: Nagata Drill Japan Navy"
                value={portoForm.bahan_terpakai}
                onChange={(e) => setPortoForm({ ...portoForm, bahan_terpakai: e.target.value })}
              />

              <Textarea
                label="Deskripsi Lengkap Pengerjaan"
                placeholder="Sebutkan detail bahan, bordir komputer, atau spesifikasi pengerjaan..."
                value={portoForm.deskripsi_singkat}
                onChange={(e) => setPortoForm({ ...portoForm, deskripsi_singkat: e.target.value })}
                rows={3}
                required
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Foto Produk (Format Gambar, Max 5MB) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPortoForm({ ...portoForm, gambar: e.target.files[0] })}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                  required
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions sx={{ px: 2, pb: 1 }}>
            <Button variant="outline" size="sm" onClick={() => setModalPortoOpen(false)} disabled={isSubmitting}>
              Batal
            </Button>
            <Button type="submit" variant="accent" size="sm" loading={isSubmitting} className="font-bold">
              Simpan Portofolio
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Modal Edit Portofolio */}
      <Dialog
        open={modalEditPortoOpen}
        onClose={() => setModalEditPortoOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px', padding: '12px' } }}
      >
        <form onSubmit={handleUpdatePortofolio}>
          <DialogTitle sx={{ px: 2, py: 1, fontWeight: 800, fontSize: '1.125rem' }}>
            Edit Data Portofolio &amp; Rincian Produksi
          </DialogTitle>
          <DialogContent sx={{ px: 2, py: 2 }}>
            <div className="space-y-3.5">
              <Input
                label="Judul Portofolio"
                placeholder="Contoh: Kemeja PDH Dinas Perhubungan"
                value={editPortoForm.judul}
                onChange={(e) => setEditPortoForm({ ...editPortoForm, judul: e.target.value })}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  label="Kategori Busana"
                  value={editPortoForm.kategori}
                  onChange={(e) => setEditPortoForm({ ...editPortoForm, kategori: e.target.value })}
                  options={PORTOFOLIO_CATEGORIES}
                />
                <Input
                  label="Nama Klien / Instansi"
                  placeholder="Contoh: Dinas Perhubungan Surakarta"
                  value={editPortoForm.klien}
                  onChange={(e) => setEditPortoForm({ ...editPortoForm, klien: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Jumlah Produksi (Pcs)"
                  type="number"
                  placeholder="Contoh: 250"
                  value={editPortoForm.jumlah_produksi}
                  onChange={(e) => setEditPortoForm({ ...editPortoForm, jumlah_produksi: e.target.value })}
                  required
                />
                <Input
                  label="Aplikasi Identitas Logo"
                  placeholder="Contoh: Bordir Tajima Dada & Punggung"
                  value={editPortoForm.teknik_identitas}
                  onChange={(e) => setEditPortoForm({ ...editPortoForm, teknik_identitas: e.target.value })}
                />
              </div>

              <Input
                label="Bahan Kain Terpakai"
                placeholder="Contoh: Nagata Drill Japan Navy"
                value={editPortoForm.bahan_terpakai}
                onChange={(e) => setEditPortoForm({ ...editPortoForm, bahan_terpakai: e.target.value })}
              />

              <Textarea
                label="Deskripsi Lengkap Pengerjaan"
                placeholder="Sebutkan detail bahan, bordir komputer, atau spesifikasi pengerjaan..."
                value={editPortoForm.deskripsi_singkat}
                onChange={(e) => setEditPortoForm({ ...editPortoForm, deskripsi_singkat: e.target.value })}
                rows={3}
                required
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ganti Foto Produk (Opsional, kosongkan jika tidak ingin mengganti)
                </label>
                {editingPorto?.foto_url && (
                  <div className="mb-2 flex items-center gap-2">
                    <img
                      src={editingPorto.foto_url}
                      alt="Thumbnail saat ini"
                      className="w-12 h-12 object-cover rounded-md border border-slate-200"
                    />
                    <span className="text-2xs text-slate-500">Foto saat ini aktif</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditPortoForm({ ...editPortoForm, gambar: e.target.files[0] })}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions sx={{ px: 2, pb: 1 }}>
            <Button variant="outline" size="sm" onClick={() => setModalEditPortoOpen(false)} disabled={isSubmitting}>
              Batal
            </Button>
            <Button type="submit" variant="accent" size="sm" loading={isSubmitting} className="font-bold">
              Simpan Perubahan
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Modal Tambah Layanan */}
      <Dialog
        open={modalLayananOpen}
        onClose={() => setModalLayananOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px', padding: '12px' } }}
      >
        <form onSubmit={handleCreateLayanan}>
          <DialogTitle sx={{ px: 2, py: 1, fontWeight: 800, fontSize: '1.125rem' }}>
            Tambah Layanan Konveksi Baru
          </DialogTitle>
          <DialogContent sx={{ px: 2, py: 2 }}>
            <div className="space-y-3.5">
              <Input
                label="Nama Layanan Busana"
                placeholder="Contoh: Kemeja PDH & PDL Instansi"
                value={layananForm.nama_layanan}
                onChange={(e) => setLayananForm({ ...layananForm, nama_layanan: e.target.value })}
                required
              />

              <Input
                label="Rekomendasi Bahan Kain"
                placeholder="Contoh: Nagata Drill Japan, American Drill 1919, Taipan Tropical"
                value={layananForm.bahan_rekomendasi}
                onChange={(e) => setLayananForm({ ...layananForm, bahan_rekomendasi: e.target.value })}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Minimal Order Quantity (MOQ Pcs)"
                  type="number"
                  placeholder="Contoh: 24"
                  value={layananForm.minimal_order}
                  onChange={(e) => setLayananForm({ ...layananForm, minimal_order: e.target.value })}
                  required
                />
                <Input
                  label="Estimasi Pengerjaan (Hari Kerja)"
                  type="number"
                  placeholder="Contoh: 14"
                  value={layananForm.estimasi_hari}
                  onChange={(e) => setLayananForm({ ...layananForm, estimasi_hari: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Standar Mesin Perakitan"
                  placeholder="Contoh: Bordir Tajima 12-Head & Juki Jarum 2"
                  value={layananForm.standar_mesin}
                  onChange={(e) => setLayananForm({ ...layananForm, standar_mesin: e.target.value })}
                />
                <Input
                  label="Batas Toleransi Mutu QC"
                  placeholder="Contoh: ±0.5 cm CAD Optitex"
                  value={layananForm.toleransi_qc}
                  onChange={(e) => setLayananForm({ ...layananForm, toleransi_qc: e.target.value })}
                />
              </div>

              <Textarea
                label="Deskripsi Lengkap Spesifikasi Layanan"
                placeholder="Spesifikasi jahitan, minimal order, dan keunggulan pengerjaan..."
                value={layananForm.deskripsi}
                onChange={(e) => setLayananForm({ ...layananForm, deskripsi: e.target.value })}
                rows={3}
                required
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Foto Banner Layanan (Format Gambar, Max 5MB) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLayananForm({ ...layananForm, gambar: e.target.files[0] })}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                  required
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions sx={{ px: 2, pb: 1 }}>
            <Button variant="outline" size="sm" onClick={() => setModalLayananOpen(false)} disabled={isSubmitting}>
              Batal
            </Button>
            <Button type="submit" variant="accent" size="sm" loading={isSubmitting} className="font-bold">
              Simpan Layanan
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Modal Edit Layanan */}
      <Dialog
        open={modalEditLayananOpen}
        onClose={() => setModalEditLayananOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px', padding: '12px' } }}
      >
        <form onSubmit={handleUpdateLayanan}>
          <DialogTitle sx={{ px: 2, py: 1, fontWeight: 800, fontSize: '1.125rem' }}>
            Edit Spesifikasi Teknis Layanan Konveksi
          </DialogTitle>
          <DialogContent sx={{ px: 2, py: 2 }}>
            <div className="space-y-3.5">
              <Input
                label="Nama Layanan Busana"
                placeholder="Contoh: Kemeja PDH & PDL Instansi"
                value={editLayananForm.nama_layanan}
                onChange={(e) => setEditLayananForm({ ...editLayananForm, nama_layanan: e.target.value })}
                required
              />

              <Input
                label="Rekomendasi Bahan Kain"
                placeholder="Contoh: Nagata Drill, American Drill 1919, Taipan Tropical"
                value={editLayananForm.bahan_rekomendasi}
                onChange={(e) => setEditLayananForm({ ...editLayananForm, bahan_rekomendasi: e.target.value })}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Minimal Order Quantity (MOQ Pcs)"
                  type="number"
                  placeholder="Contoh: 24"
                  value={editLayananForm.minimal_order}
                  onChange={(e) => setEditLayananForm({ ...editLayananForm, minimal_order: e.target.value })}
                  required
                />
                <Input
                  label="Estimasi Pengerjaan (Hari Kerja)"
                  type="number"
                  placeholder="Contoh: 14"
                  value={editLayananForm.estimasi_hari}
                  onChange={(e) => setEditLayananForm({ ...editLayananForm, estimasi_hari: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Standar Mesin Perakitan"
                  placeholder="Contoh: Bordir Tajima 12-Head & Juki Jarum 2"
                  value={editLayananForm.standar_mesin}
                  onChange={(e) => setEditLayananForm({ ...editLayananForm, standar_mesin: e.target.value })}
                />
                <Input
                  label="Batas Toleransi Mutu QC"
                  placeholder="Contoh: ±0.5 cm CAD Optitex"
                  value={editLayananForm.toleransi_qc}
                  onChange={(e) => setEditLayananForm({ ...editLayananForm, toleransi_qc: e.target.value })}
                />
              </div>

              <Textarea
                label="Deskripsi Lengkap Spesifikasi Layanan"
                placeholder="Spesifikasi jahitan, minimal order, dan keunggulan pengerjaan..."
                value={editLayananForm.deskripsi}
                onChange={(e) => setEditLayananForm({ ...editLayananForm, deskripsi: e.target.value })}
                rows={3}
                required
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ganti Foto Banner (Opsional, kosongkan jika tidak ingin mengganti)
                </label>
                {editingLayanan?.foto_url && (
                  <div className="mb-2 flex items-center gap-2">
                    <img
                      src={editingLayanan.foto_url}
                      alt="Thumbnail banner saat ini"
                      className="w-12 h-12 object-cover rounded-md border border-slate-200"
                    />
                    <span className="text-2xs text-slate-500">Banner saat ini aktif</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditLayananForm({ ...editLayananForm, gambar: e.target.files[0] })}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions sx={{ px: 2, pb: 1 }}>
            <Button variant="outline" size="sm" onClick={() => setModalEditLayananOpen(false)} disabled={isSubmitting}>
              Batal
            </Button>
            <Button type="submit" variant="accent" size="sm" loading={isSubmitting} className="font-bold">
              Simpan Perubahan
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </AdminLayout>
  );
}
