import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl border border-slate-200 p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-slate-800">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <h3 className="text-xl font-extrabold text-[#7c3aed]">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
