import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PrintReportModal from '../../components/reports/PrintReportModal';
import { FileText, Printer } from 'lucide-react';

const FacultyReportsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportModal, setReportModal] = useState(false);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students');
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateStudentReport = async (studentId) => {
    try {
      const res = await api.get(`/reports/student/${studentId}`);
      setReportData(res.data);
      setReportModal(true);
    } catch (err) {
      alert('Failed to generate report.');
    }
  };

  if (loading) return <LoadingSpinner label="Loading faculty report generator..." />;

  return (
    <div className="space-y-8 p-4 lg:p-8">
      <div>
        <h1 className="font-serif text-3xl font-extrabold text-white">College Official Reports Suite</h1>
        <p className="text-xs text-stardustsilver-300/70 mt-1">Export official student activity transcripts and community performance summaries.</p>
      </div>

      <div className="glass-panel p-6 lg:p-8 rounded-3xl border border-stardustsilver-300/15">
        <h3 className="font-serif text-xl font-bold text-white mb-4">Select Student for Official Portfolio Transcript</h3>
        <div className="space-y-3">
          {students.map((s) => (
            <div key={s.id} className="glass-card p-4 rounded-xl border border-stardustsilver-300/15 flex items-center justify-between">
              <div>
                <span className="font-serif font-bold text-white text-base">{s.name}</span>
                <p className="text-xs text-stardustsilver-300/60 font-mono">Code: {s.studentCode} • {s.department}</p>
              </div>
              <button
                onClick={() => handleGenerateStudentReport(s.id)}
                className="px-4 py-2 rounded-xl bg-warmgold-500 text-arsenic-950 font-bold text-xs hover:bg-warmgold-400 transition flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Portfolio Transcript
              </button>
            </div>
          ))}
        </div>
      </div>

      <PrintReportModal isOpen={reportModal} onClose={() => setReportModal(false)} reportData={reportData} />
    </div>
  );
};

export default FacultyReportsPage;
