import React from 'react';

const ChartCard = ({ title, subtitle, children }) => {
  return (
    <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-between h-full">
      <div className="mb-4">
        <h3 className="text-lg font-extrabold text-[#E2E2E8]">{title}</h3>
        {subtitle && <p className="text-xs text-[#D0C5AF] mt-0.5 font-sans">{subtitle}</p>}
      </div>
      <div className="w-full min-h-[240px] flex items-center justify-center relative">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
