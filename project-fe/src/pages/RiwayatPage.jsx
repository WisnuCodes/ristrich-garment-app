import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../components/templates/MainLayout';
import Button from '../components/atoms/Button';
import Spinner from '../components/atoms/Spinner';
import StatusBadge from '../components/molecules/StatusBadge';
import Input from '../components/atoms/Input';
import { useAuth } from '../hooks/useAuth';
import { usePesanan } from '../hooks/usePesanan';
import { formatDateIndo } from '../utils/formatters';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

export default function RiwayatPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { orders, loading, error, fetchRiwayat } = usePesanan();
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRiwayat();
    }
  }, [isAuthenticated, fetchRiwayat]);

  if (authLoading) {
    return (
      <MainLayout>
        <div className="py-20 flex justify-center">
          <Spinner size={32} label="Memverifikasi autentikasi..." />
        </div>
      </MainLayout>
    );
  }

  const filteredOrders = orders.filter((o) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      o.kode_resi?.toLowerCase().includes(term) ||
      o.kategori_busana?.toLowerCase().includes(term) ||
      o.jenis_bahan?.toLowerCase().includes(term) ||
      o.status_pemesanan?.toLowerCase().includes(term)
    );
  });

  return (
    <MainLayout activePage="/riwayat">
      {/* Header */}
      <section className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-2xs font-extrabold uppercase tracking-widest text-amber-700">
            Portal Pelanggan
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1 font-display">
            Riwayat Pemesanan Busana
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Daftar seluruh pesanan Anda yang terdaftar pada sistem CV Ristrich Garment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/pesan">
            <Button variant="accent" size="sm" className="font-bold">
              <AddCircleOutlineOutlinedIcon sx={{ fontSize: 16, mr: 1 }} />
              Buat Pesanan Baru
            </Button>
          </Link>
        </div>
      </section>

      {/* Filter & Search */}
      <section className="mb-6">
        <div className="max-w-md">
          <Input
            placeholder="Cari berdasarkan kode resi, bahan, atau status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-xs"
          />
        </div>
      </section>

      {/* Orders List / Table */}
      <section className="mb-16">
        {loading ? (
          <div className="py-20 bg-white rounded-2xl border border-slate-200 flex justify-center">
            <Spinner size={32} label="Memuat riwayat pesanan dari server..." />
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-2xl text-xs text-center">
            {error}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 shadow-xs">
            <ListAltOutlinedIcon sx={{ fontSize: 44, color: '#cbd5e1', mb: 1 }} />
            <h3 className="text-sm font-bold text-slate-800 mt-2">
              Belum Ada Riwayat Pesanan
            </h3>
            <p className="text-2xs text-slate-500 mt-1 max-w-sm mx-auto">
              Anda belum melakukan pemesanan konveksi atau tidak ada hasil yang cocok dengan kata kunci pencarian.
            </p>
            <div className="mt-4">
              <Link to="/pesan">
                <Button variant="accent" size="sm">
                  Kirim Pesanan Pertama
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-slate-300 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono font-black text-sm sm:text-base text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                      {order.kode_resi}
                    </span>
                    <StatusBadge status={order.status_pemesanan} />
                    <span className="text-2xs text-slate-400">
                      {formatDateIndo(order.created_at || order.tanggal_masuk)}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-display">
                      {order.kategori_busana}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Bahan: <strong className="text-slate-800">{order.jenis_bahan}</strong> | Warna: <strong className="text-slate-800">{order.warna_kain || '-'}</strong>
                    </p>
                  </div>

                  {/* Size Matrix Breakdown */}
                  {order.rincian_ukuran && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {Object.entries(order.rincian_ukuran).map(([sz, qty]) => {
                        if (!qty || Number(qty) <= 0) return null;
                        return (
                          <span
                            key={sz}
                            className="inline-flex items-center gap-1 text-3xs font-mono bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded text-slate-700"
                          >
                            <span className="font-bold uppercase text-slate-500">{sz}:</span>
                            <span className="font-bold text-slate-900">{qty}</span>
                          </span>
                        );
                      })}
                      <span className="text-3xs font-bold text-slate-900 bg-amber-100 text-amber-900 px-2 py-0.5 rounded ml-1 font-mono">
                        Total {order.total_pcs} pcs
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                    className="gap-1 text-slate-700"
                  >
                    <VisibilityOutlinedIcon sx={{ fontSize: 15 }} />
                    <span>Detail</span>
                  </Button>

                  <Link to={`/lacak?resi=${encodeURIComponent(order.kode_resi)}`}>
                    <Button variant="accent" size="sm" className="gap-1 font-bold">
                      <LocalShippingOutlinedIcon sx={{ fontSize: 15 }} />
                      <span>Lacak Resi</span>
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Detail Dialog */}
      <Dialog
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '16px', padding: '16px' },
        }}
      >
        {selectedOrder && (
          <div>
            <DialogTitle sx={{ px: 2, py: 1, fontWeight: 800, fontSize: '1.125rem' }}>
              Detail Pesanan: {selectedOrder.kode_resi}
            </DialogTitle>
            <DialogContent sx={{ px: 2, py: 2 }}>
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-slate-500">Status Pemesanan</span>
                  <StatusBadge status={selectedOrder.status_pemesanan} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-3xs uppercase tracking-wider text-slate-400 block font-bold">Kategori</span>
                    <span className="font-semibold text-slate-900">{selectedOrder.kategori_busana}</span>
                  </div>
                  <div>
                    <span className="text-3xs uppercase tracking-wider text-slate-400 block font-bold">Bahan Kain</span>
                    <span className="font-semibold text-slate-900">{selectedOrder.jenis_bahan}</span>
                  </div>
                  <div>
                    <span className="text-3xs uppercase tracking-wider text-slate-400 block font-bold">Warna Kain</span>
                    <span className="font-semibold text-slate-900">{selectedOrder.warna_kain || '-'}</span>
                  </div>
                  <div>
                    <span className="text-3xs uppercase tracking-wider text-slate-400 block font-bold">Total Kuantitas</span>
                    <span className="font-mono font-bold text-slate-900">{selectedOrder.total_pcs} pcs</span>
                  </div>
                </div>

                {selectedOrder.catatan_pesanan && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-3xs uppercase tracking-wider text-slate-500 block font-bold mb-1">Catatan Pemesan</span>
                    <p className="text-slate-700 leading-relaxed">{selectedOrder.catatan_pesanan}</p>
                  </div>
                )}

                {selectedOrder.file_desain_url && (
                  <div>
                    <span className="text-3xs uppercase tracking-wider text-slate-400 block font-bold mb-2">Lampiran File Desain</span>
                    <a
                      href={selectedOrder.file_desain_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-amber-800 font-bold hover:underline"
                    >
                      Buka Mockup Desain ({selectedOrder.file_desain?.split('/').pop() || 'File Desain'})
                    </a>
                  </div>
                )}
              </div>
            </DialogContent>
            <div className="px-2 pt-2 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedOrder(null)}>
                Tutup
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </MainLayout>
  );
}

