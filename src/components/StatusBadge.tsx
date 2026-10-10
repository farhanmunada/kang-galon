import React from 'react';

interface Props {
  status: 'PENDING' | 'DELIVERING' | 'DELIVERED' | 'CANCELLED' | 'ACTIVE' | 'PAUSED' | string;
}

export default function StatusBadge({ status }: Props) {
  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
  let label = status;

  switch (status) {
    case 'PENDING':
      badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200';
      label = 'Menunggu';
      break;
    case 'DELIVERING':
      badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse';
      label = 'Di Jalan';
      break;
    case 'DELIVERED':
      badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      label = 'Terkirim';
      break;
    case 'CANCELLED':
      badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200';
      label = 'Dibatalkan';
      break;
    case 'ACTIVE':
      badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      label = 'Aktif';
      break;
    case 'PAUSED':
      badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200';
      label = 'Jeda';
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeStyle}`}
    >
      {label}
    </span>
  );
}
