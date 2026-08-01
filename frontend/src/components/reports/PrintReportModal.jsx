import React from 'react';
import Modal from '../common/Modal';
import { Printer, Download } from 'lucide-react';

const PrintReportModal = ({ isOpen, onClose, reportData }) => {
  if (!reportData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={reportData.reportTitle || "Report Summary"}>
      <div className="space-y-6 text-almond-200 text-xs printable-area">
        <div className="flex items-center justify-between border-b border-warmgold-500/30 pb-3">
          <div>
            <h4 className="font-serif text-base font-bold text-warmgold-400">STUDENT COMMUNITY TRACKING SYSTEM</h4>
            <p className="text-[11px] text-stardustsilver-300/60">Official Extracurricular Record</p>
          </div>
          <span className="text-[11px] font-mono text-stardustsilver-300/50">Generated: {new Date().toLocaleDateString()}</span>
        </div>

        {reportData.student && (
          <div className="glass-card p-4 rounded-xl space-y-2">
            <h5 className="font-serif text-sm font-bold text-white uppercase tracking-wider">Student Profile</h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><strong>Name:</strong> {reportData.student.name}</div>
              <div><strong>Register No:</strong> {reportData.student.studentCode}</div>
              <div><strong>Department:</strong> {reportData.student.department}</div>
              <div><strong>Degree & Year:</strong> {reportData.student.degree} (Year {reportData.student.year})</div>
              <div><strong>Attendance Rate:</strong> {reportData.student.attendancePercentage}%</div>
              <div><strong>Verified Volunteer Hours:</strong> {reportData.student.totalVolunteerHours} Hours</div>
            </div>
          </div>
        )}

        {reportData.community && (
          <div className="glass-card p-4 rounded-xl space-y-2">
            <h5 className="font-serif text-sm font-bold text-white uppercase tracking-wider">Community Details</h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><strong>Community:</strong> {reportData.community.name}</div>
              <div><strong>Category:</strong> {reportData.community.category}</div>
              <div><strong>Active Members:</strong> {reportData.community.memberCount}</div>
              <div><strong>Faculty Coordinator:</strong> {reportData.community.facultyCoordinator}</div>
            </div>
          </div>
        )}

        {reportData.activitiesHistory && (
          <div className="space-y-2">
            <h5 className="font-serif text-sm font-bold text-warmgold-400 uppercase tracking-wider">Activity History Log</h5>
            <div className="border border-stardustsilver-300/15 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-arsenic-900 text-warmgold-400 font-serif">
                  <tr>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Community</th>
                    <th className="p-2.5">Activity Type</th>
                    <th className="p-2.5">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-almond-300/10">
                  {reportData.activitiesHistory.map((act, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-mono">{act.activityDate}</td>
                      <td className="p-2.5 font-semibold text-white">{act.communityName}</td>
                      <td className="p-2.5">{act.activityType}</td>
                      <td className="p-2.5">{act.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-stardustsilver-300/15">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-warmgold-500 text-arsenic-950 font-bold hover:bg-warmgold-400 transition"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PrintReportModal;
