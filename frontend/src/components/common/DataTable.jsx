import React from 'react';

const DataTable = ({ columns, data, emptyMessage = 'No records found.' }) => {
  return (
    <div className="w-full overflow-x-auto rounded-2xl glass-card border border-white/10 shadow-xl">
      <table className="w-full text-left text-xs text-[#E2E2E8]">
        <thead className="bg-[#121216] text-[#F2CA50] font-bold uppercase tracking-wider border-b border-[#F2CA50]/20">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="px-6 py-4 font-extrabold">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 bg-black/40">
          {data && data.length > 0 ? (
            data.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-[#F2CA50]/10 transition-all duration-300 group hover:translate-x-0.5">
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-6 py-4 whitespace-nowrap">
                    {col.cell ? col.cell(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-[#D0C5AF]/60 font-medium">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
