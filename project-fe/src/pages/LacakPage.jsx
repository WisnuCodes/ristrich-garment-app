import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '../components/templates/MainLayout';
import SearchResiInput from '../components/molecules/SearchResiInput';
import TrackingTimeline from '../components/organisms/TrackingTimeline';
import Spinner from '../components/atoms/Spinner';
import { useTracking } from '../hooks/useTracking';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SensorsIcon from '@mui/icons-material/Sensors';

export default function LacakPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryResi = searchParams.get('resi');
  const { loading, data, error, trackOrder, searchedResi, wsConnected, liveNotification } = useTracking();

  useEffect(() => {
    if (queryResi && queryResi.trim()) {
      trackOrder(queryResi.trim());
    }
  }, [queryResi, trackOrder]);

  const handleSearch = (resi) => {
    setSearchParams({ resi: resi.trim() });
    trackOrder(resi.trim());
  };

  return (
    <MainLayout activePage="/lacak">
      {/* Header */}
      <section className="max-w-2xl mx-auto text-center mb-8">
        <div data-ui="header-badge" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-2xs font-bold mb-2">
          <LocalShippingOutlinedIcon sx={{ fontSize: 15 }} />
          <span>Pelacakan Resi Publik CV Ristrich</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight font-display">
          Lacak Status Produksi Pesanan
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          Pantau proses pemotongan kain, bordir komputer, penjahitan, hingga quality control pesanan konveksi Anda secara transparan dan realtime.
        </p>

        {/* Search Bar */}
        <div className="mt-6 max-w-lg mx-auto">
          <SearchResiInput
            onSearch={handleSearch}
            defaultValue={queryResi || ''}
            className="shadow-xs"
          />
        </div>

        {/* Live Reverb Status Banner */}
        {searchedResi && (
          <div className="mt-4 flex items-center justify-center gap-2 text-2xs text-slate-500">
            <SensorsIcon sx={{ fontSize: 14 }} className={wsConnected ? 'text-emerald-600' : 'text-slate-400'} />
            <span>
              Koneksi WebSocket: {wsConnected ? (
                <strong className="text-emerald-700">Aktif (Live Stream Reverb)</strong>
              ) : (
                <span className="text-slate-600">Menyambungkan ke saluran data...</span>
              )}
            </span>
          </div>
        )}
      </section>

      {/* Konten Pelacakan */}
      <section className="max-w-4xl mx-auto mb-16">
        {loading ? (
          <div data-ui="loading-box" className="py-20 flex justify-center bg-white rounded-2xl border border-slate-200">
            <Spinner size={36} label={`Melacak data resi '${searchedResi}' dari server...`} />
          </div>
        ) : error ? (
          <div data-ui="error-box" className="bg-white border border-rose-200 rounded-2xl p-8 text-center shadow-xs">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <HelpOutlineOutlinedIcon sx={{ fontSize: 24 }} />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Data Resi Tidak Ditemukan
            </h3>
            <p className="text-xs text-rose-700 max-w-md mx-auto leading-relaxed">
              {error}
            </p>
            <div data-ui="error-hint" className="mt-4 pt-4 border-t border-slate-100 text-2xs text-slate-500">
              Contoh format nomor resi resmi: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-semibold">RG-2026-0001</code>. Pastikan Anda tidak salah memasukkan angka atau tanda strip.
            </div>
          </div>
        ) : data ? (
          <div className="space-y-6">
            <TrackingTimeline
              data={data}
              wsConnected={wsConnected}
              liveNotification={liveNotification}
            />
          </div>
        ) : (
          <div data-ui="empty-box" className="bg-white rounded-2xl border border-slate-200/90 p-10 text-center text-slate-500 shadow-xs">
            <LocalShippingOutlinedIcon sx={{ fontSize: 44, color: '#cbd5e1', mb: 1 }} />
            <h3 className="text-sm font-bold text-slate-700 mt-2">
              Masukkan Nomor Resi Anda
            </h3>
            <p className="text-2xs text-slate-400 mt-1 max-w-sm mx-auto">
              Nomor resi diterbitkan otomatis saat Anda mengirimkan formulir pemesanan online di portal CV Ristrich Garment.
            </p>
          </div>
        )}
      </section>

      {/* Bantuan CS */}
      <section data-ui="cs-section" className="max-w-4xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h4 className="text-sm font-bold text-slate-900">
            Butuh Bantuan Konfirmasi Resi?
          </h4>
          <p className="text-2xs text-slate-600 mt-0.5">
            Jika status pesanan belum diperbarui atau Anda kehilangan kode resi, hubungi admin layanan pelanggan kami.
          </p>
        </div>
        <a
          href="https://wa.me/6281234567890?text=Halo%20CV%20Ristrich%20Garment,%20saya%20ingin%20menanyakan%20status%20pesanan%20saya"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shrink-0"
        >
          <WhatsAppIcon sx={{ fontSize: 16 }} />
          <span>Chat WhatsApp Admin</span>
        </a>
      </section>
    </MainLayout>
  );
}
