import React from 'react';
import { X, QrCode, Calendar, MapPin, Clock, ShieldCheck, Download } from 'lucide-react';

const QRCodeTicketModal = ({ isOpen, onClose, event, student }) => {
  if (!isOpen || !event) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md glass-panel-apple rounded-3xl p-6 sm:p-8 border border-[#F2CA50]/40 shadow-2xl text-white my-8">
        
        {/* Top Controls */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#F2CA50]" />
            <h3 className="text-base font-bold text-white">Event Attendance Pass</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Ticket Pass */}
        <div className="p-6 rounded-2xl bg-[#0e0e12] border border-white/15 space-y-6 text-center print:bg-white print:text-black print:border-none">
          <div>
            <span className="text-[10px] font-mono text-[#F2CA50] uppercase tracking-widest font-bold print:text-black">
              Official Entry Pass
            </span>
            <h2 className="text-xl font-extrabold text-white mt-1 print:text-black">{event.title}</h2>
            <p className="text-xs text-[#D0C5AF] font-mono mt-0.5 print:text-black/80">{event.communityName || 'Campus Community Event'}</p>
          </div>

          {/* SVG QR Code Simulation */}
          <div className="flex justify-center my-4">
            <div className="p-4 rounded-2xl bg-white border-2 border-[#F2CA50] shadow-xl inline-block">
              <svg className="w-40 h-40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" fill="white" />
                <path d="M10 10h30v30H10zM15 15h20v20H15zM20 20h10v10H20z" fill="black" />
                <path d="M60 10h30v30H60zM65 15h20v20H65zM70 20h10v10H70z" fill="black" />
                <path d="M10 60h30v30H10zM15 65h20v20H15zM20 70h10v10H20z" fill="black" />
                <rect x="45" y="10" width="10" height="10" fill="black" />
                <rect x="45" y="30" width="10" height="10" fill="black" />
                <rect x="10" y="45" width="10" height="10" fill="black" />
                <rect x="30" y="45" width="10" height="10" fill="black" />
                <rect x="60" y="45" width="30" height="10" fill="black" />
                <rect x="45" y="60" width="10" height="30" fill="black" />
                <rect x="65" y="65" width="10" height="10" fill="black" />
                <rect x="80" y="65" width="10" height="10" fill="black" />
                <rect x="65" y="80" width="25" height="10" fill="black" />
              </svg>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 text-xs text-left p-3 rounded-xl bg-white/5 border border-white/10 print:bg-gray-100 print:text-black">
            <div className="flex items-center gap-2 text-[#D0C5AF] print:text-black">
              <Calendar className="w-3.5 h-3.5 text-[#F2CA50]" />
              <span>Date: <strong>{event.eventDate || 'Scheduled Date'}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-[#D0C5AF] print:text-black">
              <Clock className="w-3.5 h-3.5 text-[#F2CA50]" />
              <span>Time: <strong>{event.time || '10:00 AM IST'}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-[#D0C5AF] print:text-black">
              <MapPin className="w-3.5 h-3.5 text-[#F2CA50]" />
              <span>Venue: <strong>{event.venue || 'Main Auditorium'}</strong></span>
            </div>
          </div>

          {/* Student Info */}
          <div className="pt-3 border-t border-white/10 text-left text-xs font-mono flex items-center justify-between print:border-black/20 print:text-black">
            <div>
              <span className="text-[#D0C5AF]/60 text-[10px] block">TICKET HOLDER</span>
              <strong className="text-white text-sm print:text-black">{student?.name || 'Student'}</strong>
            </div>
            <div className="text-right">
              <span className="text-[#D0C5AF]/60 text-[10px] block">PASS CODE</span>
              <strong className="text-[#F2CA50] print:text-black">EVT-PASS-{event.id || '01'}</strong>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="w-full py-2.5 rounded-xl honey-btn text-xs font-bold flex items-center justify-center gap-2 shadow-md print:hidden"
          >
            <Download className="w-4 h-4" /> Download Ticket
          </button>

        </div>
      </div>
    </div>
  );
};

export default QRCodeTicketModal;
