import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import DataTable from '../../components/common/DataTable';
import { CheckCircle2, Award, CalendarCheck } from 'lucide-react';

const AttendancePage = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchAttendance = async () => {
      try {
        let studentIdParam = user?.studentId || user?.id;
        const res = await api.get(`/attendance/student/${studentIdParam}`);
        setAttendance(res.data || []);
      } catch (err) {
        console.error('Error fetching student attendance history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [user]);

  if (loading) return <LoadingSpinner label="Loading verified attendance records..." />;

  const columns = [
    {
      header: 'Event Title & Category',
      accessor: 'eventTitle',
      cell: (r) => (
        <div>
          <div className="font-sans font-bold text-slate-900 text-sm">{r.eventTitle}</div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            Record ID: #{r.id}
          </div>
        </div>
      ),
    },
    {
      header: 'Organizing Community',
      accessor: 'communityName',
      cell: (r) => <span className="font-sans font-bold text-[#7c3aed]">{r.communityName}</span>,
    },
    {
      header: 'Recorded Timestamp',
      accessor: 'recordedTime',
      cell: (r) => (
        <span className="font-mono text-xs text-slate-600">
          {r.recordedTime ? new Date(r.recordedTime).toLocaleString() : 'Recently Verified'}
        </span>
      ),
    },
    {
      header: 'Verification Status',
      accessor: 'status',
      cell: (r) => <Badge status={r.status || 'ATTENDED'}>{r.status || 'ATTENDED'}</Badge>,
    },
  ];

  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-sans font-bold text-[#7c3aed] uppercase tracking-widest flex items-center gap-1.5">
            <CalendarCheck className="w-4 h-4 text-[#7c3aed]" /> Official Verification Log
          </span>
          <h1 className="font-sans text-3xl font-extrabold text-slate-900 mt-1">Event Attendance Log</h1>
          <p className="text-xs text-slate-600 mt-1">
            Official verified event attendance records for extracurricular participation.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/90 px-4 py-2.5 rounded-2xl border border-slate-200 self-start sm:self-auto font-mono text-xs">
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Verified Attendance: <strong className="text-emerald-300">{attendance.length} Logged</strong></span>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 lg:p-8 rounded-3xl border border-slate-200 space-y-4">
        <h3 className="font-sans text-xl font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Verified On-Site Attendance Records ({attendance.length})
        </h3>

        <DataTable
          columns={columns}
          data={attendance}
          emptyMessage="No verified event attendance records logged yet."
        />
      </div>
    </div>
  );
};

export default AttendancePage;
