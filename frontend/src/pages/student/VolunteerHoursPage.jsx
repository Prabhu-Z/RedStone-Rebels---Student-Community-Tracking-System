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
    { header: 'Activity / Service', accessor: 'activityName', cell: (r) => <span className="font-serif font-bold text-white">{r.activityName}</span> },
    { header: 'Community', accessor: 'communityName', cell: (r) => <span className="text-warmgold-400 font-serif">{r.communityName}</span> },
    { header: 'Hours Logged', accessor: 'hours', cell: (r) => <span className="font-mono font-bold text-emerald-400">{r.hours} hrs</span> },
    { header: 'Date', accessor: 'activityDate', cell: (r) => <span className="font-mono text-xs text-stardustsilver-300/60">{r.activityDate}</span> },
    { header: 'Verification Status', accessor: 'verificationStatus', cell: (r) => <Badge status={r.verificationStatus}>{r.verificationStatus}</Badge> },
  ];

  return (
    <div className="space-y-8 p-4 lg:p-8">
      <div className="glass-panel p-6 rounded-3xl border border-warmgold-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-extrabold text-white">Volunteer & Service Hours</h1>
          <p className="text-xs text-stardustsilver-300/70 mt-1">NSS & Community service hours verified by Coordinators.</p>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-center">
          <span className="text-2xl font-serif font-bold text-emerald-400">{verifiedTotal} Hours</span>
          <p className="text-[10px] text-stardustsilver-300/70 uppercase tracking-wider">Total Verified Service</p>
        </div>
      </div>

      <DataTable columns={columns} data={hours} emptyMessage="No volunteer hours logged yet." />
    </div>
  );
};

export default VolunteerHoursPage;
