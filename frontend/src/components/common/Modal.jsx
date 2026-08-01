import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-warmgold-500/30 p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-stardustsilver-300/15">
          <h3 className="font-serif text-xl font-bold text-warmgold-400">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stardustsilver-300/70 hover:text-white hover:bg-arsenic-800 transition"
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
