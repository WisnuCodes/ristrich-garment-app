import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

export function Spinner({ size = 24, className = '', label = 'Memuat data...' }) {
  return (
    <div className={`inline-flex items-center justify-center gap-2 text-slate-500 ${className}`}>
      <CircularProgress size={size} color="inherit" />
      {label && <span className="text-xs font-medium text-slate-500">{label}</span>}
    </div>
  );
}

export default Spinner;
