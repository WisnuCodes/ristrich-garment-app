import { useState, useCallback } from 'react';
import { pesananService } from '../services/pesananService';

export function usePesanan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);

  const submitOrder = async (formData) => {
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const res = await pesananService.createPesanan(formData);
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
        setError(err.response.data.message || 'Harap periksa kembali input formulir Anda.');
      } else {
        setError(err.response?.data?.message || 'Gagal mengirim pesanan. Silakan coba lagi.');
      }
      throw err;
    }
  };

  const fetchRiwayat = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await pesananService.getRiwayat(params);
      setOrders(res.data || []);
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Gagal mengambil riwayat pesanan.');
      throw err;
    }
  }, []);

  const fetchDetail = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await pesananService.getDetail(id);
      setCurrentOrder(res.data);
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Gagal mengambil detail pesanan.');
      throw err;
    }
  }, []);

  return {
    loading,
    error,
    fieldErrors,
    orders,
    currentOrder,
    submitOrder,
    fetchRiwayat,
    fetchDetail,
  };
}
