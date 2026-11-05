import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import Button from '../atoms/Button';

export function SearchResiInput({ onSearch, defaultValue = '', loading = false, placeholder = 'Contoh: RG-2026-8812', dark = false }) {
  const [resi, setResi] = useState(defaultValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (resi.trim()) {
      onSearch(resi.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={`relative flex items-center rounded-xl p-1.5 transition-colors ${
          dark
            ? 'bg-slate-950/90 border border-slate-700/80 focus-within:border-amber-400'
            : 'bg-white border border-slate-300 focus-within:border-slate-800'
        }`}
      >
        <div className={`pl-3 pr-2 ${dark ? 'text-slate-400' : 'text-slate-400'}`}>
          <SearchIcon sx={{ fontSize: 18 }} />
        </div>
        <input
          type="text"
          value={resi}
          onChange={(e) => setResi(e.target.value.toUpperCase())}
          placeholder={placeholder}
          className={`w-full bg-transparent text-xs font-semibold focus:outline-none py-2 tabular-nums ${
            dark
              ? 'text-white placeholder:text-slate-500'
              : 'text-slate-900 placeholder:text-slate-400'
          }`}
        />
        {resi && (
          <button
            type="button"
            onClick={() => setResi('')}
            className={`p-1.5 text-xs font-bold transition-colors ${
              dark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Hapus input"
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </button>
        )}
        <Button
          type="submit"
          variant={dark ? 'accent' : 'primary'}
          size="md"
          loading={loading}
          className="shrink-0 rounded-lg px-4 py-2 font-bold"
        >
          Lacak Resi
        </Button>
      </div>
    </form>
  );
}

export default SearchResiInput;
