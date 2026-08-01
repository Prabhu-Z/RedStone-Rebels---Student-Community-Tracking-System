import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import { Plus, Calendar, MapPin, Users, CheckCircle2, XCircle, Crown, Clock, Sparkles, UserCheck, GraduationCap, Eye, Globe, Lock } from 'lucide-react';

const EventManagePage = () => {
  const [events, setEvents] = useState([]);
  const [pendingProposals, setPendingProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('proposals'); // 'proposals' or 'published'

  // Registered Students Modal State
  const [selectedEventForRegs, setSelectedEventForRegs] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(false);

  const [formData, setFormData] = useState({
    communityId: 1,
    title: '',
    description: '',
    eventType: 'WORKSHOP',
    eventScope: 'COMMUNITY_EVENT', // 'COMMUNITY_EVENT' vs 'GLOBAL_EVENT'
    duration: '2 Hours',
    venue: '',
    eventDate: '',
    time: '10:00 AM',
    maxParticipants: 100,
    status: 'UPCOMING',
    coordinatorName: '',
  });

  useEffect(() => {
    fetchEventsAndProposals();
  }, []);

  const fetchEventsAndProposals = async () => {
    try {
      const res = await api.get('/events');
      const allEvents = res.data || [];
      setEvents(allEvents.filter(e => e.status !== 'PENDING_APPROVAL' && e.status !== 'REJECTED'));

      const pendingRes = await api.get('/events/pending');
      setPendingProposals(pendingRes.data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRegistrationsModal = async (eventObj) => {
    setSelectedEventForRegs(eventObj);
    setLoadingRegs(true);
    try {
      const res = await api.get(`/events/${eventObj.id}/registrations`);
      setRegistrations(res.data || []);
    } catch (err) {
      console.error('Error fetching event registrations:', err);
    } finally {
      setLoadingRegs(false);
    }
  };

  const handleApproveProposal = async (eventId, title) => {
    try {
      await api.put(`/events/${eventId}/approve`);
      alert(`✅ Event proposal "${title}" has been approved and published!`);
      fetchEventsAndProposals();
    } catch (err) {
      alert('Failed to approve event proposal.');
    }
  };

  const handleRejectProposal = async (eventId, title) => {
    const confirmed = window.confirm(`Are you sure you want to decline the proposal "${title}"?`);
    if (!confirmed) return;

    try {
      await api.put(`/events/${eventId}/reject`);
      alert(`Decline recorded for event proposal "${title}".`);
      fetchEventsAndProposals();
    } catch (err) {
      alert('Failed to decline proposal.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/events', formData);
      setModalOpen(false);
      setFormData({
        communityId: 1,
        title: '',
        description: '',
        eventType: 'WORKSHOP',
        eventScope: 'COMMUNITY_EVENT',
        duration: '2 Hours',
        venue: '',
        eventDate: '',
        time: '10:00 AM',
        maxParticipants: 100,
        status: 'UPCOMING',
        coordinatorName: '',
      });
      fetchEventsAndProposals();
    } catch (err) {
      alert('Failed to create event.');
    }
  };

  if (loading) return <LoadingSpinner label="Loading event proposals & schedule..." />;

  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-serif font-bold text-warmgold-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-warmgold-400" /> Community Events & Leader Proposals
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-white mt-1">Event Management</h1>
          <p className="text-xs text-stardustsilver-300/70 mt-1">
            Manage 🔒 <strong>Community Events</strong> (Members Only) & 🌐 <strong>Global Events</strong> (All Campus Students).
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-chestnut-700 to-warmgold-500 text-white font-bold text-xs shadow-lg hover:scale-105 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create New Event
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-stardustsilver-300/15 pb-4">
        <button
          onClick={() => setActiveTab('proposals')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'proposals'
              ? 'bg-gradient-to-r from-warmgold-500 to-amber-500 text-black shadow-gold-glow'
              : 'bg-arsenic-900 text-stardustsilver-300 hover:text-white border border-white/10'
          }`}
        >
          <Crown className="w-4 h-4" /> Pending Leader Proposals ({pendingProposals.length})
        </button>

        <button
          onClick={() => setActiveTab('published')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'published'
              ? 'bg-gradient-to-r from-warmgold-500 to-amber-500 text-black shadow-gold-glow'
              : 'bg-arsenic-900 text-stardustsilver-300 hover:text-white border border-white/10'
          }`}
        >
          <Calendar className="w-4 h-4" /> Active & Published Events ({events.length})
        </button>
      </div>

      {/* TAB 1: PENDING PROPOSALS FROM STUDENT LEADERS */}
      {activeTab === 'proposals' && (
        <div className="space-y-6">
          {pendingProposals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingProposals.map((evt) => {
                const isGlobal = evt.eventScope === 'GLOBAL_EVENT';
                return (
                  <div
                    key={evt.id}
                    className="glass-card p-6 rounded-2xl border border-warmgold-500/40 bg-gradient-to-b from-warmgold-500/10 to-transparent space-y-4 flex flex-col justify-between shadow-gold-glow"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                          <Crown className="w-3 h-3 text-amber-400" /> {evt.eventType}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                          isGlobal ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                        }`}>
                          {isGlobal ? '🌐 Global Event' : '🔒 Community Event'}
                        </span>
                      </div>

                      <h3 className="font-serif text-xl font-bold text-white">{evt.title}</h3>
                      <p className="text-xs text-warmgold-300 font-serif font-bold">{evt.communityName}</p>

                      <div className="p-3 rounded-xl bg-arsenic-900/60 border border-white/10 text-xs text-stardustsilver-300/90 leading-relaxed">
                        <strong>Description:</strong> {evt.description}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-stardustsilver-300/80 pt-2">
                        <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-warmgold-400" /> <strong>Date:</strong> {evt.eventDate}</div>
                        <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-warmgold-400" /> <strong>Duration:</strong> {evt.duration || '2 Hours'}</div>
                        <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-warmgold-400" /> <strong>Venue:</strong> {evt.venue}</div>
                        <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-warmgold-400" /> <strong>Cap:</strong> {evt.maxParticipants} Students</div>
                      </div>

                      {evt.proposedByName && (
                        <div className="text-[11px] text-warmgold-300 font-mono italic pt-1">
                          ✦ {evt.proposedByName}
                        </div>
                      )}
                    </div>

                    {/* Accept / Decline Action Buttons */}
                    <div className="pt-4 border-t border-white/15 grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleRejectProposal(evt.id, evt.title)}
                        className="py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                      >
                        <XCircle className="w-4 h-4 text-rose-400" /> Decline Proposal
                      </button>
                      <button
                        onClick={() => handleApproveProposal(evt.id, evt.title)}
                        className="py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-extrabold shadow-lg flex items-center justify-center gap-1.5 transition"
                      >
                        <CheckCircle2 className="w-4 h-4 text-white" /> Accept & Approve
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-stardustsilver-300/60 glass-panel rounded-3xl border border-dashed border-stardustsilver-300/20">
              <Crown className="w-10 h-10 text-warmgold-400/40 mx-auto mb-3" />
              No pending event proposals from Student Leaders at this time.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ACTIVE & PUBLISHED EVENTS */}
      {activeTab === 'published' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((evt) => {
            const isGlobal = evt.eventScope === 'GLOBAL_EVENT';
            return (
              <div
                key={evt.id}
                className="glass-card p-6 rounded-2xl border border-stardustsilver-300/15 flex flex-col justify-between hover:border-warmgold-500/40 transition group cursor-pointer space-y-4"
                onClick={() => handleOpenRegistrationsModal(evt)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-morning-500/20 text-morning-300 border border-morning-500/30">
                        {evt.eventType}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                        isGlobal ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                      }`}>
                        {isGlobal ? <Globe className="w-3 h-3 text-purple-400" /> : <Lock className="w-3 h-3 text-sky-400" />}
                        {isGlobal ? 'Global Event' : 'Community Event'}
                      </span>
                    </div>
                    <Badge status={evt.status}>{evt.status}</Badge>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-warmgold-300 transition flex items-center justify-between">
                    <span>{evt.title}</span>
                    <Eye className="w-4 h-4 text-warmgold-400 opacity-60 group-hover:opacity-100 transition shrink-0" />
                  </h3>
                  <p className="text-xs text-warmgold-400 font-serif">{evt.communityName}</p>
                  <p className="text-xs text-stardustsilver-300/70 line-clamp-2">{evt.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-stardustsilver-300/80 pt-3 border-t border-stardustsilver-300/15">
                    <div><Calendar className="w-3.5 h-3.5 inline text-warmgold-400 mr-1" /> {evt.eventDate}</div>
                    <div><Clock className="w-3.5 h-3.5 inline text-warmgold-400 mr-1" /> {evt.duration || '2 Hours'}</div>
                    <div><MapPin className="w-3.5 h-3.5 inline text-warmgold-400 mr-1" /> {evt.venue}</div>
                    <div className="font-bold text-warmgold-300">
                      <Users className="w-3.5 h-3.5 inline text-warmgold-400 mr-1" /> {evt.currentRegistrations}/{evt.maxParticipants} Registered
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stardustsilver-300/15" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleOpenRegistrationsModal(evt)}
                    className="w-full py-2.5 rounded-xl bg-warmgold-500/20 hover:bg-warmgold-500/30 border border-warmgold-500/40 text-warmgold-300 font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <Users className="w-4 h-4 text-warmgold-400" /> View Registered Students ({evt.currentRegistrations})
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: WHO'S REGISTERED FOR EVENT ROSTER */}
      {selectedEventForRegs && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-2xl w-full p-6 lg:p-8 rounded-3xl border border-warmgold-500/40 shadow-2xl relative max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <Users className="w-6 h-6 text-warmgold-400" />
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">{selectedEventForRegs.title}</h3>
                  <p className="text-[11px] text-warmgold-400 font-mono">
                    Registered Students Roster ({registrations.length} / {selectedEventForRegs.maxParticipants || 100})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEventForRegs(null)}
                className="text-white/60 hover:text-white text-lg font-bold px-2"
              >
                ✕
              </button>
            </div>

            {loadingRegs ? (
              <div className="p-12 text-center text-xs text-stardustsilver-300">
                <LoadingSpinner label="Fetching registered students roster..." />
              </div>
            ) : registrations.length > 0 ? (
              <div className="overflow-y-auto pr-1 space-y-3 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {registrations.map((r, idx) => (
                    <div
                      key={r.id || idx}
                      className="glass-card p-3.5 rounded-xl border border-white/10 space-y-1.5 hover:border-warmgold-400/40 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> {r.studentName}
                        </span>
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {r.status || 'REGISTERED'}
                        </span>
                      </div>

                      <div className="text-[11px] font-mono text-warmgold-300">Reg #{r.studentCode}</div>
                      <div className="text-[10px] text-stardustsilver-300/70 flex items-center gap-1">
                        <GraduationCap className="w-3 h-3 text-morning-300" /> {r.department}
                      </div>
                      <div className="text-[9px] text-stardustsilver-300/40 pt-1 font-mono">
                        Registered: {r.registrationDate ? new Date(r.registrationDate).toLocaleString() : 'Recently'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-stardustsilver-300/50 glass-card rounded-2xl border border-dashed border-white/10">
                <Users className="w-8 h-8 text-warmgold-400/40 mx-auto mb-2" />
                No students have registered for this event yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE NEW EVENT MODAL */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Official Event">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-almond-200 uppercase tracking-wider mb-1">Event Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Advanced Java & Spring Boot Workshop"
              className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-stardustsilver-300/15 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-almond-200 uppercase tracking-wider mb-1">Event Scope & Participation</label>
              <select
                value={formData.eventScope}
                onChange={(e) => setFormData({ ...formData, eventScope: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-stardustsilver-300/15 text-white font-bold"
              >
                <option value="COMMUNITY_EVENT">🔒 Community Event (Community Members Only)</option>
                <option value="GLOBAL_EVENT">🌐 Global Event (Open to ALL Campus Students)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-almond-200 uppercase tracking-wider mb-1">Event Type</label>
              <select
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-stardustsilver-300/15 text-white"
              >
                <option value="WORKSHOP">WORKSHOP</option>
                <option value="SEMINAR">SEMINAR</option>
                <option value="HACKATHON">HACKATHON</option>
                <option value="CULTURAL">CULTURAL</option>
                <option value="SPORTS">SPORTS</option>
                <option value="TECHNICAL">TECHNICAL</option>
                <option value="WEBINAR">WEBINAR</option>
                <option value="COMMUNITY_SERVICE">COMMUNITY SERVICE</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-almond-200 uppercase tracking-wider mb-1">Date</label>
              <input
                type="date"
                required
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-stardustsilver-300/15 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-almond-200 uppercase tracking-wider mb-1">Venue</label>
              <input
                type="text"
                required
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="Auditorium Hall B"
                className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-stardustsilver-300/15 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-almond-200 uppercase tracking-wider mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-stardustsilver-300/15 text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-chestnut-700 to-warmgold-500 text-white font-bold text-xs shadow-lg"
          >
            Publish Event
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default EventManagePage;
