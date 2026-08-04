import React from 'react';
import { X, Award, CheckCircle2, Calendar, FileText, Download, ShieldCheck } from 'lucide-react';

const getTierInfo = (points = 0) => {
  if (points >= 100) return { title: '👑 Extracurricular Legend', color: 'from-amber-400 to-yellow-600', text: 'text-amber-400', border: 'border-amber-400/50' };
  if (points >= 61) return { title: '💎 Platinum Leader', color: 'from-cyan-400 to-blue-600', text: 'text-cyan-400', border: 'border-cyan-400/50' };
  if (points >= 36) return { title: '🥇 Gold Achiever', color: 'from-[#F2CA50] to-yellow-600', text: 'text-[#F2CA50]', border: 'border-[#F2CA50]/50' };
  if (points >= 16) return { title: '🥈 Silver Trailblazer', color: 'from-slate-300 to-slate-500', text: 'text-slate-300', border: 'border-slate-400/50' };
  return { title: '🥉 Bronze Contributor', color: 'from-amber-700 to-amber-900', text: 'text-amber-600', border: 'border-amber-600/50' };
};

const PortfolioExportModal = ({ isOpen, onClose, studentData, points = 0, verifiedTasks = [], eventAttendances = [] }) => {
  if (!isOpen) return null;

  const tier = getTierInfo(points);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-panel-apple rounded-3xl p-6 sm:p-8 border border-[#F2CA50]/30 shadow-2xl my-8 text-white">
        
        {/* Top Controls */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#F2CA50]" />
            <h3 className="text-lg font-bold text-white">Official Extracurricular Transcript</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl honey-btn text-xs font-bold flex items-center gap-2 shadow-lg"
            >
              <Download className="w-4 h-4" /> Download / Print PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Content */}
        <div className="p-6 rounded-2xl bg-[#0e0e12] border border-white/15 space-y-6 print:bg-white print:text-black print:p-0 print:border-none">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6 text-center sm:text-left print:border-black/20">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="material-symbols-outlined text-[#F2CA50] text-3xl print:text-black" style={{ fontVariationSettings: "'FILL' 1" }}>
                  school
                </span>
                <h1 className="text-2xl font-black tracking-tight text-white print:text-black">SMART CAMPUS UNIVERSITY</h1>
              </div>
              <p className="text-xs text-[#D0C5AF] uppercase tracking-widest font-mono mt-1 print:text-black/70">
                Official Extracurricular & Community Transcript
              </p>
            </div>

            <div className="text-center sm:text-right">
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold border ${tier.border} ${tier.text} bg-black/40`}>
                {tier.title}
              </div>
              <p className="text-[11px] font-mono text-white/60 mt-1 print:text-black">Total Score: <strong className="text-[#F2CA50] print:text-black">{points} Points</strong></p>
            </div>
          </div>

          {/* Student Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-white/5 border border-white/10 text-xs print:bg-gray-100 print:text-black print:border-black/20">
            <div>
              <span className="text-[#D0C5AF]/60 block text-[10px] uppercase font-mono print:text-black/60">Student Name</span>
              <strong className="text-white text-sm print:text-black">{studentData?.name || 'Student'}</strong>
            </div>
            <div>
              <span className="text-[#D0C5AF]/60 block text-[10px] uppercase font-mono print:text-black/60">Student Code</span>
              <strong className="text-[#F2CA50] font-mono print:text-black">{studentData?.studentCode || 'N/A'}</strong>
            </div>
            <div>
              <span className="text-[#D0C5AF]/60 block text-[10px] uppercase font-mono print:text-black/60">Department</span>
              <strong className="text-white print:text-black">{studentData?.department || 'Computer Science'}</strong>
            </div>
            <div>
              <span className="text-[#D0C5AF]/60 block text-[10px] uppercase font-mono print:text-black/60">Degree / Year</span>
              <strong className="text-white print:text-black">{studentData?.degree || 'B.Tech'} - Year {studentData?.year || 1}</strong>
            </div>
          </div>

          {/* Verified Task Deliverables */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#F2CA50] font-mono font-bold mb-3 flex items-center gap-2 print:text-black">
              <CheckCircle2 className="w-4 h-4" /> Verified Task Deliverables ({verifiedTasks.length})
            </h4>

            {verifiedTasks.length === 0 ? (
              <p className="text-xs text-white/40 italic p-3 rounded-lg bg-white/5 print:text-black/60">No task deliverables verified yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-[#D0C5AF] font-mono text-[11px] print:border-black/20 print:text-black">
                      <th className="py-2 px-3">Task Title</th>
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3 text-right">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 print:divide-black/10">
                    {verifiedTasks.map((t, idx) => (
                      <tr key={idx} className="hover:bg-white/5 print:hover:bg-transparent">
                        <td className="py-2.5 px-3 font-semibold text-white print:text-black">{t.taskAssignment?.title || 'Task'}</td>
                        <td className="py-2.5 px-3 text-white/70 print:text-black/80">{t.taskAssignment?.taskType || 'Task'}</td>
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 print:text-black">
                            VERIFIED
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-[#F2CA50] print:text-black">
                          +{t.taskAssignment?.taskType === 'COMMUNITY_TASK' ? 5 : 3} Pts
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer Verification Stamp */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#D0C5AF]/60 print:border-black/20 print:text-black">
            <div>
              Verified by SCTS Smart Campus Platform • Issue Date: {new Date().toLocaleDateString()}
            </div>
            <div className="font-mono text-[#F2CA50] font-semibold mt-2 sm:mt-0 print:text-black">
              Digital Signature: SCTS-VERIFIED-REG-{studentData?.id || '001'}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PortfolioExportModal;
