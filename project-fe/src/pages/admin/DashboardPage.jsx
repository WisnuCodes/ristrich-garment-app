import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/templates/AdminLayout';
import MetricCard from '../../components/molecules/MetricCard';
import StatusBadge from '../../components/molecules/StatusBadge';
import Spinner from '../../components/atoms/Spinner';
import Button from '../../components/atoms/Button';
import { pesananService } from '../../services/pesananService';
import { formatDateIndo } from '../../utils/formatters';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadStats() {
      setLoading(true);
      setError(null);
      try {
        const res = await pesananService.getDashboardStats();
        if (isMounted) {
          setData(res.data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Gagal memuat ringkasan dashboard.');
          setLoading(false);
        }
      }
    }
    loadStats();
    return () => { isMounted = false; };
  }, []);

  return (
    <AdminLayout activeTab="dashboard" title="Ringkasan Operasional Workshop">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-200 gap-4">
        <div>
          <span className="text-3xs uppercase tracking-widest text-amber-700 font-bold">
            Live Production Overview
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-display">
            Dashboard Kontrol Produksi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoring data pesanan masuk, antrean jahit, kapasitas pcs, dan status pengerjaan garmen.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/admin/pesanan">
            <Button variant="accent" size="sm" className="font-bold">
              <ReceiptLongOutlinedIcon sx={{ fontSize: 16, mr: 1 }} />
              Kelola Pesanan Masuk
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <Spinner size={36} label="Mengambil metrik statistik workshop..." />
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-2xl text-xs text-center">
          {error}
        </div>
      ) : data ? (
        <div className="space-y-8">
          {/* Metrik Utama */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Pesanan"
              value={data.metrics?.total_pesanan || 0}
              subtext="Akumulasi seluruh PO terdaftar"
              icon={<ReceiptLongOutlinedIcon sx={{ fontSize: 20 }} />}
            />
            <MetricCard
              title="Pcs Diproduksi"
              value={`${(data.metrics?.total_pcs_produksi || 0).toLocaleString('id-ID')} pcs`}
              subtext="Total busana bukan batal"
              icon={<PrecisionManufacturingOutlinedIcon sx={{ fontSize: 20 }} />}
            />
            <MetricCard
              title="Pesanan Aktif"
              value={data.metrics?.pesanan_aktif || 0}
              subtext="Sedang berjalan di workshop"
              icon={<Inventory2OutlinedIcon sx={{ fontSize: 20 }} />}
            />
            <MetricCard
              title="Pelanggan Terdaftar"
              value={data.metrics?.total_pelanggan || 0}
              subtext="Mitra & instansi terverifikasi"
              icon={<PeopleAltOutlinedIcon sx={{ fontSize: 20 }} />}
            />
          </div>

          {/* Status Breakdown Section */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 font-display">
              Sebaran Status Produksi Pesanan
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(data.status_breakdown || {}).map(([st, count]) => (
                <div key={st} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-3xs uppercase tracking-wider text-slate-400 block font-bold mb-1 truncate">
                    {st}
                  </span>
                  <div className="text-xl font-black text-slate-900 font-mono">
                    {count}
                  </div>
                  <div className="mt-2">
                    <StatusBadge status={st} className="text-3xs" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display">
                  Pesanan Masuk Terbaru
                </h2>
                <p className="text-2xs text-slate-500">6 pesanan konveksi terakhir yang masuk ke sistem.</p>
              </div>
              <Link to="/admin/pesanan" className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1">
                <span>Lihat Semua Pesanan</span>
                <ArrowForwardOutlinedIcon sx={{ fontSize: 14 }} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-3xs font-bold">
                  <tr>
                    <th className="py-3 px-4">Kode Resi</th>
                    <th className="py-3 px-4">Nama Pelanggan</th>
                    <th className="py-3 px-4">Kategori & Bahan</th>
                    <th className="py-3 px-4 text-center">Qty (Pcs)</th>
                    <th className="py-3 px-4">Status Pengerjaan</th>
                    <th className="py-3 px-4 text-right">Tanggal Masuk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(data.recent_orders || []).map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {order.kode_resi}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{order.user?.name || order.pelanggan_nama || 'Pelanggan'}</div>
                        <div className="text-3xs text-slate-400">{order.user?.phone_number || '-'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900">{order.kategori_busana}</div>
                        <div className="text-3xs text-slate-500">{order.jenis_bahan}</div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                        {order.total_pcs}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={order.status_pemesanan} />
                      </td>
                      <td className="py-3 px-4 text-right text-slate-500 text-2xs font-mono">
                        {formatDateIndo(order.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}

