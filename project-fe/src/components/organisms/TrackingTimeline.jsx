import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import SensorsIcon from '@mui/icons-material/Sensors';
import StatusBadge from '../molecules/StatusBadge';
import { formatDateIndo } from '../../utils/formatters';

export function TrackingTimeline({ data, wsConnected = false, liveNotification = null }) {
  if (!data) return null;

  const isCancelled = data.status_pemesanan === 'Dibatalkan';
  const timeline = data.timeline || [];

  return (
    <div data-ui="tracking-timeline" className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200/90">
      {/* Live WebSocket Notification Toast */}
      {liveNotification && (
        <div data-ui="live-status-toast" className="mb-6 p-4 rounded-xl bg-emerald-50 text-emerald-900 flex items-center justify-between text-xs border border-emerald-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
            <span className="font-medium">
              Pembaruan Terkini: Status produksi menjadi <strong>{liveNotification.status}</strong>
            </span>
          </div>
          <span className="text-emerald-700 text-2xs tabular-nums font-semibold">
            {liveNotification.time} WIB
          </span>
        </div>
      )}

      {/* Header Info */}
      <div data-ui="tracking-header" className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-4 border-b border-slate-200">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-2xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded">
              Kode Resi Pelacakan
            </span>
            <span className="text-xs text-slate-500 tabular-nums">
              Update: {formatDateIndo(data.terakhir_diperbarui || data.tanggal_masuk)}
            </span>

            {/* WebSocket Connection Badge */}
            <div
              data-ui="websocket-status-badge"
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-2xs font-semibold ${
                wsConnected
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              <SensorsIcon sx={{ fontSize: 13 }} className={wsConnected ? 'text-emerald-600' : 'text-slate-400'} />
              <span>{wsConnected ? 'Live WebSocket Aktif' : 'Menghubungkan WebSocket...'}</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1 font-display tabular-nums">
            {data.kode_resi}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Pemesan: <strong className="text-slate-800">{data.pelanggan_nama}</strong>
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-1.5">
          <StatusBadge status={data.status_pemesanan} className="text-sm px-3.5 py-1.5" />
          <span className="text-xs text-slate-500 font-medium tabular-nums">
            Total Produksi: <strong className="text-slate-900">{data.total_pcs} pcs</strong>
          </span>
        </div>
      </div>

      {/* Box Pembatalan Jika Dibatalkan */}
      {isCancelled && (
        <div data-ui="cancellation-box" className="my-6 p-4 sm:p-5 rounded-xl bg-rose-50 text-rose-900 flex items-start gap-3 border border-rose-200">
          <WarningAmberIcon className="text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-rose-900">Pesanan Dibatalkan</h4>
            <p className="text-xs text-rose-700 mt-1 leading-relaxed">
              {data.alasan_batal || 'Pesanan dibatalkan oleh pihak konveksi karena kendala ketersediaan bahan baku atau kesepakatan klien.'}
            </p>
          </div>
        </div>
      )}

      {/* Stepper Timeline 5 Tahap */}
      <div className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-slate-800">
            Alur Progres Pengerjaan Workshop
          </h3>
          <span className="text-xs text-slate-500 tabular-nums">
            5 Tahapan Kendali Mutu
          </span>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {timeline.map((stepItem) => {
              const isPast = stepItem.completed && !stepItem.active;
              const isCurrent = stepItem.active;

              return (
                <div
                  key={stepItem.step}
                  data-ui="stepper-card"
                  className={`relative p-4 rounded-xl transition-colors duration-150 border ${
                    isCancelled
                      ? 'border-slate-200 bg-slate-50 opacity-60'
                      : isCurrent
                      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                      : isPast
                      ? 'border-emerald-200 bg-emerald-50/40'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-600 tabular-nums">
                      Tahap {stepItem.step}
                    </span>
                    {isCancelled ? (
                      <RadioButtonUncheckedIcon sx={{ fontSize: 18 }} className="text-slate-400" />
                    ) : isPast ? (
                      <CheckCircleIcon sx={{ fontSize: 18 }} className="text-emerald-600" />
                    ) : isCurrent ? (
                      <RadioButtonCheckedIcon sx={{ fontSize: 18 }} className="text-slate-900" />
                    ) : (
                      <RadioButtonUncheckedIcon sx={{ fontSize: 18 }} className="text-slate-300" />
                    )}
                  </div>

                  <h4 className={`text-sm font-bold ${
                    isCurrent ? 'text-slate-900 font-extrabold' : isPast ? 'text-slate-900' : 'text-slate-600'
                  }`}>
                    {stepItem.label}
                  </h4>

                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {stepItem.description}
                  </p>

                  {isCurrent && (
                    <div className="mt-3 inline-block text-2xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                      Sedang Diproses
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rincian Spesifikasi & Distribusi Ukuran */}
      <div data-ui="specs-grid" className="mt-4 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/80 p-5 rounded-xl border border-slate-200/80">
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3">
            Spesifikasi Busana
          </h4>
          <dl className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <dt className="text-slate-500">Kategori Busana:</dt>
              <dd className="font-bold text-slate-900 mt-0.5">{data.kategori_pakaian}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Jenis Bahan Kain:</dt>
              <dd className="font-bold text-slate-900 mt-0.5">{data.jenis_bahan}</dd>
            </div>
            <div className="mt-2">
              <dt className="text-slate-500">Warna Kain:</dt>
              <dd className="font-bold text-slate-900 mt-0.5">{data.warna_kain}</dd>
            </div>
            <div className="mt-2">
              <dt className="text-slate-500">Tanggal Masuk:</dt>
              <dd className="font-bold text-slate-900 mt-0.5 tabular-nums">{formatDateIndo(data.tanggal_masuk)}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3">
            Distribusi Ukuran ({data.total_pcs} pcs)
          </h4>
          <div className="grid grid-cols-5 gap-2 text-center">
            {Object.entries(data.rincian_ukuran || {}).map(([size, count]) => (
              <div key={size} data-ui="size-pill" className="bg-white rounded-lg p-2 border border-slate-200">
                <span className="block text-2xs font-bold text-slate-500">{size}</span>
                <span className="block text-sm font-extrabold text-slate-900 mt-0.5 tabular-nums">{count}</span>
              </div>
            ))}
          </div>

          {data.file_desain_url && (
            <div data-ui="mockup-link" className="mt-4 pt-3 flex items-center justify-between border-t border-slate-200/80">
              <span className="text-xs text-slate-600">Berkas Desain Mockup:</span>
              <a
                href={data.file_desain_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-amber-600 transition-colors"
              >
                <FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />
                Lihat Berkas
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TrackingTimeline;
