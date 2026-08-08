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
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
      case 'PENDING':
      case 'UPCOMING':
      case 'ONGOING':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      case 'REJECTED':
      case 'CANCELLED':
      case 'ABSENT':
      case 'INACTIVE':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
      default:
        return 'bg-purple-100 text-purple-800 border-purple-300 font-bold';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeStyle()}`}>
      {children || status}
    </span>
  );
};

export default Badge;
