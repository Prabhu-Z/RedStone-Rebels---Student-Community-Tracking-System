import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PrintReportModal from '../../components/reports/PrintReportModal';
import { FileText, Printer } from 'lucide-react';

const CoordinatorReportsPage = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportModal, setReportModal] = useState(false);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const res = await api.get('/communities');
      setCommunities(res.data);
    } catch (err) {
      console.error('Error fetching communities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (communityId) => {
    try {
      const res = await api.get(`/reports/community/${communityId}`);
      setReportData(res.data);
      setReportModal(true);
    } catch (err) {
      alert('Failed to generate community report.');
    }
  };

  if (loading) return <LoadingSpinner label="Loading reporting suite..." />;

  return (
    <div className="space-y-8 p-4 lg:p-8">
      <div>
        <h1 className="font-serif text-3xl font-extrabold text-white">Community Performance Reports</h1>
        <p className="text-xs text-stardustsilver-300/70 mt-1">Generate official PDF/Print reports for membership, event metrics, and volunteer hours.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {communities.map((c) => (
          <div key={c.id} className="glass-card p-6 rounded-2xl border border-stardustsilver-300/15 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-white">{c.name}</h3>
              <p className="text-xs text-warmgold-400 font-serif">{c.category}</p>
              <p className="text-xs text-stardustsilver-300/60 mt-1">Faculty Lead: {c.facultyCoordinator}</p>
            </div>
            <button
              onClick={() => handleGenerateReport(c.id)}
              className="px-4 py-2 rounded-xl bg-warmgold-500 text-arsenic-950 font-bold text-xs hover:bg-warmgold-400 transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" /> Print Report
            </button>
          </div>
        ))}
      </div>

      <PrintReportModal isOpen={reportModal} onClose={() => setReportModal(false)} reportData={reportData} />
    </div>
  );
};

export default CoordinatorReportsPage;
