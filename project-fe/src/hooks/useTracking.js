import { useState, useCallback } from 'react';
import { trackingService } from '../services/trackingService';

export function useTracking() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [searchedResi, setSearchedResi] = useState('');

  const trackOrder = useCallback(async (kodeResi) => {
    if (!kodeResi || !kodeResi.trim()) {
      setError('Harap masukkan nomor resi pesanan Anda.');
      return;
    }

    const cleanResi = kodeResi.trim().toUpperCase();
    setSearchedResi(cleanResi);
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await trackingService.trackResi(cleanResi);
      setData(res.data);
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      if (err.response?.status === 404) {
        setError(`Nomor resi '${cleanResi}' tidak terdaftar dalam sistem CV Ristrich Garment. Silakan periksa kembali format kode resi Anda.`);
      } else {
        setError(err.response?.data?.message || 'Gagal menghubungi server pelacakan.');
      }
      return null;
    }
  }, []);

  const reset = () => {
    setData(null);
    setError(null);
    setSearchedResi('');
  };

  return {
    loading,
    data,
    error,
    searchedResi,
    trackOrder,
    reset,
  };
}
