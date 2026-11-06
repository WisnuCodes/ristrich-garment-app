import { useState, useCallback, useEffect, useRef } from 'react';
import { trackingService } from '../services/trackingService';
import echo from '../services/echo';

export function useTracking() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [searchedResi, setSearchedResi] = useState('');
  const [wsConnected, setWsConnected] = useState(false);
  const [liveNotification, setLiveNotification] = useState(null);
  const activeChannelRef = useRef(null);

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
    setLiveNotification(null);

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

  // Listen to WebSocket channel for real-time order updates
  useEffect(() => {
    if (!searchedResi || !data) return;

    const channelName = `tracking.${searchedResi}`;
    activeChannelRef.current = channelName;

    const pusher = echo.connector?.pusher;
    if (pusher?.connection) {
      const current = pusher.connection.state;
      setWsConnected(current === 'connected');

      const handleStateChange = (states) => {
        setWsConnected(states.current === 'connected');
      };

      pusher.connection.bind('state_change', handleStateChange);
      pusher.connection.bind('connected', () => setWsConnected(true));
      pusher.connection.bind('disconnected', () => setWsConnected(false));
    }

    const channel = echo.channel(channelName);

    const handleUpdate = (payload) => {
      const updatedOrder = payload.data || payload;
      setData((prev) => {
        if (!prev) return updatedOrder;
        return {
          ...prev,
          ...updatedOrder,
          timeline: updatedOrder.timeline || prev.timeline,
        };
      });
      setLiveNotification({
        status: updatedOrder.status_pemesanan,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      });
    };

    channel.listen('OrderStatusUpdated', handleUpdate);
    channel.listen('.OrderStatusUpdated', handleUpdate);

    return () => {
      echo.leaveChannel(channelName);
      activeChannelRef.current = null;
    };
  }, [searchedResi, data?.kode_resi]);

  const reset = () => {
    if (activeChannelRef.current) {
      echo.leaveChannel(activeChannelRef.current);
      activeChannelRef.current = null;
    }
    setData(null);
    setError(null);
    setSearchedResi('');
    setLiveNotification(null);
  };

  return {
    loading,
    data,
    error,
    searchedResi,
    wsConnected,
    liveNotification,
    trackOrder,
    reset,
  };
}
