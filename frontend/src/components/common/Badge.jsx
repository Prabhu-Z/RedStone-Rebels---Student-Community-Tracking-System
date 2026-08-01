import React from 'react';

const Badge = ({ children, status }) => {
  const getBadgeStyle = () => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
      case 'ACTIVE':
      case 'VERIFIED':
      case 'PRESENT':
      case 'COMPLETED':
      case 'REGISTERED':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'PENDING':
      case 'UPCOMING':
      case 'ONGOING':
        return 'bg-warmgold-500/20 text-warmgold-400 border-warmgold-500/30';
      case 'REJECTED':
      case 'CANCELLED':
      case 'ABSENT':
      case 'INACTIVE':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-morning-500/20 text-morning-300 border-morning-500/30';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeStyle()}`}>
      {children || status}
    </span>
  );
};

export default Badge;
