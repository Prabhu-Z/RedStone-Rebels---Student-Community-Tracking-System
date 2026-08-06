import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import CommunityDetailModal from '../../components/common/CommunityDetailModal';
import { Search, Plus, UserCheck, Eye, KeyRound, CheckCircle2, ShieldCheck, Crown, Users } from 'lucide-react';

const AllCommunitiesView = () => {
  const [communities, setCommunities] = useState([]);
  const [staffUsers, setStaffUsers] = useState([]);
  const [allUsersList, setAllUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Roster Detail Modal State
  const [detailModal, setDetailModal] = useState(false);
  const [activeCommunity, setActiveCommunity] = useState(null);

  // Create Modal State
  const [createModal, setCreateModal] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    category: 'TECHNICAL',
    description: '',
    facultyCoordinator: 'Dr. Faculty Lead',
    studentCoordinator: 'Student Lead',
    status: 'ACTIVE',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Assign Coordinator Modal State
  const [assignModal, setAssignModal] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [communityMembersList, setCommunityMembersList] = useState([]);
  const [selectedStudentMembershipId, setSelectedStudentMembershipId] = useState('');
  const [assignData, setAssignData] = useState({
    facultyCoordinator: '',
    studentCoordinator: '',
    coordinatorUserId: '',
  });

  // Grant Coordinator Role Modal State (By Email)
  const [grantModal, setGrantModal] = useState(false);
  const [grantData, setGrantData] = useState({
    email: '',
    name: '',
    communityId: '',
  });
  const [grantSuccess, setGrantSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [commRes, staffRes, usersRes] = await Promise.all([
        api.get('/communities'),
        api.get('/users/coordinators').catch(() => ({ data: [] })),
        api.get('/users/all').catch(() => ({ data: [] })),
      ]);
      setCommunities(commRes.data || []);
      setStaffUsers(staffRes.data || []);
      setAllUsersList(usersRes.data || []);
    } catch (err) {
      console.error('Error fetching communities & staff:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to extract clean name without @mailid
  const extractOnlyName = (userObj) => {
    if (!userObj) return '';
    const nameStr = userObj.name && userObj.name.trim() ? userObj.name.trim() : '';
    
    if (nameStr && !nameStr.includes('@')) {
      return nameStr;
    }

    const emailOrName = nameStr || userObj.email || userObj.studentName || '';
    if (emailOrName.includes('@')) {
      const rawUsername = emailOrName.split('@')[0];
      return rawUsername
        .split('.')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
    }

    return emailOrName;
  };

  const handleOpenDetailModal = (community) => {
    setActiveCommunity(community);
    setDetailModal(true);
  };

  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      await api.post('/communities', newCommunity);
      setCreateModal(false);
      setNewCommunity({
        name: '',
        category: 'TECHNICAL',
        description: '',
        facultyCoordinator: 'Dr. Faculty Lead',
        studentCoordinator: 'Student Lead',
        status: 'ACTIVE',
      });
      fetchData();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create community.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenAssignModal = async (e, community) => {
    e.stopPropagation();
    setSelectedCommunity(community);
    setAssignData({
      facultyCoordinator: community.facultyCoordinator || '',
      studentCoordinator: community.studentCoordinator || '',
      coordinatorUserId: community.coordinatorUserId || '',
    });
    setSelectedStudentMembershipId('');

    // Fetch approved members of this specific community for Student Head selection
    try {
      const res = await api.get(`/memberships/community/${community.id}`);
      const approved = (res.data || []).filter(m => m.status === 'APPROVED');
      setCommunityMembersList(approved);
    } catch (err) {
      setCommunityMembersList([]);
    }

    setAssignModal(true);
  };

  const handleAssignCoordinator = async (e) => {
    e.preventDefault();
    if (!selectedCommunity) return;
    setSubmitting(true);
    try {
      const parsedUserId = assignData.coordinatorUserId ? parseInt(assignData.coordinatorUserId) : null;
      await api.put(`/communities/${selectedCommunity.id}`, {
        ...selectedCommunity,
        facultyCoordinator: assignData.facultyCoordinator,
        studentCoordinator: assignData.studentCoordinator,
        coordinatorUserId: parsedUserId,
      });

      // If a student member was chosen, promote their membership role to STUDENT_COORDINATOR!
      if (selectedStudentMembershipId) {
        await api.put(`/memberships/${selectedStudentMembershipId}/assign-leader`).catch(() => {});
      }

      setAssignModal(false);
      fetchData();
    } catch (err) {
      console.error('Failed to assign coordinator:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailInputChange = (inputEmail) => {
    const trimmed = inputEmail.trim().toLowerCase();
    const matchedUser = allUsersList.find(u => u.email?.toLowerCase() === trimmed);

    setGrantData(prev => ({
      ...prev,
      email: inputEmail,
      name: matchedUser ? extractOnlyName(matchedUser) : extractOnlyName({ email: inputEmail })
    }));
  };

  const handleGrantAccessByEmail = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setGrantSuccess('');
    setErrorMsg('');
    try {
      const payload = {
        email: grantData.email.trim(),
        name: grantData.name.trim(),
        communityId: grantData.communityId ? parseInt(grantData.communityId) : null
      };

      const res = await api.post('/users/grant-coordinator', payload);
      setGrantSuccess(res.data.message || 'Coordinator access granted successfully!');
      setGrantData({ email: '', name: '', communityId: '' });
      fetchData();
      setTimeout(() => {
        setGrantModal(false);
        setGrantSuccess('');
      }, 2000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to grant coordinator access.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading all college communities..." />;

  const filtered = communities.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  );

  // Exclude staff/coordinators who are ALREADY assigned to another community
  const assignedCoordinatorUserIds = communities
    .map(c => c.coordinatorUserId)
    .filter(Boolean);

  const availableStaffUsers = staffUsers.filter(u => {
    if (!selectedCommunity) return true;
    return !assignedCoordinatorUserIds.includes(u.id) || u.id === selectedCommunity.coordinatorUserId;
  });

  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Top Header Banner */}
      <div className="glass-panel-apple p-6 lg:p-8 rounded-3xl border border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl">
        <div>
          <span className="text-xs font-bold text-[#F2CA50] uppercase tracking-widest flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#F2CA50]" /> Faculty Governance & Oversight
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-1">All College Communities</h1>
          <p className="text-xs text-[#D0C5AF] mt-1">
            Faculty oversight, new community creation, staff role grants, and coordinator dropdown assignments.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 text-[#D0C5AF]/40 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search communities..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#F2CA50]"
            />
          </div>

          <button
            onClick={() => setGrantModal(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-[#F2CA50] font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4 text-[#F2CA50]" /> Grant Role by Email
          </button>

          <button
            onClick={() => setCreateModal(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl honey-btn text-black font-extrabold text-xs shadow-gold-glow flex items-center justify-center gap-2 hover:scale-105 transition"
          >
            <Plus className="w-4 h-4 text-black" /> Create Community
          </button>
        </div>
      </div>

      {/* Community Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((c) => (
          <div
            key={c.id}
            onClick={() => handleOpenDetailModal(c)}
            className="glass-card-apple p-6 rounded-2xl border border-white/15 space-y-4 flex flex-col justify-between cursor-pointer hover:border-[#F2CA50]/50 hover:shadow-2xl transition-all duration-300 group shadow-xl"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F2CA50]/15 text-[#F2CA50] border border-[#F2CA50]/30">
                  {c.category}
                </span>
                <Badge status={c.status}>{c.status}</Badge>
              </div>

              <h3 className="text-xl font-extrabold text-white group-hover:text-[#F2CA50] transition-colors flex items-center justify-between">
                <span>{c.name}</span>
                <Eye className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#F2CA50]" />
              </h3>
              <p className="text-xs text-[#D0C5AF]/80 line-clamp-3 leading-relaxed">{c.description}</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#D0C5AF]/70">
                <div>
                  <strong>Faculty Lead:</strong> {c.facultyCoordinator || 'Unassigned'}
                </div>
                <div>
                  <strong>Student Lead:</strong> {c.studentCoordinator || 'Unassigned'}
                </div>
                <div>
                  <strong>Active Members:</strong> <span className="text-[#F2CA50] font-bold">{c.memberCount}</span>
                </div>
                <div>
                  <strong>Upcoming Events:</strong> {c.upcomingEventCount}
                </div>
              </div>

              <button
                onClick={(e) => handleOpenAssignModal(e, c)}
                className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/15 text-[#F2CA50] border border-white/15 text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <UserCheck className="w-3.5 h-3.5" /> Assign Staff Coordinators
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Community Detail Roster Modal */}
      <CommunityDetailModal
        isOpen={detailModal}
        onClose={() => setDetailModal(false)}
        community={activeCommunity}
      />

      {/* Modal: Grant Coordinator Access By Email */}
      <Modal isOpen={grantModal} onClose={() => setGrantModal(false)} title="Grant Coordinator Role by Email">
        <form onSubmit={handleGrantAccessByEmail} className="space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[#F2CA50]">
            Grant <strong>Community Coordinator</strong> access to a registered user by entering their email address (e.g. <code>student@scts.edu</code>). Name auto-fills upon typing a registered email address.
          </div>

          {grantSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {grantSuccess}
            </div>
          )}

          {errorMsg && <div className="p-3 rounded-lg bg-rose-950/50 text-rose-300 text-xs font-bold">{errorMsg}</div>}

          <div>
            <label className="block text-xs font-bold text-[#D0C5AF] mb-1">Coordinator Email Address *</label>
            <input
              type="email"
              required
              value={grantData.email}
              onChange={(e) => handleEmailInputChange(e.target.value)}
              placeholder="e.g. student@scts.edu"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#F2CA50] font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#D0C5AF] mb-1">Coordinator Name (Only name, no email domain)</label>
            <input
              type="text"
              value={grantData.name}
              onChange={(e) => setGrantData({ ...grantData, name: e.target.value })}
              placeholder="e.g. Jack Smith"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#F2CA50]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#D0C5AF] mb-1">Assign to Community (Optional)</label>
            <select
              value={grantData.communityId}
              onChange={(e) => setGrantData({ ...grantData, communityId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#F2CA50]"
            >
              <option value="" className="bg-black text-white">-- Do not assign to a specific community yet --</option>
              {communities.map((c) => (
                <option key={c.id} value={c.id} className="bg-black text-white">
                  {c.name} ({c.category})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setGrantModal(false)}
              className="px-4 py-2 rounded-xl text-[#D0C5AF] hover:text-white text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl honey-btn text-black font-bold text-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4 text-black" />
              {submitting ? 'Granting Access...' : 'Grant Coordinator Access'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Create New Community */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Create New College Community">
        <form onSubmit={handleCreateCommunity} className="space-y-4 text-xs">
          {errorMsg && <div className="p-3 rounded-lg bg-rose-950/50 text-rose-300 text-xs font-bold">{errorMsg}</div>}

          <div>
            <label className="block text-xs font-bold text-[#D0C5AF] mb-1">Community Name *</label>
            <input
              type="text"
              required
              value={newCommunity.name}
              onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
              placeholder="e.g. Artificial Intelligence Club"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#F2CA50]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#D0C5AF] mb-1">Category *</label>
            <select
              value={newCommunity.category}
              onChange={(e) => setNewCommunity({ ...newCommunity, category: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#F2CA50]"
            >
              <option value="TECHNICAL" className="bg-black text-white">Technical & Engineering</option>
              <option value="CULTURAL" className="bg-black text-white">Cultural & Fine Arts</option>
              <option value="SPORTS" className="bg-black text-white">Sports & Athletics</option>
              <option value="SOCIAL_SERVICE" className="bg-black text-white">Social Service & NSS</option>
              <option value="ACADEMIC" className="bg-black text-white">Academic & Research</option>
              <option value="LEADERSHIP" className="bg-black text-white">Leadership & Innovation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#D0C5AF] mb-1">Description *</label>
            <textarea
              required
              rows={3}
              value={newCommunity.description}
              onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
              placeholder="Describe community objectives, activities, and membership criteria..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#F2CA50]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#D0C5AF] mb-1">Faculty Lead Name</label>
              <input
                type="text"
                value={newCommunity.facultyCoordinator}
                onChange={(e) => setNewCommunity({ ...newCommunity, facultyCoordinator: e.target.value })}
                placeholder="Dr. Faculty Lead Name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#F2CA50]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#D0C5AF] mb-1">Student Lead Name</label>
              <input
                type="text"
                value={newCommunity.studentCoordinator}
                onChange={(e) => setNewCommunity({ ...newCommunity, studentCoordinator: e.target.value })}
                placeholder="Student Lead Name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#F2CA50]"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setCreateModal(false)}
              className="px-4 py-2 rounded-xl text-[#D0C5AF] hover:text-white text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl honey-btn text-black font-bold text-xs disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Community'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Assign Staff Coordinator & Student Head */}
      <Modal
        isOpen={assignModal}
        onClose={() => setAssignModal(false)}
        title={selectedCommunity ? `Assign Leadership - ${selectedCommunity.name}` : 'Assign Leadership'}
      >
        <form onSubmit={handleAssignCoordinator} className="space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-[#F2CA50]">
            Selecting an unassigned staff member auto-fills the clean <strong>Faculty Lead Name</strong>. Selecting a student member auto-fills <strong>Student Head Name</strong> (Optional).
          </div>

          {/* 1. Unassigned Coordinators Dropdown -> Auto-fills Faculty Lead (Name Only) */}
          <div>
            <label className="block text-xs font-bold text-[#F2CA50] mb-1">
              Select Unassigned Coordinator Staff Member ({availableStaffUsers.length} Available)
            </label>
            <select
              onChange={(e) => {
                const val = e.target.value;
                if (val) {
                  const u = availableStaffUsers.find((user) => user.email === val || user.id.toString() === val);
                  if (u) {
                    const cleanName = extractOnlyName(u);
                    setAssignData(prev => ({
                      ...prev,
                      facultyCoordinator: cleanName,
                      coordinatorUserId: u.id,
                    }));
                  }
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#F2CA50] font-mono"
            >
              <option value="" className="bg-black text-white">-- Choose Available Unassigned Staff Member --</option>
              {availableStaffUsers.map((u) => (
                <option key={u.id} value={u.email} className="bg-black text-white">
                  {extractOnlyName(u)} ({u.email})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Respective Community Members Dropdown (OPTIONAL) */}
          <div>
            <label className="block text-xs font-bold text-[#F2CA50] mb-1 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-[#F2CA50]" /> Select Student Head from Community Members (Optional) ({communityMembersList.length} Enrolled)
            </label>
            <select
              onChange={(e) => {
                const memId = e.target.value;
                if (memId) {
                  const m = communityMembersList.find(mem => mem.id.toString() === memId);
                  if (m) {
                    const cleanStudentName = extractOnlyName({ name: m.studentName, email: m.studentCode });
                    setAssignData(prev => ({
                      ...prev,
                      studentCoordinator: cleanStudentName,
                    }));
                    setSelectedStudentMembershipId(m.id);
                  }
                } else {
                  setSelectedStudentMembershipId('');
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#F2CA50] font-mono"
            >
              <option value="" className="bg-black text-white">-- Choose Student Member to Promote to Head (Optional) --</option>
              {communityMembersList.map((m) => (
                <option key={m.id} value={m.id} className="bg-black text-white">
                  🎓 {extractOnlyName({ name: m.studentName, email: m.studentCode })} ({m.studentCode} - {m.department || 'Student'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#D0C5AF] mb-1">Faculty Lead / Staff Advisor (Name Only)</label>
            <input
              type="text"
              required
              value={assignData.facultyCoordinator}
              onChange={(e) => setAssignData({ ...assignData, facultyCoordinator: e.target.value })}
              placeholder="e.g. Dr. Sarah Jenkins"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#F2CA50]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#D0C5AF] mb-1">Student Coordinator / Head (Optional)</label>
            <input
              type="text"
              value={assignData.studentCoordinator}
              onChange={(e) => setAssignData({ ...assignData, studentCoordinator: e.target.value })}
              placeholder="e.g. Alex Rivera (Optional)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#F2CA50]"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setAssignModal(false)}
              className="px-4 py-2 rounded-xl text-[#D0C5AF] hover:text-white text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl honey-btn text-black font-bold text-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4 text-black" />
              {submitting ? 'Assigning Leadership...' : 'Assign Staff & Student Head'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AllCommunitiesView;
