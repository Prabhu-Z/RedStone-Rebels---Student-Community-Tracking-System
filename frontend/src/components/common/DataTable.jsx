import React from 'react';

const DataTable = ({ columns, data, emptyMessage = 'No records found.' }) => {
  return (
    <div className="w-full overflow-x-auto rounded-2xl bg-white border border-slate-200 shadow-sm">
      <table className="w-full text-left text-xs text-slate-800">
        <thead className="bg-slate-50 text-[#7c3aed] font-extrabold uppercase tracking-wider border-b border-slate-200">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="px-6 py-4 font-extrabold">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {data && data.length > 0 ? (
            data.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-purple-50/60 transition-all duration-200">
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-6 py-4 whitespace-nowrap text-slate-800 font-medium">
                    {col.cell ? col.cell(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500 font-medium">
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
