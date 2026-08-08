import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { Plus, Clock, Award } from 'lucide-react';

const ActivityManagePage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    studentId: 1,
    communityId: 1,
    activityType: 'EVENT_ORGANIZED',
    role: 'Organizer',
    contribution: 'Lead coordinator for Spring Boot workshop',
    activityDate: new Date().toISOString().split('T')[0],
    description: 'Managed venue logistics and speaker hospitality',
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students');
      setStudents(res.data);
      if (res.data.length > 0) {
        setFormData(prev => ({ ...prev, studentId: res.data[0].id }));
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/activities', formData);
      setModalOpen(false);
      alert('Activity successfully added to student timeline!');
    } catch (err) {
      alert('Failed to log activity.');
    }
  };

  if (loading) return <LoadingSpinner label="Loading student records..." />;

  return (
    <div className="space-y-8 p-4 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans text-3xl font-extrabold text-slate-900">Student Activity & Milestone Logging</h1>
          <p className="text-xs text-slate-600 mt-1">Record student organizing roles, contributions, and community honors.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-chestnut-700 to-purple-600 text-slate-900 font-bold text-xs shadow-lg"
        >
          <Plus className="w-4 h-4" /> Log Student Activity
        </button>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 lg:p-8 rounded-3xl border border-slate-100">
        <h3 className="font-sans text-xl font-bold text-slate-900 mb-4">Enrolled Students ({students.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((s) => (
            <div key={s.id} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 rounded-xl border border-slate-100 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-sans font-bold text-slate-900 text-sm">{s.name}</span>
                <span className="font-mono text-[#7c3aed]">{s.studentCode}</span>
              </div>
              <p className="text-slate-500">{s.department} • Year {s.year}</p>
              <button
                onClick={() => {
                  setFormData(prev => ({ ...prev, studentId: s.id }));
                  setModalOpen(true);
                }}
                className="w-full mt-2 py-1.5 rounded-lg bg-purple-600/20 text-[#8b5cf6] hover:bg-purple-600/30 border border-slate-200 font-semibold"
              >
                + Add Activity Log
              </button>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Log Student Community Activity">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">Select Student</label>
            <select
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: parseInt(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-100 text-slate-900"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id} className="bg-white text-slate-900">{s.name} ({s.studentCode})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">Activity Type</label>
              <select
                value={formData.activityType}
                onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-100 text-slate-900"
              >
                <option value="EVENT_ORGANIZED" className="bg-white text-slate-900">EVENT_ORGANIZED</option>
                <option value="WORKSHOP_ATTENDED" className="bg-white text-slate-900">WORKSHOP_ATTENDED</option>
                <option value="COMPETITION_WON" className="bg-white text-slate-900">COMPETITION_WON</option>
                <option value="VOLUNTEER_SERVICE" className="bg-white text-slate-900">VOLUNTEER_SERVICE</option>
                <option value="LEADERSHIP_ROLE" className="bg-white text-slate-900">LEADERSHIP_ROLE</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">Student Role</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Organizer / Lead / Winner"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-100 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">Contribution Summary</label>
            <input
              type="text"
              required
              value={formData.contribution}
              onChange={(e) => setFormData({ ...formData, contribution: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-100 text-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">Description / Notes</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-100 text-slate-900"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-chestnut-700 to-purple-600 text-slate-900 font-bold text-xs shadow-lg"
          >
            Save Activity to Timeline
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ActivityManagePage;
