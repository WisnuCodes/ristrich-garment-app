import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/templates/AdminLayout';
import AdminOrderTable from '../../components/organisms/AdminOrderTable';
import Spinner from '../../components/atoms/Spinner';
import { pesananService } from '../../services/pesananService';

export default function PesananPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await pesananService.getAdminPesanan();
      setOrders(res.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat daftar pesanan.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <AdminLayout activeTab="pesanan" title="Manajemen Pesanan Masuk">
      <div className="pb-6 mb-6 border-b border-slate-200">
        <span className="text-3xs uppercase tracking-widest text-amber-700 font-bold">
          Order Management System
        </span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight font-display">
          Daftar Seluruh Pesanan Konveksi
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Kelola antrean kerja, perbarui tahapan status (potong, jahit, QC, kirim), unduh mockup klien, dan catat pembatalan.
        </p>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center bg-white rounded-2xl border border-slate-200">
          <Spinner size={36} label="Memuat seluruh data pesanan workshop..." />
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-2xl text-xs text-center">
          {error}
        </div>
      ) : (
        <AdminOrderTable orders={orders} onOrderUpdated={fetchOrders} />
      )}
    </AdminLayout>
  );
}

