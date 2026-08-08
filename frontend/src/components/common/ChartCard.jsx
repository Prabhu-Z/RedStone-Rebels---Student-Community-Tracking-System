import React from 'react';

const ChartCard = ({ title, subtitle, children }) => {
  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 rounded-2xl border border-slate-200 flex flex-col justify-between h-full">
      <div className="mb-4">
        <h3 className="text-lg font-extrabold text-slate-800">{title}</h3>
        {subtitle && <p className="text-xs text-slate-600 mt-0.5 font-sans">{subtitle}</p>}
      </div>
      <div className="w-full min-h-[240px] flex items-center justify-center relative">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
