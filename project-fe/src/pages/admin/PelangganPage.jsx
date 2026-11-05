import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/templates/AdminLayout';
import Spinner from '../../components/atoms/Spinner';
import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';
import StatusBadge from '../../components/molecules/StatusBadge';
import { pesananService } from '../../services/pesananService';
import { formatDateIndo } from '../../utils/formatters';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

export default function PelangganPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Modals state
  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Create state
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
  });

  // Form Edit state
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
  });

  // Customer Detail Modal
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [customerOrders, setCustomerOrders] = useState([]);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await pesananService.getPelanggan({ search });
      setCustomers(res.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat daftar pelanggan.');
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchCustomers();
    }, 300);
    return () => clearTimeout(delay);
  }, [fetchCustomers]);

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await pesananService.createPelanggan(createForm);
      setModalCreateOpen(false);
      setCreateForm({ name: '', email: '', phone_number: '', password: '' });
      setIsSubmitting(false);
      fetchCustomers();
    } catch (err) {
      setIsSubmitting(false);
      alert(err.response?.data?.message || 'Gagal mendaftarkan akun pelanggan.');
    }
  };

  const openEditModal = (cust) => {
    setEditingCustomer(cust);
    setEditForm({
      name: cust.name || '',
      email: cust.email || '',
      phone_number: cust.phone_number || '',
      password: '',
    });
    setModalEditOpen(true);
  };

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    if (!editingCustomer) return;

    setIsSubmitting(true);
    try {
      const payload = { ...editForm };
      if (!payload.password) delete payload.password;

      await pesananService.updatePelanggan(editingCustomer.id, payload);
      setModalEditOpen(false);
      setEditingCustomer(null);
      setIsSubmitting(false);
      fetchCustomers();
    } catch (err) {
      setIsSubmitting(false);
      alert(err.response?.data?.message || 'Gagal memperbarui data pelanggan.');
    }
  };

  const handleDeleteCustomer = async (cust) => {
    if (cust.pemesanan_count > 0) {
      alert(`Pelanggan "${cust.name}" tidak dapat dihapus karena memiliki riwayat ${cust.pemesanan_count} pesanan di workshop.`);
      return;
    }

    if (!window.confirm(`Yakin ingin menghapus akun pelanggan "${cust.name}"?`)) return;

    try {
      await pesananService.deletePelanggan(cust.id);
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus akun pelanggan.');
    }
  };

  const handleOpenDetail = async (cust) => {
    setSelectedCustomer(cust);
    setLoadingDetail(true);
    try {
      const res = await pesananService.getPelangganDetail(cust.id);
      setCustomerOrders(res.data?.pemesanan || []);
      setLoadingDetail(false);
    } catch (err) {
      setLoadingDetail(false);
      setCustomerOrders([]);
    }
  };

  return (
    <AdminLayout activeTab="pelanggan" title="Data Pelanggan & Mitra">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 mb-6 gap-4" data-ui="page-header">
        <div>
          <div className="text-2xs font-bold text-amber-700 font-display">
            DATABASE KEMITRAAN &amp; INSTANSI
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-display mt-0.5">
            Data Pelanggan &amp; Mitra
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Daftar seluruh kontak pelanggan, riwayat akumulasi pemesanan, dan total volume pcs yang diproduksi.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="w-full sm:w-64">
            <Input
              placeholder="Cari nama, email, no HP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-xs"
            />
          </div>
          <Button
            variant="accent"
            size="sm"
            onClick={() => setModalCreateOpen(true)}
            className="w-full sm:w-auto font-bold shrink-0"
          >
            <PersonAddOutlinedIcon sx={{ fontSize: 16, mr: 1 }} />
            Tambah Pelanggan
          </Button>
        </div>
      </div>

      {/* Customer Table */}
      {loading ? (
        <div className="py-24 flex justify-center bg-white rounded-2xl border border-slate-200" data-ui="loading-state">
          <Spinner size={36} label="Memuat database pelanggan..." />
        </div>
      ) : error ? (
        <div data-ui="feedback-state" className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-2xl text-xs text-center">
          {error}
        </div>
      ) : customers.length === 0 ? (
        <div data-ui="feedback-state" className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <PeopleAltOutlinedIcon sx={{ fontSize: 44, color: '#cbd5e1', mb: 1 }} />
          <h3 className="text-sm font-bold text-slate-800 mt-2">
            Tidak Ada Data Pelanggan
          </h3>
          <p className="text-2xs text-slate-400 mt-1">
            Belum ada pelanggan yang terdaftar atau cocok dengan pencarian "{search}".
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden" data-ui="customer-table">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead data-ui="table-head" className="bg-slate-50 border-b border-slate-200 text-slate-500 text-2xs font-bold">
                <tr>
                  <th className="py-3 px-4">Nama Pelanggan</th>
                  <th className="py-3 px-4">Kontak (Email / WhatsApp)</th>
                  <th className="py-3 px-4 text-center">Frekuensi PO</th>
                  <th className="py-3 px-4 text-center">Total Volume (Pcs)</th>
                  <th className="py-3 px-4">Terdaftar Sejak</th>
                  <th className="py-3 px-4 text-right">Aksi Manajemen</th>
                </tr>
              </thead>
              <tbody data-ui="table-body" className="divide-y divide-slate-100">
                {customers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {cust.name}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium">{cust.email}</div>
                      <div className="text-3xs text-slate-500 mt-0.5 tabular-nums">{cust.phone_number || '-'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded tabular-nums">
                        {cust.pemesanan_count || 0} PO
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-amber-700 tabular-nums">
                      {(cust.total_pcs_dipesan || 0).toLocaleString('id-ID')} pcs
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-2xs tabular-nums">
                      {formatDateIndo(cust.created_at)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => handleOpenDetail(cust)}
                          className="gap-1 font-semibold text-slate-700"
                        >
                          <VisibilityOutlinedIcon sx={{ fontSize: 13 }} />
                          <span>Riwayat</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => openEditModal(cust)}
                          className="gap-1 font-semibold text-slate-700"
                        >
                          <EditOutlinedIcon sx={{ fontSize: 13 }} />
                          <span>Edit</span>
                        </Button>
                        <Button
                          variant="danger"
                          size="xs"
                          onClick={() => handleDeleteCustomer(cust)}
                          className="gap-1 font-semibold"
                        >
                          <DeleteOutlineOutlinedIcon sx={{ fontSize: 13 }} />
                          <span>Hapus</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Tambah Pelanggan */}
      <Dialog
        open={modalCreateOpen}
        onClose={() => setModalCreateOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px', padding: '12px' } }}
      >
        <form onSubmit={handleCreateCustomer}>
          <DialogTitle sx={{ px: 2, py: 1, fontWeight: 800, fontSize: '1.125rem' }}>
            Daftarkan Akun Pelanggan Baru
          </DialogTitle>
          <DialogContent sx={{ px: 2, py: 2 }}>
            <div className="space-y-3.5">
              <Input
                label="Nama Lengkap / Instansi"
                placeholder="Contoh: PT Angkasa Pura / Bpk. Heru"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                required
              />
              <Input
                label="Alamat Email Resmi"
                type="email"
                placeholder="Contoh: pengadaan@angkasapura.co.id"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                required
              />
              <Input
                label="Nomor Telepon / WhatsApp"
                placeholder="Contoh: 081234567890"
                value={createForm.phone_number}
                onChange={(e) => setCreateForm({ ...createForm, phone_number: e.target.value })}
                required
              />
              <Input
                label="Kata Sandi Awal (Opsional, Default: password123)"
                type="password"
                placeholder="Minimal 8 karakter"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
              />
            </div>
          </DialogContent>
          <DialogActions sx={{ px: 2, pb: 1 }}>
            <Button variant="outline" size="sm" onClick={() => setModalCreateOpen(false)} disabled={isSubmitting}>
              Batal
            </Button>
            <Button type="submit" variant="accent" size="sm" loading={isSubmitting} className="font-bold">
              Daftarkan Pelanggan
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Modal Edit Pelanggan */}
      <Dialog
        open={modalEditOpen}
        onClose={() => setModalEditOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px', padding: '12px' } }}
      >
        <form onSubmit={handleUpdateCustomer}>
          <DialogTitle sx={{ px: 2, py: 1, fontWeight: 800, fontSize: '1.125rem' }}>
            Edit Data Akun Pelanggan
          </DialogTitle>
          <DialogContent sx={{ px: 2, py: 2 }}>
            <div className="space-y-3.5">
              <Input
                label="Nama Lengkap / Instansi"
                placeholder="Contoh: PT Angkasa Pura"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
              />
              <Input
                label="Alamat Email"
                type="email"
                placeholder="Contoh: pengadaan@angkasapura.co.id"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                required
              />
              <Input
                label="Nomor Telepon / WhatsApp"
                placeholder="Contoh: 081234567890"
                value={editForm.phone_number}
                onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
                required
              />
              <Input
                label="Reset Kata Sandi (Kosongkan jika tidak ingin mengubah)"
                type="password"
                placeholder="Minimal 8 karakter baru"
                value={editForm.password}
                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
              />
            </div>
          </DialogContent>
          <DialogActions sx={{ px: 2, pb: 1 }}>
            <Button variant="outline" size="sm" onClick={() => setModalEditOpen(false)} disabled={isSubmitting}>
              Batal
            </Button>
            <Button type="submit" variant="accent" size="sm" loading={isSubmitting} className="font-bold">
              Simpan Perubahan
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Detail Riwayat Dialog */}
      <Dialog
        open={Boolean(selectedCustomer)}
        onClose={() => setSelectedCustomer(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px', padding: '12px' } }}
      >
        {selectedCustomer && (
          <div>
            <DialogTitle sx={{ px: 2, py: 1, fontWeight: 800, fontSize: '1.125rem' }}>
              Riwayat Pesanan: {selectedCustomer.name}
            </DialogTitle>
            <DialogContent sx={{ px: 2, py: 2 }}>
              <div className="mb-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs flex flex-wrap gap-4 text-slate-700">
                <div>Email: <strong className="text-slate-900">{selectedCustomer.email}</strong></div>
                <div>WhatsApp: <strong className="text-slate-900 tabular-nums">{selectedCustomer.phone_number || '-'}</strong></div>
                <div>Total Pesanan: <strong className="text-slate-900 tabular-nums">{selectedCustomer.pemesanan_count} order</strong></div>
              </div>

              {loadingDetail ? (
                <div className="py-12 flex justify-center">
                  <Spinner size={28} label="Memuat riwayat pemesanan pelanggan..." />
                </div>
              ) : customerOrders.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  Pelanggan ini belum memiliki riwayat pemesanan yang tercatat.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead data-ui="table-head" className="bg-slate-50 border-b border-slate-200 text-slate-500 text-2xs font-bold">
                      <tr>
                        <th className="py-2.5 px-3">Kode Resi</th>
                        <th className="py-2.5 px-3">Kategori</th>
                        <th className="py-2.5 px-3 text-center">Qty (Pcs)</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Tanggal</th>
                      </tr>
                    </thead>
                    <tbody data-ui="table-body" className="divide-y divide-slate-100">
                      {customerOrders.map((ord) => (
                        <tr key={ord.id}>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{ord.kode_resi}</td>
                          <td className="py-2.5 px-3 text-slate-700">{ord.kategori_busana || ord.kategori_pakaian}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-slate-900 tabular-nums">{ord.total_pcs}</td>
                          <td className="py-2.5 px-3"><StatusBadge status={ord.status_pemesanan} className="text-3xs" /></td>
                          <td className="py-2.5 px-3 text-right text-slate-400 text-2xs tabular-nums">{formatDateIndo(ord.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </DialogContent>
            <div className="px-2 pt-2 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedCustomer(null)}>
                Tutup
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </AdminLayout>
  );
}
