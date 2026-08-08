import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';

const VolunteerHoursPage = () => {
  const { user } = useAuth();
  const [hours, setHours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.studentId) return;
    const fetchHours = async () => {
      try {
        const res = await api.get(`/volunteer-hours/student/${user.studentId}`);
        setHours(res.data);
      } catch (err) {
        console.error('Error fetching volunteer hours:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHours();
  }, [user]);

  if (loading) return <LoadingSpinner label="Calculating volunteer service hours..." />;

  const verifiedTotal = hours
    .filter(h => h.verificationStatus === 'VERIFIED')
    .reduce((sum, h) => sum + h.hours, 0);

  const columns = [
    { header: 'Activity / Service', accessor: 'activityName', cell: (r) => <span className="font-sans font-bold text-slate-900">{r.activityName}</span> },
    { header: 'Community', accessor: 'communityName', cell: (r) => <span className="text-[#7c3aed] font-sans">{r.communityName}</span> },
    { header: 'Hours Logged', accessor: 'hours', cell: (r) => <span className="font-mono font-bold text-emerald-400">{r.hours} hrs</span> },
    { header: 'Date', accessor: 'activityDate', cell: (r) => <span className="font-mono text-xs text-slate-500">{r.activityDate}</span> },
    { header: 'Verification Status', accessor: 'verificationStatus', cell: (r) => <Badge status={r.verificationStatus}>{r.verificationStatus}</Badge> },
  ];

  return (
    <div className="space-y-8 p-4 lg:p-8">
      <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-3xl font-extrabold text-slate-900">Volunteer & Service Hours</h1>
          <p className="text-xs text-slate-600 mt-1">NSS & Community service hours verified by Coordinators.</p>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-center">
          <span className="text-[#7c3aed]xl font-sans font-bold text-emerald-400">{verifiedTotal} Hours</span>
          <p className="text-[10px] text-slate-600 uppercase tracking-wider">Total Verified Service</p>
        </div>
      </div>

      <DataTable columns={columns} data={hours} emptyMessage="No volunteer hours logged yet." />
    </div>
  );
};

export default VolunteerHoursPage;
