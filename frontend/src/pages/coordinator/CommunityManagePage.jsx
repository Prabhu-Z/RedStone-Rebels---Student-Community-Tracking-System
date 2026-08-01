import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import { Users, Edit3, Save, ShieldCheck, GraduationCap, UserMinus, Crown, UserPlus, UserCheck, Star } from 'lucide-react';

const CommunityManagePage = () => {
  const { user } = useAuth();
  const [community, setCommunity] = useState(null);
  const [members, setMembers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('leaders'); // 'leaders' or 'all'

  useEffect(() => {
    fetchCommunityAndMembers();
  }, [user]);

  const fetchCommunityAndMembers = async () => {
    try {
      const res = await api.get('/communities');
      let myCommunity = null;

      if (res.data && res.data.length > 0) {
        myCommunity =
          res.data.find(
            (c) =>
              c.coordinatorUserId === user?.id ||
              (user?.email &&
                (c.studentCoordinator?.toLowerCase().includes(user.email.toLowerCase()) ||
                  c.facultyCoordinator?.toLowerCase().includes(user.email.toLowerCase())))
          ) || res.data[0];
      }

      setCommunity(myCommunity);
      setFormData(myCommunity || {});

      if (myCommunity?.id) {
        const memRes = await api.get(`/memberships/community/${myCommunity.id}`);
        setMembers(memRes.data || []);
      }
    } catch (err) {
      console.error('Error fetching community data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/communities/${community.id}`, formData);
      setIsEditing(false);
      fetchCommunityAndMembers();
    } catch (err) {
      alert('Failed to update community details.');
    }
  };

  const handleAssignLeader = async (membershipId, studentName) => {
    try {
      await api.put(`/memberships/${membershipId}/assign-leader`);
      alert(`⭐ ${studentName} has been assigned as a Student Leader! They can now propose events.`);
      fetchCommunityAndMembers();
    } catch (err) {
      alert('Failed to assign Student Leader role.');
    }
  };

  const handleDismissLeader = async (membershipId, studentName) => {
    const confirmed = window.confirm(`Are you sure you want to dismiss ${studentName} from Student Leader role?`);
    if (!confirmed) return;

    try {
      await api.put(`/memberships/${membershipId}/dismiss-leader`);
      alert(`${studentName}'s Student Leader role has been reset to Member.`);
      fetchCommunityAndMembers();
    } catch (err) {
      alert('Failed to dismiss Student Leader.');
    }
  };

  const handleRemoveMember = async (membershipId, studentName) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${studentName} from ${community.name}? They will be removed only from this specific community.`
    );
    if (!confirmed) return;

    try {
      await api.delete(`/memberships/${membershipId}`);
      fetchCommunityAndMembers();
    } catch (err) {
      alert('Failed to remove member from community.');
    }
  };

  if (loading) return <LoadingSpinner label="Loading community information & leaders..." />;
  if (!community) return <div className="p-8 text-center text-stardustsilver-300">No community assigned to your coordinator account.</div>;

  const studentLeaders = members.filter(m => m.role === 'STUDENT_COORDINATOR' || m.role === 'EVENT_ORGANIZER' || m.role === 'TEAM_LEAD');
  const regularMembers = members.filter(m => m.role !== 'STUDENT_COORDINATOR' && m.role !== 'EVENT_ORGANIZER' && m.role !== 'TEAM_LEAD');

  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-serif font-bold text-warmgold-400 uppercase tracking-widest flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-warmgold-400" /> Community Information & Leadership Roster
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-white mt-1">{community.name}</h1>
          <p className="text-xs text-stardustsilver-300/70 mt-1">
            Manage community details, assign student leaders, and verify event proposals for {community.name}.
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-warmgold-500/20 text-warmgold-300 border border-warmgold-500/30 font-bold text-xs hover:bg-warmgold-500/30 transition self-start sm:self-auto"
        >
          <Edit3 className="w-4 h-4" /> {isEditing ? 'Cancel Editing' : 'Edit Information'}
        </button>
      </div>

      {/* Info Card */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl border border-warmgold-500/30">
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-almond-200 uppercase tracking-wider mb-1">Community Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-stardustsilver-300/15 text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-almond-200 uppercase tracking-wider mb-1">Category</label>
              <input
                type="text"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-stardustsilver-300/15 text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-almond-200 uppercase tracking-wider mb-1">Description</label>
              <textarea
                rows={4}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-stardustsilver-300/15 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-almond-200 uppercase tracking-wider mb-1">Faculty Coordinator</label>
                <input
                  type="text"
                  value={formData.facultyCoordinator || ''}
                  onChange={(e) => setFormData({ ...formData, facultyCoordinator: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-stardustsilver-300/15 text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-almond-200 uppercase tracking-wider mb-1">Student Coordinator</label>
                <input
                  type="text"
                  value={formData.studentCoordinator || ''}
                  onChange={(e) => setFormData({ ...formData, studentCoordinator: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-stardustsilver-300/15 text-white"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-chestnut-700 to-warmgold-500 text-white font-bold text-xs shadow-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-chestnut-700/30 text-warmgold-400 border border-warmgold-500/30">
                Category: {community.category}
              </span>
              <Badge status={community.status}>{community.status}</Badge>
            </div>
            <p className="text-xs text-stardustsilver-300/80 leading-relaxed pt-2">{community.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stardustsilver-300/15 text-xs text-almond-200">
              <div><strong>Faculty Lead:</strong> {community.facultyCoordinator || 'Unassigned'}</div>
              <div><strong>Student Lead:</strong> {community.studentCoordinator || 'Unassigned'}</div>
            </div>
          </div>
        )}
      </div>

      {/* Roster & Student Leaders Category Navigation Tabs */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl border border-stardustsilver-300/15 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stardustsilver-300/15 pb-4">
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6 text-warmgold-400" />
            <div>
              <h3 className="font-serif text-xl font-bold text-white">Community Roster & Leadership</h3>
              <p className="text-xs text-stardustsilver-300/60 mt-0.5">
                Assign or dismiss Student Leaders and manage approved members.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-arsenic-900/60 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('leaders')}
              className={`px-4 py-2 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeTab === 'leaders'
                  ? 'bg-gradient-to-r from-warmgold-500 to-amber-500 text-black shadow-md'
                  : 'text-stardustsilver-300 hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5" /> Student Leaders ({studentLeaders.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-warmgold-500 to-amber-500 text-black shadow-md'
                  : 'text-stardustsilver-300 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" /> All Members ({members.length})
            </button>
          </div>
        </div>

        {/* TAB 1: STUDENT LEADERS CATEGORY */}
        {activeTab === 'leaders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-warmgold-400 uppercase tracking-wider flex items-center gap-2">
                <Star className="w-4 h-4 text-warmgold-400" /> Assigned Student Leaders ({studentLeaders.length})
              </h4>
            </div>

            {studentLeaders.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {studentLeaders.map((m) => (
                  <div
                    key={m.id}
                    className="glass-card p-5 rounded-2xl border border-warmgold-500/40 bg-gradient-to-b from-warmgold-500/10 to-transparent space-y-3 flex flex-col justify-between shadow-gold-glow"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm flex items-center gap-1.5">
                          <Crown className="w-4 h-4 text-warmgold-400" /> {m.studentName}
                        </span>
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-warmgold-500 text-black">
                          STUDENT LEADER
                        </span>
                      </div>
                      <div className="text-xs font-mono text-warmgold-300">Reg #{m.studentCode}</div>
                      <div className="text-[11px] text-stardustsilver-300/80 flex items-center gap-1.5 pt-1">
                        <GraduationCap className="w-3.5 h-3.5 text-morning-300" /> {m.department}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 space-y-2">
                      <button
                        onClick={() => handleDismissLeader(m.id, m.studentName)}
                        className="w-full py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                      >
                        <UserMinus className="w-3.5 h-3.5" /> Dismiss Student Leader
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-stardustsilver-300/60 bg-arsenic-900/40 rounded-2xl border border-dashed border-stardustsilver-300/20">
                <Crown className="w-8 h-8 text-warmgold-400/40 mx-auto mb-2" />
                No Student Leaders currently assigned for {community.name}.
                <p className="text-[11px] text-stardustsilver-300/40 mt-1">Switch to "All Members" tab to assign a student as Leader.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ALL MEMBERS & ASSIGNMENT */}
        {activeTab === 'all' && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              All Approved Members ({members.length})
            </h4>

            {members.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((m) => {
                  const isLeader = m.role === 'STUDENT_COORDINATOR' || m.role === 'EVENT_ORGANIZER' || m.role === 'TEAM_LEAD';
                  return (
                    <div
                      key={m.id}
                      className={`glass-card p-4 rounded-xl border space-y-3 flex flex-col justify-between transition ${
                        isLeader ? 'border-warmgold-500/40 bg-warmgold-500/5' : 'border-stardustsilver-300/15 hover:border-warmgold-500/30'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm flex items-center gap-1">
                            {isLeader && <Crown className="w-3.5 h-3.5 text-warmgold-400" />} {m.studentName}
                          </span>
                          <Badge status={m.status}>{m.status}</Badge>
                        </div>
                        <div className="text-xs font-mono text-warmgold-400">Reg #{m.studentCode}</div>
                        <div className="text-[11px] text-stardustsilver-300/60 flex items-center gap-1.5 pt-1">
                          <GraduationCap className="w-3.5 h-3.5 text-morning-300" /> {m.department}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-stardustsilver-300/15 space-y-2">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-mono text-warmgold-300 font-bold uppercase">{m.role || 'MEMBER'}</span>
                          <span className="text-stardustsilver-300/50">{m.joinedDate ? new Date(m.joinedDate).toLocaleDateString() : 'Active'}</span>
                        </div>

                        {isLeader ? (
                          <button
                            onClick={() => handleDismissLeader(m.id, m.studentName)}
                            className="w-full py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                          >
                            <UserMinus className="w-3 h-3" /> Dismiss Leader
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAssignLeader(m.id, m.studentName)}
                            className="w-full py-1.5 rounded-xl bg-warmgold-500/20 hover:bg-warmgold-500/30 border border-warmgold-500/40 text-warmgold-300 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                          >
                            <Crown className="w-3 h-3 text-warmgold-400" /> Assign as Student Leader
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-stardustsilver-300/50">
                No registered members found for {community.name} yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityManagePage;
