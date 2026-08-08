import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, trend }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-[#8b5cf6]/40 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between h-full">
      <div className="flex items-start justify-between gap-3">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 leading-snug">{title}</span>
        {Icon && (
          <div className="p-2.5 rounded-xl bg-[#8b5cf6]/10 text-[#7c3aed] border border-[#8b5cf6]/20 flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 space-y-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">{value}</span>
          {trend && (
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
              {trend}
            </span>
          )}
        </div>

        {subtitle && (
          <p className="text-xs text-slate-500 font-medium truncate">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
