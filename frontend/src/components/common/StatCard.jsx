import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = 'gold' }) => {
  return (
    <div className="glass-card p-6 rounded-2xl relative overflow-hidden group flex flex-col justify-between h-full">
      <div className="flex items-start justify-between gap-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#D0C5AF] leading-snug">{title}</span>
        {Icon && (
          <div className="p-2.5 rounded-xl bg-[#F2CA50]/10 text-[#F2CA50] border border-[#F2CA50]/20 flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 space-y-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-3xl font-extrabold text-white tracking-tight leading-none">{value}</span>
          {trend && (
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/30">
              {trend}
            </span>
          )}
        </div>

        {subtitle && (
          <p className="text-xs text-[#D0C5AF]/70 truncate">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
