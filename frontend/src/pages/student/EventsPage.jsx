import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import { Calendar, MapPin, Clock, Users, CheckCircle2, PlusCircle, Send, Crown, ShieldAlert, UserCheck, Eye, GraduationCap, FolderKanban, Globe, Lock } from 'lucide-react';

const EventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [allCommunities, setAllCommunities] = useState([]);
  const [userMemberships, setUserMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scopeFilter, setScopeFilter] = useState('ALL'); // 'ALL', 'GLOBAL_EVENT', 'COMMUNITY_EVENT'
  const [showProposeModal, setShowProposeModal] = useState(false);
  const [proposalSubmitting, setProposalSubmitting] = useState(false);

  // Registered Students Modal State
  const [selectedEventForRegs, setSelectedEventForRegs] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(false);

  const [proposalForm, setProposalForm] = useState({
    communityId: 1,
    title: '',
    description: '',
    eventType: 'WORKSHOP',
    eventScope: 'COMMUNITY_EVENT',
    duration: '2 Hours',
    eventDate: new Date().toISOString().split('T')[0],
    venue: '',
    time: '10:00 AM',
    maxParticipants: 100
  });

  useEffect(() => {
    fetchEventsAndMemberships();
  }, [user]);

  const fetchEventsAndMemberships = async () => {
    try {
      const res = await api.get(`/events${user?.studentId ? `?studentId=${user.studentId}` : ''}`);
      setEvents(res.data || []);

      const commRes = await api.get('/communities');
      const commList = commRes.data || [];
      setAllCommunities(commList);

      let approvedMems = [];
      let studentIdToUse = user?.studentId;

      if (!studentIdToUse && user?.id) {
        try {
          const userMemRes = await api.get(`/memberships/user/${user.id}`);
          approvedMems = (userMemRes.data || []).filter(m => m.status === 'APPROVED');
        } catch (e) {
          console.warn('Could not fetch by userId:', e);
        }
      } else if (studentIdToUse) {
        try {
          const memRes = await api.get(`/memberships/student/${studentIdToUse}`);
          approvedMems = (memRes.data || []).filter(m => m.status === 'APPROVED');
        } catch (e) {
          console.warn('Could not fetch by studentId:', e);
        }
      }

      setUserMemberships(approvedMems);

      const leaderMem = approvedMems.find(
        m => String(m.role).toUpperCase().includes('COORDINATOR') ||
             String(m.role).toUpperCase().includes('LEADER') ||
             String(m.role).toUpperCase().includes('ORGANIZER') ||
             String(m.role).toUpperCase().includes('LEAD')
      );

      let defaultCommId = commList.length > 0 ? commList[0].id : 1;
      if (leaderMem && leaderMem.communityId) {
        defaultCommId = leaderMem.communityId;
      } else if (approvedMems.length > 0 && approvedMems[0].communityId) {
        defaultCommId = approvedMems[0].communityId;
      }

      setProposalForm(prev => ({ ...prev, communityId: defaultCommId }));
    } catch (err) {
      console.error('Error fetching events & memberships:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId, eventObj) => {
    if (!user?.studentId && !user?.id) return;
    try {
      const studentIdParam = user?.studentId || user?.id;
      await api.post(`/events/${eventId}/register?studentId=${studentIdParam}`);
      alert(`🎉 Registered for "${eventObj?.title}" (+1 Point awarded!)`);
      fetchEventsAndMemberships();
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed.');
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

  const handleProposeSubmit = async (e) => {
    e.preventDefault();
    setProposalSubmitting(true);
    try {
      const payload = {
        ...proposalForm,
        communityId: parseInt(proposalForm.communityId) || 1
      };

      await api.post(`/events/propose?leaderStudentName=${encodeURIComponent(user?.name || 'Student Leader')}`, payload);
      alert('✨ Event proposal submitted successfully! It has been sent to your Community Coordinator for verification & approval.');
      setShowProposeModal(false);
      fetchEventsAndMemberships();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit event proposal.');
    } finally {
      setProposalSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading events and memberships..." />;

  const userCommunityIds = userMemberships.map(m => m.communityId);

  const leaderMemberships = userMemberships.filter(
    m => String(m.role).toUpperCase().includes('COORDINATOR') ||
         String(m.role).toUpperCase().includes('LEADER') ||
         String(m.role).toUpperCase().includes('ORGANIZER') ||
         String(m.role).toUpperCase().includes('LEAD') ||
         String(m.role).toUpperCase().includes('SECRETARY') ||
         String(m.role).toUpperCase().includes('PRESIDENT')
  );

  const isStudentLeader = leaderMemberships.length > 0 || user?.role === 'ROLE_COMMUNITY_COORDINATOR';

  // Filter events based on Scope Filter & User Memberships
  const filteredEvents = events.filter((evt) => {
    if (evt.status === 'PENDING_APPROVAL' || evt.status === 'REJECTED') return false;

    const isGlobal = evt.eventScope === 'GLOBAL_EVENT';
    const isMemberOfCommunity = userCommunityIds.includes(evt.communityId);

    // Scope Filter
    if (scopeFilter === 'GLOBAL_EVENT' && !isGlobal) return false;
    if (scopeFilter === 'COMMUNITY_EVENT' && isGlobal) return false;

    // Visibility: Global events visible to all. Community events visible to all or members
    return true;
  });

  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-serif font-bold text-warmgold-400 uppercase tracking-widest flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-warmgold-400" /> Campus Events & Gamification (+1 Pt)
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-white mt-1">
            Campus Events Schedule
          </h1>
          <p className="text-xs text-stardustsilver-300/70 mt-1">
            Participate in 🌐 <strong>Global Campus Events</strong> or 🔒 <strong>Community Events</strong> (Members Only). Earn <strong>+1 Point</strong> per registration!
          </p>
        </div>

        {/* Propose Event Button - ONLY visible to Student Leaders */}
        {isStudentLeader ? (
          <button
            onClick={() => setShowProposeModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-warmgold-500 to-amber-500 text-black font-extrabold text-xs shadow-gold-glow hover:scale-105 transition self-start sm:self-auto"
          >
            <Crown className="w-4 h-4 text-black" /> Propose New Event (Student Leader)
          </button>
        ) : (
          <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px] text-warmgold-300/80 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-warmgold-400 shrink-0" />
            <span>Event proposals are restricted to assigned <strong>Student Leaders</strong></span>
          </div>
        )}
      </div>

      {/* Scope Filter Bar */}
      <div className="flex items-center gap-3 border-b border-stardustsilver-300/15 pb-4 overflow-x-auto">
        <button
          onClick={() => setScopeFilter('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            scopeFilter === 'ALL'
              ? 'bg-gradient-to-r from-warmgold-500 to-amber-500 text-black shadow-gold-glow font-extrabold'
              : 'bg-arsenic-900 text-stardustsilver-300 hover:text-white border border-white/10'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" /> All Campus Events ({events.length})
        </button>

        <button
          onClick={() => setScopeFilter('GLOBAL_EVENT')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            scopeFilter === 'GLOBAL_EVENT'
              ? 'bg-gradient-to-r from-warmgold-500 to-amber-500 text-black shadow-gold-glow font-extrabold'
              : 'bg-arsenic-900 text-stardustsilver-300 hover:text-white border border-white/10'
          }`}
        >
          <Globe className="w-3.5 h-3.5" /> 🌐 Global Events (Open to All)
        </button>

        <button
          onClick={() => setScopeFilter('COMMUNITY_EVENT')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            scopeFilter === 'COMMUNITY_EVENT'
              ? 'bg-gradient-to-r from-warmgold-500 to-amber-500 text-black shadow-gold-glow font-extrabold'
              : 'bg-arsenic-900 text-stardustsilver-300 hover:text-white border border-white/10'
          }`}
        >
          <Lock className="w-3.5 h-3.5" /> 🔒 Community Events (Members Only)
        </button>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((evt) => {
            const isGlobal = evt.eventScope === 'GLOBAL_EVENT';
            const isMember = userCommunityIds.includes(evt.communityId);
            const canRegister = isGlobal || isMember || user?.role === 'ROLE_COMMUNITY_COORDINATOR';

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
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-warmgold-400 font-serif font-bold">{evt.communityName}</span>
                    <span className="text-amber-300 text-xs font-bold font-mono">+1 Pt</span>
                  </div>
                  <p className="text-xs text-stardustsilver-300/70 leading-relaxed">{evt.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-stardustsilver-300/80 pt-3 border-t border-stardustsilver-300/15">
                    <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-warmgold-400" /> {evt.eventDate}</div>
                    <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-warmgold-400" /> {evt.time} ({evt.duration || '2 Hours'})</div>
                    <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-warmgold-400" /> {evt.venue}</div>
                    <div className="flex items-center gap-1.5 font-bold text-warmgold-300">
                      <Users className="w-3.5 h-3.5 text-warmgold-400" /> {evt.currentRegistrations}/{evt.maxParticipants} Registered
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stardustsilver-300/15 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleOpenRegistrationsModal(evt)}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs flex items-center gap-1.5 transition shrink-0"
                  >
                    <Users className="w-3.5 h-3.5 text-warmgold-400" /> Roster ({evt.currentRegistrations})
                  </button>

                  {evt.isUserRegistered ? (
                    <div className="flex-1 p-2 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 border border-emerald-500/30">
                      <CheckCircle2 className="w-4 h-4" /> Registered (+1 Pt)
                    </div>
                  ) : canRegister ? (
                    <button
                      onClick={() => handleRegister(evt.id, evt)}
                      disabled={evt.status === 'CANCELLED' || evt.currentRegistrations >= evt.maxParticipants}
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-chestnut-700 to-warmgold-500 text-white font-bold text-xs shadow-lg hover:shadow-warmgold-500/20 transition disabled:opacity-50"
                    >
                      Register (+1 Pt)
                    </button>
                  ) : (
                    <div className="flex-1 p-2 rounded-xl bg-amber-500/10 text-amber-300 font-bold text-[11px] text-center border border-amber-500/30 flex items-center justify-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Community Members Only
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center text-xs text-stardustsilver-300/60 glass-panel rounded-3xl border border-dashed border-white/15 space-y-4">
          <FolderKanban className="w-10 h-10 text-warmgold-400/40 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-white">No Events Found Matching Filter ({scopeFilter})</h3>
            <p className="text-xs text-stardustsilver-300/70 mt-1 max-w-md mx-auto">
              Join communities to unlock exclusive community events!
            </p>
          </div>
          <Link
            to="/student/communities"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-warmgold-500 to-amber-500 text-black font-extrabold text-xs shadow-gold-glow hover:scale-105 transition"
          >
            <Users className="w-4 h-4" /> Explore & Join Communities
          </Link>
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

      {/* MODAL 2: STUDENT LEADER EVENT PROPOSAL MODAL */}
      {showProposeModal && isStudentLeader && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full p-6 lg:p-8 rounded-3xl border border-warmgold-500/40 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Crown className="w-6 h-6 text-warmgold-400" />
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">Create Event Proposal</h3>
                  <p className="text-[10px] text-warmgold-400 uppercase tracking-widest font-mono">Student Leader Submission</p>
                </div>
              </div>
              <button
                onClick={() => setShowProposeModal(false)}
                className="text-white/60 hover:text-white text-lg font-bold px-2"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProposeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-almond-200 uppercase tracking-wider mb-1">Target Community</label>
                <select
                  required
                  value={proposalForm.communityId}
                  onChange={(e) => setProposalForm({ ...proposalForm, communityId: parseInt(e.target.value) || 1 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-white/15 text-white focus:outline-none focus:border-warmgold-400"
                >
                  {leaderMemberships.length > 0 ? (
                    leaderMemberships.map((m) => (
                      <option key={m.communityId} value={m.communityId}>
                        {m.communityName} ({m.role})
                      </option>
                    ))
                  ) : (
                    allCommunities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-almond-200 uppercase tracking-wider mb-1">Event Scope & Participation</label>
                <select
                  value={proposalForm.eventScope}
                  onChange={(e) => setProposalForm({ ...proposalForm, eventScope: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-white/15 text-white font-bold"
                >
                  <option value="COMMUNITY_EVENT">🔒 Community Event (Community Members Only)</option>
                  <option value="GLOBAL_EVENT">🌐 Global Event (Open to ALL Campus Students)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-almond-200 uppercase tracking-wider mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={proposalForm.title}
                  onChange={(e) => setProposalForm({ ...proposalForm, title: e.target.value })}
                  placeholder="e.g. AI & Cloud Architecture Workshop"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-white/15 text-white placeholder-white/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-almond-200 uppercase tracking-wider mb-1">Event Type</label>
                  <select
                    value={proposalForm.eventType}
                    onChange={(e) => setProposalForm({ ...proposalForm, eventType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-white/15 text-white"
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

                <div>
                  <label className="block font-semibold text-almond-200 uppercase tracking-wider mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    value={proposalForm.duration}
                    onChange={(e) => setProposalForm({ ...proposalForm, duration: e.target.value })}
                    placeholder="e.g. 2 Hours / Half Day"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-white/15 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-almond-200 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={proposalForm.description}
                  onChange={(e) => setProposalForm({ ...proposalForm, description: e.target.value })}
                  placeholder="Describe the proposed event objectives, agenda, and targeted audience..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-white/15 text-white placeholder-white/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-almond-200 uppercase tracking-wider mb-1">Proposed Date</label>
                  <input
                    type="date"
                    required
                    value={proposalForm.eventDate}
                    onChange={(e) => setProposalForm({ ...proposalForm, eventDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-white/15 text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-almond-200 uppercase tracking-wider mb-1">Venue</label>
                  <input
                    type="text"
                    required
                    value={proposalForm.venue}
                    onChange={(e) => setProposalForm({ ...proposalForm, venue: e.target.value })}
                    placeholder="e.g. Main Auditorium / Lab 3"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-white/15 text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowProposeModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={proposalSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-warmgold-500 to-amber-500 text-black font-extrabold shadow-gold-glow flex items-center gap-2 disabled:opacity-50"
                >
                  {proposalSubmitting ? 'Submitting...' : 'Submit to Coordinator'} <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
