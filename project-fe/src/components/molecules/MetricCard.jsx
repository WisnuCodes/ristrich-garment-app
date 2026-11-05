import React from 'react';

export function MetricCard({
  title,
  value,
  subtext,
  icon,
  trend,
  className = '',
}) {
  return (
    <div className={`bg-white border border-slate-200/90 rounded-xl p-5 hover:border-slate-300 transition-colors ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">
          {title}
        </span>
        {icon && (
          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
          {value}
        </span>
        {trend && (
          <span className="text-xs font-semibold text-emerald-600">
            {trend}
          </span>
        )}
      </div>

      {subtext && (
        <p className="mt-1.5 text-xs text-slate-500">
          {subtext}
        </p>
      )}
    </div>
  );
}

export default MetricCard;
