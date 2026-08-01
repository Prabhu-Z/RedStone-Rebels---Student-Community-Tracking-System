import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import { CheckSquare, Check, X } from 'lucide-react';

const AttendanceManagePage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
      if (res.data.length > 0) {
        setSelectedEventId(res.data[0].id);
        fetchAttendance(res.data[0].id);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async (eventId) => {
    try {
      const res = await api.get(`/attendance/event/${eventId}`);
      setAttendanceList(res.data);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    }
  };

  const handleToggleAttendance = async (studentId, currentStatus) => {
    const newStatus = currentStatus === 'PRESENT' ? 'ABSENT' : 'PRESENT';
    try {
      await api.post(`/attendance?eventId=${selectedEventId}&studentId=${studentId}&status=${newStatus}`);
      fetchAttendance(selectedEventId);
    } catch (err) {
      alert('Failed to update attendance.');
    }
  };

  if (loading) return <LoadingSpinner label="Loading attendance management portal..." />;

  return (
    <div className="space-y-8 p-4 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-extrabold text-white">Event Attendance Recording</h1>
          <p className="text-xs text-stardustsilver-300/70 mt-1">Mark student participants PRESENT or ABSENT for official records.</p>
        </div>

        <select
          value={selectedEventId}
          onChange={(e) => {
            setSelectedEventId(e.target.value);
            fetchAttendance(e.target.value);
          }}
          className="px-4 py-2.5 rounded-xl bg-arsenic-900 border border-warmgold-500/30 text-white font-serif text-xs"
        >
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title} ({e.eventDate})
            </option>
          ))}
        </select>
      </div>

      <div className="glass-panel p-6 lg:p-8 rounded-3xl border border-stardustsilver-300/15">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-almond-200">
            <thead className="bg-arsenic-900 text-warmgold-400 font-serif border-b border-stardustsilver-300/15">
              <tr>
                <th className="p-3">Student Name</th>
                <th className="p-3">Register Code</th>
                <th className="p-3">Recorded Time</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Toggle Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-almond-300/5">
              {attendanceList && attendanceList.length > 0 ? (
                attendanceList.map((att) => (
                  <tr key={att.id} className="hover:bg-arsenic-800/40">
                    <td className="p-3 font-serif font-bold text-white">{att.studentName}</td>
                    <td className="p-3 font-mono">{att.studentCode}</td>
                    <td className="p-3 font-mono text-stardustsilver-300/60">{att.recordedTime ? new Date(att.recordedTime).toLocaleString() : 'N/A'}</td>
                    <td className="p-3"><Badge status={att.status}>{att.status}</Badge></td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleAttendance(att.studentId, att.status)}
                        className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1 ml-auto text-xs ${
                          att.status === 'PRESENT'
                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'
                        }`}
                      >
                        {att.status === 'PRESENT' ? <X className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                        {att.status === 'PRESENT' ? 'Mark Absent' : 'Mark Present'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-stardustsilver-300/50">No registered students found for selected event.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceManagePage;
