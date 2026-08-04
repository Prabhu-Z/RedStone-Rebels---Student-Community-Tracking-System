import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import QRCodeTicketModal from '../../components/common/QRCodeTicketModal';
import { Calendar, MapPin, Clock, Users, CheckCircle2, PlusCircle, Send, Crown, ShieldAlert, UserCheck, Eye, GraduationCap, FolderKanban, Globe, Lock, QrCode } from 'lucide-react';

const EventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [allCommunities, setAllCommunities] = useState([]);
  const [userMemberships, setUserMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scopeFilter, setScopeFilter] = useState('ALL');
  const [showProposeModal, setShowProposeModal] = useState(false);
  const [proposalSubmitting, setProposalSubmitting] = useState(false);

  // Registered Students Modal & QR Code Pass State
  const [selectedEventForRegs, setSelectedEventForRegs] = useState(null);
  const [qrModalEvent, setQrModalEvent] = useState(null);
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

  if (loading) return <LoadingSpinner label="Loading campus events & gamification..." />;

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

  const filteredEvents = events.filter((evt) => {
    if (evt.status === 'PENDING_APPROVAL' || evt.status === 'REJECTED') return false;

    const isGlobal = evt.eventScope === 'GLOBAL_EVENT';
    if (scopeFilter === 'GLOBAL_EVENT' && !isGlobal) return false;
    if (scopeFilter === 'COMMUNITY_EVENT' && isGlobal) return false;
    return true;
  });

  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Page Header */}
      <div className="glass-panel-apple p-6 lg:p-8 rounded-3xl border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xl">
        <div>
          <span className="text-xs font-bold text-[#F2CA50] uppercase tracking-widest flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#F2CA50]" /> Campus Events & Gamification (+1 Pt)
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            Campus Events Schedule
          </h1>
          <p className="text-xs text-[#D0C5AF] mt-1">
            Participate in 🌐 <strong>Global Campus Events</strong> or 🔒 <strong>Community Events</strong> (Members Only). Earn <strong>+1 Point</strong> per registration!
          </p>
        </div>

        {isStudentLeader ? (
          <button
            onClick={() => setShowProposeModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl honey-btn text-xs font-extrabold shadow-gold-glow hover:scale-105 transition self-start sm:self-auto"
          >
            <Crown className="w-4 h-4 text-black" /> Propose New Event (Student Leader)
          </button>
        ) : (
          <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px] text-[#F2CA50]/90 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#F2CA50] shrink-0" />
            <span>Event proposals are restricted to assigned <strong>Student Leaders</strong></span>
          </div>
        )}
      </div>

      {/* Scope Filter Bar */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-4 overflow-x-auto">
        <button
          onClick={() => setScopeFilter('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            scopeFilter === 'ALL'
              ? 'bg-gradient-to-r from-[#F2CA50] to-amber-500 text-black shadow-gold-glow font-extrabold'
              : 'bg-white/5 text-[#E2E2E8] hover:text-white border border-white/10'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" /> All Campus Events ({events.length})
        </button>

        <button
          onClick={() => setScopeFilter('GLOBAL_EVENT')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            scopeFilter === 'GLOBAL_EVENT'
              ? 'bg-gradient-to-r from-[#F2CA50] to-amber-500 text-black shadow-gold-glow font-extrabold'
              : 'bg-white/5 text-[#E2E2E8] hover:text-white border border-white/10'
          }`}
        >
          <Globe className="w-3.5 h-3.5" /> 🌐 Global Events (Open to All)
        </button>

        <button
          onClick={() => setScopeFilter('COMMUNITY_EVENT')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            scopeFilter === 'COMMUNITY_EVENT'
              ? 'bg-gradient-to-r from-[#F2CA50] to-amber-500 text-black shadow-gold-glow font-extrabold'
              : 'bg-white/5 text-[#E2E2E8] hover:text-white border border-white/10'
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
                className="glass-card-apple p-6 rounded-2xl border border-white/15 flex flex-col justify-between hover:border-[#F2CA50]/50 transition group cursor-pointer space-y-4 shadow-xl"
                onClick={() => handleOpenRegistrationsModal(evt)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F2CA50]/15 text-[#F2CA50] border border-[#F2CA50]/30">
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

                  <h3 className="text-xl font-extrabold text-white group-hover:text-[#F2CA50] transition flex items-center justify-between">
                    <span>{evt.title}</span>
                    <Eye className="w-4 h-4 text-[#F2CA50] opacity-60 group-hover:opacity-100 transition shrink-0" />
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#F2CA50] font-bold">{evt.communityName}</span>
                    <span className="text-amber-300 text-xs font-bold font-mono">+1 Pt</span>
                  </div>
                  <p className="text-xs text-[#D0C5AF]/80 leading-relaxed">{evt.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[#D0C5AF]/80 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#F2CA50]" /> {evt.eventDate}</div>
                    <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#F2CA50]" /> {evt.time} ({evt.duration || '2 Hours'})</div>
                    <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#F2CA50]" /> {evt.venue}</div>
                    <div className="flex items-center gap-1.5 font-bold text-[#F2CA50]">
                      <Users className="w-3.5 h-3.5 text-[#F2CA50]" /> {evt.currentRegistrations}/{evt.maxParticipants} Registered
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleOpenRegistrationsModal(evt)}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs flex items-center gap-1.5 transition shrink-0"
                  >
                    <Users className="w-3.5 h-3.5 text-[#F2CA50]" /> Roster ({evt.currentRegistrations})
                  </button>

                  {evt.isUserRegistered ? (
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 p-2 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-500/30">
                        <CheckCircle2 className="w-4 h-4" /> Registered
                      </div>
                      <button
                        onClick={() => setQrModalEvent(evt)}
                        className="px-3 py-2 rounded-xl honey-btn text-xs font-bold flex items-center gap-1 shadow-md shrink-0"
                      >
                        <QrCode className="w-4 h-4" /> QR Ticket
                      </button>
                    </div>
                  ) : canRegister ? (
                    <button
                      onClick={() => handleRegister(evt.id, evt)}
                      disabled={evt.status === 'CANCELLED' || evt.currentRegistrations >= evt.maxParticipants}
                      className="flex-1 py-2 rounded-xl honey-btn text-xs font-bold shadow-md hover:scale-[1.02] transition disabled:opacity-50"
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
        <div className="p-12 text-center text-xs text-[#D0C5AF]/60 glass-panel-apple rounded-3xl border border-dashed border-white/15 space-y-4 shadow-xl">
          <FolderKanban className="w-10 h-10 text-[#F2CA50]/40 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-white">No Events Found Matching Filter ({scopeFilter})</h3>
            <p className="text-xs text-[#D0C5AF] mt-1 max-w-md mx-auto">
              Join communities to unlock exclusive community events!
            </p>
          </div>
          <Link
            to="/student/communities"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl honey-btn text-black font-extrabold text-xs shadow-gold-glow hover:scale-105 transition"
          >
            <Users className="w-4 h-4" /> Explore & Join Communities
          </Link>
        </div>
      )}

      {/* QR Ticket Pass Modal */}
      <QRCodeTicketModal
        isOpen={!!qrModalEvent}
        onClose={() => setQrModalEvent(null)}
        event={qrModalEvent}
        student={user}
      />
    </div>
  );
};

export default EventsPage;
