import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { usePortofolio } from '../../hooks/usePortofolio';
import Spinner from '../atoms/Spinner';

const CATEGORIES = ['Semua', 'Kemeja', 'Kaos', 'Polo Shirt', 'Jaket', 'Rompi', 'Jersey'];

export function PortfolioGrid({ initialCategory = 'Semua', showFilters = true, limit = null }) {
  const { items, loading, error, category, setCategory } = usePortofolio(initialCategory);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const displayedItems = limit ? items.slice(0, limit) : items;

  return (
    <div className="space-y-8" data-ui="portfolio-grid">
      {/* Category Pills */}
      {showFilters && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`text-xs font-semibold px-4 py-2 rounded-xl transition-colors ${
                category === cat
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center" data-ui="loading-state">
          <Spinner size={32} label="Memuat galeri portofolio..." />
        </div>
      ) : error ? (
        <div data-ui="feedback-state" className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs text-center">
          {error}
        </div>
      ) : displayedItems.length === 0 ? (
        <div data-ui="feedback-state" className="py-16 text-center text-slate-400 text-sm">
          Belum ada portofolio pada kategori ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedItems.map((item) => (
            <div
              key={item.id}
              data-ui="portfolio-card" className="group bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:border-slate-300 transition-colors flex flex-col justify-between"
            >
              {/* Image Container */}
              <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                <img
                  src={item.gambar_url}
                  alt={item.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3">
                  <span className="text-2xs font-bold px-2.5 py-1 rounded-md bg-white text-slate-900">
                    {item.kategori}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="text-2xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white tabular-nums">
                    {item.jumlah_produksi} pcs
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <Link to={`/portofolio/${item.id}`}>
                    <h4 className="text-sm font-bold text-slate-900 tracking-tight group-hover:text-amber-600 transition-colors font-display">
                      {item.judul}
                    </h4>
                  </Link>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                    {item.deskripsi_singkat}
                  </p>
                </div>

                <div className="mt-4 pt-3 flex items-center justify-between text-2xs" data-ui="card-footer">
                  <button
                    type="button"
                    onClick={() => setSelectedPhoto(item)}
                    className="flex items-center gap-1 text-slate-500 hover:text-slate-800 font-medium transition-colors"
                  >
                    <VisibilityOutlinedIcon sx={{ fontSize: 13 }} />
                    <span>Perbesar</span>
                  </button>

                  <Link
                    to={`/portofolio/${item.id}`}
                    className="font-bold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Detail Spek</span>
                    <ArrowForwardOutlinedIcon sx={{ fontSize: 12 }} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Preview */}
      <Dialog
        open={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: '16px', overflow: 'hidden' } }}
      >
        {selectedPhoto && (
          <DialogContent sx={{ p: 0, position: 'relative', bgcolor: '#0f172a' }}>
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-colors"
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </button>
            <div className="max-h-[80vh] overflow-hidden flex items-center justify-center">
              <img
                src={selectedPhoto.gambar_url}
                alt={selectedPhoto.judul}
                className="w-full h-auto max-h-[75vh] object-contain"
              />
            </div>
            <div className="p-6 bg-slate-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-amber-400 text-2xs font-bold block mb-1">
                  Kategori: {selectedPhoto.kategori} • {selectedPhoto.jumlah_produksi} pcs
                </span>
                <h3 className="text-base font-bold font-display">{selectedPhoto.judul}</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">{selectedPhoto.deskripsi_singkat}</p>
              </div>
              <Link to={`/portofolio/${selectedPhoto.id}`} className="shrink-0">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors"
                >
                  Buka Halaman Detail
                </button>
              </Link>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
export default PortfolioGrid;
