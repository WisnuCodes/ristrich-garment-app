/**
 * Helper pemformat angka, tanggal, dan status untuk CV Ristrich Garment
 */

export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('id-ID').format(num);
}

export function formatDateIndo(dateString) {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function calculateTotalPcs(sizes) {
  if (!sizes || typeof sizes !== 'object') return 0;
  const s = parseInt(sizes.S, 10) || 0;
  const m = parseInt(sizes.M, 10) || 0;
  const l = parseInt(sizes.L, 10) || 0;
  const xl = parseInt(sizes.XL, 10) || 0;
  const xxl = parseInt(sizes.XXL, 10) || 0;
  return s + m + l + xl + xxl;
}

export function getStatusTheme(status) {
  switch (status) {
    case 'Pesanan Diterima':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        dot: 'bg-blue-500',
        label: 'Pesanan Diterima',
      };
    case 'Antrean Produksi':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
        label: 'Antrean Produksi',
      };
    case 'Sedang Dipotong & Dijahit':
      return {
        bg: 'bg-sky-50',
        text: 'text-sky-800',
        border: 'border-sky-200',
        dot: 'bg-sky-600',
        label: 'Potong & Jahit',
      };
    case 'QC & Finishing':
      return {
        bg: 'bg-teal-50',
        text: 'text-teal-800',
        border: 'border-teal-200',
        dot: 'bg-teal-600',
        label: 'QC & Finishing',
      };
    case 'Selesai':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
        label: 'Selesai 100%',
      };
    case 'Dibatalkan':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        dot: 'bg-rose-500',
        label: 'Dibatalkan',
      };
    default:
      return {
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200',
        dot: 'bg-slate-400',
        label: status || 'Pending',
      };
  }
}

