import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import { Check, X } from 'lucide-react';

const VolunteerManagePage = () => {
  const [hoursList, setHoursList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHours();
  }, []);

  const fetchHours = async () => {
    try {
      const res = await api.get('/volunteer-hours/pending');
      setHoursList(res.data);
    } catch (err) {
      console.error('Error fetching volunteer hours:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, status) => {
    try {
      await api.put(`/volunteer-hours/${id}/verify?status=${status}`);
      fetchHours();
    } catch (err) {
      alert('Verification status update failed.');
    }
  };

  if (loading) return <LoadingSpinner label="Loading pending volunteer hours..." />;

  return (
    <div className="space-y-8 p-4 lg:p-8">
      <div>
        <h1 className="font-serif text-3xl font-extrabold text-white">Volunteer Hours Verification</h1>
        <p className="text-xs text-stardustsilver-300/70 mt-1">Review and approve student service hours before inclusion in official totals.</p>
      </div>

      <div className="glass-panel p-6 lg:p-8 rounded-3xl border border-stardustsilver-300/15">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-almond-200">
            <thead className="bg-arsenic-900 text-warmgold-400 font-serif border-b border-stardustsilver-300/15">
              <tr>
                <th className="p-3">Student Name</th>
                <th className="p-3">Register Code</th>
                <th className="p-3">Activity / Drive</th>
                <th className="p-3">Community</th>
                <th className="p-3">Hours Logged</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-almond-300/5">
              {hoursList && hoursList.length > 0 ? (
                hoursList.map((h) => (
                  <tr key={h.id} className="hover:bg-arsenic-800/40">
                    <td className="p-3 font-serif font-bold text-white">{h.studentName}</td>
                    <td className="p-3 font-mono">{h.studentCode}</td>
                    <td className="p-3 font-medium text-almond-100">{h.activityName}</td>
                    <td className="p-3 font-serif text-warmgold-400">{h.communityName}</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">{h.hours} hrs</td>
                    <td className="p-3 font-mono">{h.activityDate}</td>
                    <td className="p-3 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleVerify(h.id, 'VERIFIED')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 font-bold flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Verify
                      </button>
                      <button
                        onClick={() => handleVerify(h.id, 'REJECTED')}
                        className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30 font-bold flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stardustsilver-300/50">No pending volunteer hours to verify.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VolunteerManagePage;
