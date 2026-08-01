import React from 'react';

const LoadingSpinner = ({ label = 'Loading SCTS data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-warmgold-500/20" />
        <div className="absolute inset-0 rounded-full border-2 border-warmgold-500 border-t-transparent animate-spin" />
      </div>
      <p className="text-xs font-serif text-stardustsilver-300/70 tracking-widest uppercase">{label}</p>
    </div>
  );
};

export default LoadingSpinner;
