import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import StraightenIcon from '@mui/icons-material/Straighten';
import { usePesananStore } from '../../stores/pesananStore';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export function SizeCounter({ error, onChange }) {
  const { draftSizes, setSize, incrementSize, decrementSize, totalPcs } = usePesananStore();

  const handleInputChange = (size, val) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setSize(size, num);
    if (onChange) onChange();
  };

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <StraightenIcon className="text-slate-600 text-sm" />
          <span className="text-sm font-bold text-slate-900 tracking-tight">
            Rincian Ukuran Pakaian
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Total:</span>
          <span className="text-xs font-extrabold text-slate-900">{totalPcs} pcs</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {SIZES.map((size) => {
          const qty = draftSizes[size] || 0;
          return (
            <div
              key={size}
              className={`bg-white rounded-lg p-3 border transition-all duration-150 ${
                qty > 0 ? 'border-slate-800 shadow-xs' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-center mb-2">
                <span className="inline-block text-xs font-bold text-slate-700 bg-slate-100 rounded px-2 py-0.5">
                  Size {size}
                </span>
              </div>
              <div className="flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={() => decrementSize(size)}
                  disabled={qty <= 0}
                  className="w-7 h-7 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                  <RemoveIcon sx={{ fontSize: 14 }} />
                </button>

                <input
                  type="number"
                  min="0"
                  value={qty}
                  onChange={(e) => handleInputChange(size, e.target.value)}
                  className="w-12 text-center text-sm font-bold text-slate-900 focus:outline-none py-1 border-b border-transparent focus:border-slate-800"
                />

                <button
                  type="button"
                  onClick={() => incrementSize(size)}
                  className="w-7 h-7 rounded bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center transition-colors shadow-2xs"
                >
                  <AddIcon sx={{ fontSize: 14 }} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {error ? (
        <p className="mt-3 text-xs text-rose-600 font-medium">{error}</p>
      ) : (
        <p className="mt-3 text-xs text-slate-500">
          * Masukkan kuantitas per ukuran sesuai daftar anggota/karyawan. Minimum akumulasi pesanan adalah 1 pcs.
        </p>
      )}
    </div>
  );
}

export default SizeCounter;
