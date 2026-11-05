import React, { useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import EditNoteIcon from '@mui/icons-material/EditNote';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SearchIcon from '@mui/icons-material/Search';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '../atoms/Button';
import StatusBadge from '../molecules/StatusBadge';
import { formatDateIndo } from '../../utils/formatters';
import { pesananService } from '../../services/pesananService';

const STATUS_LIST = [
  'Semua',
  'Pesanan Diterima',
  'Antrean Produksi',
  'Sedang Dipotong & Dijahit',
  'QC & Finishing',
  'Selesai',
  'Dibatalkan',
];

export function AdminOrderTable({ orders = [], onOrderUpdated }) {
  const [activeStatus, setActiveStatus] = useState('Semua');
  const [search, setSearch] = useState('');

  // Modal Update Status
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [alasanBatal, setAlasanBatal] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Modal Detail
  const [detailOrder, setDetailOrder] = useState(null);

  const filteredOrders = orders.filter((order) => {
    const matchStatus = activeStatus === 'Semua' || order.status_pemesanan === activeStatus;
    const s = search.toLowerCase();
    const matchSearch =
      !s ||
      order.kode_resi?.toLowerCase().includes(s) ||
      order.pelanggan?.name?.toLowerCase().includes(s) ||
      order.kategori_pakaian?.toLowerCase().includes(s) ||
      order.jenis_bahan?.toLowerCase().includes(s);

    return matchStatus && matchSearch;
  });

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status_pemesanan);
    setAlasanBatal(order.alasan_batal || '');
    setModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    if (newStatus === 'Dibatalkan' && !alasanBatal.trim()) {
      alert('Alasan pembatalan wajib diisi minimal 5 karakter jika status diubah menjadi Dibatalkan.');
      return;
    }

    setIsUpdating(true);
    try {
      await pesananService.updateStatus(selectedOrder.id, {
        status_pemesanan: newStatus,
        alasan_batal: newStatus === 'Dibatalkan' ? alasanBatal.trim() : null,
      });

      setModalOpen(false);
      setSelectedOrder(null);
      if (onOrderUpdated) onOrderUpdated();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal memperbarui status pesanan.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteOrder = async (order) => {
    if (!window.confirm(`Yakin ingin menghapus data pesanan #${order.kode_resi}? Tindakan ini tidak dapat dibatalkan.`)) return;
    try {
      await pesananService.deletePesanan(order.id);
      if (onOrderUpdated) onOrderUpdated();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus data pesanan.');
    }
  };

  return (
    <div className="space-y-4" data-ui="admin-order-table">
      {/* Search & Status Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 flex flex-col md:flex-row items-center justify-between gap-4" data-ui="search-filter-card">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {STATUS_LIST.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setActiveStatus(st)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                activeStatus === st
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <SearchIcon className="absolute left-3 top-2.5 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Cari resi, nama, bahan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white"
            data-ui="search-field"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden" data-ui="orders-table-wrapper">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-2xs uppercase tracking-wider text-slate-500 font-bold">
                <th className="py-3 px-4">Resi & Tanggal</th>
                <th className="py-3 px-4">Pelanggan</th>
                <th className="py-3 px-4">Kategori & Bahan</th>
                <th className="py-3 px-4 text-center">Qty (Pcs)</th>
                <th className="py-3 px-4">Status Produksi</th>
                <th className="py-3 px-4 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Tidak ada pesanan masuk yang cocok dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-slate-900 tracking-tight block tabular-nums">
                        {order.kode_resi}
                      </span>
                      <span className="text-2xs text-slate-400 tabular-nums">
                        {formatDateIndo(order.created_at)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 block">
                        {order.pelanggan?.name || 'Pelanggan'}
                      </span>
                      <span className="text-2xs text-slate-500 tabular-nums">
                        {order.pelanggan?.phone_number || order.pelanggan?.email}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block">
                        {order.kategori_pakaian}
                      </span>
                      <span className="text-2xs text-slate-500">
                        {order.jenis_bahan} ({order.warna_kain})
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block bg-slate-100 font-bold px-2 py-0.5 rounded text-slate-800 tabular-nums">
                        {order.total_pcs}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={order.status_pemesanan} />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Download Mockup */}
                        {order.file_desain_url && (
                          <a
                            href={pesananService.getDownloadMockupUrl(order.id)}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="Unduh Berkas Mockup"
                          >
                            <DownloadIcon sx={{ fontSize: 16 }} />
                          </a>
                        )}

                        {/* View Detail */}
                        <button
                          type="button"
                          onClick={() => setDetailOrder(order)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          title="Lihat Detail Rincian"
                        >
                          <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
                        </button>

                        {/* Update Status Button */}
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openStatusModal(order)}
                          startIcon={<EditNoteIcon sx={{ fontSize: 16 }} />}
                          className="py-1 px-2.5 text-xs"
                        >
                          Ubah Status
                        </Button>

                        {/* Delete Order Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteOrder(order)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                          title="Hapus Pesanan"
                        >
                          <DeleteOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ubah Status Produksi */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        PaperProps={{ sx: { borderRadius: '16px', maxWidth: '440px', width: '100%' } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.125rem' }}>
          Perbarui Tahap Produksi
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <div className="space-y-4 pt-2" data-ui="order-modal-body">
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1" data-ui="spec-box">
                <p>Kode Resi: <strong className="text-slate-900 tabular-nums">{selectedOrder.kode_resi}</strong></p>
                <p>Pemesan: <strong>{selectedOrder.pelanggan?.name}</strong> (<span className="tabular-nums">{selectedOrder.total_pcs}</span> pcs)</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Pilih Status Baru
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full rounded-lg p-2.5 text-sm font-semibold bg-slate-50 focus:outline-none focus:bg-white"
                  data-ui="status-select"
                >
                  <option value="Pesanan Diterima">1. Pesanan Diterima</option>
                  <option value="Antrean Produksi">2. Antrean Produksi</option>
                  <option value="Sedang Dipotong & Dijahit">3. Sedang Dipotong & Dijahit</option>
                  <option value="QC & Finishing">4. QC & Finishing</option>
                  <option value="Selesai">5. Selesai (100% Siap Kirim)</option>
                  <option value="Dibatalkan">Dibatalkan (Reject / Batal)</option>
                </select>
              </div>

              {newStatus === 'Dibatalkan' && (
                <div>
                  <label className="block text-xs font-bold text-rose-700 mb-1.5">
                    Alasan Pembatalan <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Contoh: Ketersediaan kain warna tertentu kosong dari pabrik supplier..."
                    value={alasanBatal}
                    onChange={(e) => setAlasanBatal(e.target.value)}
                    className="w-full rounded-lg p-2.5 text-xs text-rose-900 bg-rose-50/70 focus:outline-none"
                    data-ui="cancel-textarea"
                  />
                </div>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button variant="secondary" size="md" onClick={() => setModalOpen(false)}>
            Batal
          </Button>
          <Button variant="primary" size="md" onClick={handleUpdateStatus} loading={isUpdating}>
            Simpan Perubahan
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Detail Pesanan */}
      <Dialog
        open={!!detailOrder}
        onClose={() => setDetailOrder(null)}
        PaperProps={{ sx: { borderRadius: '16px', maxWidth: '520px', width: '100%' } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.125rem' }}>
          Rincian Lengkap Pesanan
        </DialogTitle>
        <DialogContent>
          {detailOrder && (
            <div className="space-y-4 pt-2 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl" data-ui="resi-card">
                <div>
                  <span className="text-2xs text-slate-400 font-bold uppercase">Resi</span>
                  <p className="font-black text-sm text-slate-900 tabular-nums">{detailOrder.kode_resi}</p>
                </div>
                <StatusBadge status={detailOrder.status_pemesanan} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 font-medium">Pemesan:</span>
                  <p className="font-bold text-slate-900">{detailOrder.pelanggan?.name}</p>
                  <p className="text-slate-500 text-2xs">{detailOrder.pelanggan?.phone_number}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Kategori:</span>
                  <p className="font-bold text-slate-900">{detailOrder.kategori_pakaian}</p>
                  <p className="text-slate-500 text-2xs">{detailOrder.jenis_bahan} - {detailOrder.warna_kain}</p>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-medium block mb-1.5">Distribusi Ukuran:</span>
                <div className="grid grid-cols-5 gap-1.5 text-center">
                  {Object.entries(detailOrder.rincian_ukuran || {}).map(([s, c]) => (
                    <div key={s} className="bg-slate-100 rounded p-1.5">
                      <span className="block text-2xs font-bold text-slate-500">{s}</span>
                      <span className="block text-xs font-black text-slate-900">{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {detailOrder.catatan_pesanan && (
                <div>
                  <span className="text-slate-400 font-medium block">Catatan Pesanan:</span>
                  <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-1 italic">
                    "{detailOrder.catatan_pesanan}"
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button variant="secondary" size="md" onClick={() => setDetailOrder(null)}>
            Tutup
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AdminOrderTable;

