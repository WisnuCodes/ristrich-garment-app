import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import StatusBadge from '../molecules/StatusBadge';
import { formatDateIndo } from '../../utils/formatters';

export function TrackingTimeline({ data }) {
  if (!data) return null;

  const isCancelled = data.status_pemesanan === 'Dibatalkan';
  const timeline = data.timeline || [];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xs font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded">
              Kode Resi Pelacakan
            </span>
            <span className="text-xs text-slate-400">
              Update: {formatDateIndo(data.terakhir_diperbarui || data.tanggal_masuk)}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1 font-display">
            {data.kode_resi}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Pemesan: <strong className="text-slate-800">{data.pelanggan_nama}</strong>
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-1.5">
          <StatusBadge status={data.status_pemesanan} className="text-sm px-3.5 py-1.5" />
          <span className="text-xs text-slate-500 font-medium">
            Total Produksi: <strong className="text-slate-900">{data.total_pcs} pcs</strong>
          </span>
        </div>
      </div>

      {/* Box Pembatalan Jika Dibatalkan */}
      {isCancelled && (
        <div className="my-6 p-4 sm:p-5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
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
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
          Progres Alur Pengerjaan Workshop
        </h3>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {timeline.map((stepItem, idx) => {
              const isPast = stepItem.completed && !stepItem.active;
              const isCurrent = stepItem.active;

              return (
                <div
                  key={stepItem.step}
                  className={`relative p-4 rounded-xl border transition-all ${
                    isCancelled
                      ? 'border-slate-200 bg-slate-50 opacity-60'
                      : isCurrent
                      ? 'border-slate-900 bg-slate-50 shadow-xs ring-1 ring-slate-900'
                      : isPast
                      ? 'border-emerald-200 bg-emerald-50/40'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xs font-extrabold uppercase tracking-wider text-slate-500">
                      Tahap 0{stepItem.step}
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
                    isCurrent ? 'text-slate-900 font-extrabold' : isPast ? 'text-slate-900' : 'text-slate-500'
                  }`}>
                    {stepItem.label}
                  </h4>

                  <p className="text-2xs text-slate-500 mt-1.5 leading-relaxed">
                    {stepItem.description}
                  </p>

                  {isCurrent && (
                    <div className="mt-3 inline-block text-3xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-white">
                      Sedang Berjalan
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rincian Spesifikasi & Distribusi Ukuran */}
      <div className="mt-4 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/70 p-5 rounded-xl border border-slate-200/80">
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
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
              <dd className="font-bold text-slate-900 mt-0.5">{formatDateIndo(data.tanggal_masuk)}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
            Distribusi Ukuran (Total: {data.total_pcs} pcs)
          </h4>
          <div className="grid grid-cols-5 gap-2 text-center">
            {Object.entries(data.rincian_ukuran || {}).map(([size, count]) => (
              <div key={size} className="bg-white border border-slate-200 rounded-lg p-2">
                <span className="block text-2xs font-bold text-slate-500">{size}</span>
                <span className="block text-sm font-extrabold text-slate-900 mt-0.5">{count}</span>
              </div>
            ))}
          </div>

          {data.file_desain_url && (
            <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
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

