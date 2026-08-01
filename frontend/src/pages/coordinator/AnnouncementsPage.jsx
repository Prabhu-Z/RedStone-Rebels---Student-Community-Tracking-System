import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { Megaphone, Plus, Trash2 } from 'lucide-react';

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    communityId: 1,
    title: '',
    content: '',
    createdBy: 'Community Coordinator',
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/announcements');
      setAnnouncements(res.data);
    } catch (err) {
      console.error('Error fetching announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/announcements', formData);
      setModalOpen(false);
      fetchAnnouncements();
    } catch (err) {
      alert('Failed to publish announcement.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/announcements/${id}`);
      fetchAnnouncements();
    } catch (err) {
      alert('Failed to delete announcement.');
    }
  };

  if (loading) return <LoadingSpinner label="Loading community announcements..." />;

  return (
    <div className="space-y-8 p-4 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-extrabold text-white">Community Announcements</h1>
          <p className="text-xs text-stardustsilver-300/70 mt-1">Publish updates, broadcast circulars, and notify members instantly.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-chestnut-700 to-warmgold-500 text-white font-bold text-xs shadow-lg"
        >
          <Plus className="w-4 h-4" /> Publish Announcement
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((a) => (
          <div key={a.id} className="glass-card p-6 rounded-2xl border border-stardustsilver-300/15 flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-serif text-lg font-bold text-white">{a.title}</span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-warmgold-500/20 text-warmgold-400">
                  {a.communityName}
                </span>
              </div>
              <p className="text-xs text-stardustsilver-300/80 leading-relaxed">{a.content}</p>
              <div className="text-[10px] text-stardustsilver-300/50 font-mono">
                Published by: {a.createdBy} • {a.publishedDate ? new Date(a.publishedDate).toLocaleString() : ''}
              </div>
            </div>

            <button
              onClick={() => handleDelete(a.id)}
              className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/20 transition"
              title="Delete Announcement"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Publish Community Announcement">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-almond-200 uppercase tracking-wider mb-1">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Hackathon Registration Extended!"
              className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-stardustsilver-300/15 text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-almond-200 uppercase tracking-wider mb-1">Announcement Body</label>
            <textarea
              rows={4}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Provide complete announcement circular details..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-stardustsilver-300/15 text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-chestnut-700 to-warmgold-500 text-white font-bold text-xs shadow-lg"
          >
            Broadcast Announcement
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AnnouncementsPage;
