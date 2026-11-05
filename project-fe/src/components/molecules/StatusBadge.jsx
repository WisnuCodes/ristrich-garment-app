import React from 'react';
import { getStatusTheme } from '../../utils/formatters';

export function StatusBadge({ status, className = '' }) {
  const theme = getStatusTheme(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${theme.bg} ${theme.text} ${theme.border} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} />
      {theme.label}
    </span>
  );
}

export default StatusBadge;
