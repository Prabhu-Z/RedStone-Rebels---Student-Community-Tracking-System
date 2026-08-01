import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import CommunityDetailModal from '../../components/common/CommunityDetailModal';
import { Search, Plus, UserCheck, Eye, KeyRound, CheckCircle2 } from 'lucide-react';

const AllCommunitiesView = () => {
  const [communities, setCommunities] = useState([]);
  const [staffUsers, setStaffUsers] = useState([]);
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
      const [commRes, staffRes] = await Promise.all([
        api.get('/communities'),
        api.get('/users/coordinators').catch(() => ({ data: [] })),
      ]);
      setCommunities(commRes.data);
      setStaffUsers(staffRes.data || []);
    } catch (err) {
      console.error('Error fetching communities & staff:', err);
    } finally {
      setLoading(false);
    }
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

  const handleOpenAssignModal = (e, community) => {
    e.stopPropagation();
    setSelectedCommunity(community);
    setAssignData({
      facultyCoordinator: community.facultyCoordinator || '',
      studentCoordinator: community.studentCoordinator || '',
      coordinatorUserId: community.coordinatorUserId || '',
    });
    setAssignModal(true);
  };

  const handleAssignCoordinator = async (e) => {
    e.preventDefault();
    if (!selectedCommunity) return;
    setSubmitting(true);
    try {
      await api.put(`/communities/${selectedCommunity.id}`, {
        ...selectedCommunity,
        facultyCoordinator: assignData.facultyCoordinator,
        studentCoordinator: assignData.studentCoordinator,
        coordinatorUserId: assignData.coordinatorUserId ? Long(assignData.coordinatorUserId) : null,
      });
      setAssignModal(false);
      fetchData();
    } catch (err) {
      console.error('Failed to assign coordinator:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGrantAccessByEmail = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setGrantSuccess('');
    setErrorMsg('');
    try {
      const res = await api.post('/users/grant-coordinator', grantData);
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

  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-extrabold text-white">All College Communities</h1>
          <p className="text-xs text-stardustsilver-300/70 mt-1">
            Faculty oversight, new community creation, staff role grants, and coordinator dropdown assignments.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 text-stardustsilver-300/40 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search communities..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-arsenic-900 border border-stardustsilver-300/15 text-white placeholder-almond-300/30 text-xs focus:outline-none focus:border-warmgold-500/60"
            />
          </div>

          <button
            onClick={() => setGrantModal(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-liver-700 to-chestnut-700 border border-warmgold-500/30 text-warmgold-300 font-bold text-xs shadow-lg hover:border-warmgold-400 transition flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4 text-warmgold-400" /> Grant Role by Email
          </button>

          <button
            onClick={() => setCreateModal(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-chestnut-700 to-warmgold-500 text-white font-bold text-xs shadow-lg hover:shadow-warmgold-500/20 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Community
          </button>
        </div>
      </div>

      {/* Community Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((c) => (
          <div
            key={c.id}
            onClick={() => handleOpenDetailModal(c)}
            className="glass-card p-6 rounded-2xl border border-stardustsilver-300/15 space-y-4 flex flex-col justify-between cursor-pointer hover:border-warmgold-500/50 hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-chestnut-700/30 text-warmgold-400 border border-warmgold-500/20">
                  {c.category}
                </span>
                <Badge status={c.status}>{c.status}</Badge>
              </div>

              <h3 className="font-serif text-xl font-bold text-white group-hover:text-warmgold-400 transition-colors flex items-center justify-between">
                <span>{c.name}</span>
                <Eye className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-warmgold-400" />
              </h3>
              <p className="text-xs text-stardustsilver-300/70 line-clamp-3 leading-relaxed">{c.description}</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-stardustsilver-300/15">
              <div className="grid grid-cols-2 gap-2 text-[11px] text-stardustsilver-300/60">
                <div>
                  <strong>Faculty Lead:</strong> {c.facultyCoordinator || 'Unassigned'}
                </div>
                <div>
                  <strong>Student Lead:</strong> {c.studentCoordinator || 'Unassigned'}
                </div>
                <div>
                  <strong>Active Members:</strong> <span className="text-warmgold-400 font-bold">{c.memberCount}</span>
                </div>
                <div>
                  <strong>Upcoming Events:</strong> {c.upcomingEventCount}
                </div>
              </div>

              <button
                onClick={(e) => handleOpenAssignModal(e, c)}
                className="w-full py-2 rounded-xl bg-arsenic-800/80 hover:bg-chestnut-700/40 text-warmgold-400 border border-warmgold-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
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
        <form onSubmit={handleGrantAccessByEmail} className="space-y-4">
          <div className="p-3.5 rounded-xl bg-warmgold-500/10 border border-warmgold-500/30 text-xs text-warmgold-300">
            Grant <strong>Community Coordinator</strong> access to a registered user by entering their email address (e.g. <code>student@scts.edu</code>). The target user must already have a registered SCTS account.
          </div>

          {grantSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {grantSuccess}
            </div>
          )}

          {errorMsg && <div className="p-3 rounded-lg bg-chestnut-900/50 text-red-300 text-xs">{errorMsg}</div>}

          <div>
            <label className="block text-xs font-medium text-almond-200 mb-1">Coordinator Email Address *</label>
            <input
              type="email"
              required
              value={grantData.email}
              onChange={(e) => setGrantData({ ...grantData, email: e.target.value })}
              placeholder="e.g. student@scts.edu"
              className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-stardustsilver-300/15 text-white text-xs focus:outline-none focus:border-warmgold-500/60 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-almond-200 mb-1">Coordinator Staff / Lead Name (Optional)</label>
            <input
              type="text"
              value={grantData.name}
              onChange={(e) => setGrantData({ ...grantData, name: e.target.value })}
              placeholder="e.g. Jack Smith"
              className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-stardustsilver-300/15 text-white text-xs focus:outline-none focus:border-warmgold-500/60"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-almond-200 mb-1">Assign to Community (Optional)</label>
            <select
              value={grantData.communityId}
              onChange={(e) => setGrantData({ ...grantData, communityId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-stardustsilver-300/15 text-white text-xs focus:outline-none focus:border-warmgold-500/60"
            >
              <option value="">-- Do not assign to a specific community yet --</option>
              {communities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.category})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setGrantModal(false)}
              className="px-4 py-2 rounded-xl text-stardustsilver-300 hover:text-white text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-warmgold-500 text-arsenic-950 font-bold text-xs hover:bg-warmgold-400 transition flex items-center gap-1.5"
            >
              <KeyRound className="w-4 h-4" />
              {submitting ? 'Granting Access...' : 'Grant Coordinator Access'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Create New Community */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Create New College Community">
        <form onSubmit={handleCreateCommunity} className="space-y-4">
          {errorMsg && <div className="p-3 rounded-lg bg-chestnut-900/50 text-red-300 text-xs">{errorMsg}</div>}

          <div>
            <label className="block text-xs font-medium text-almond-200 mb-1">Community Name *</label>
            <input
              type="text"
              required
              value={newCommunity.name}
              onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
              placeholder="e.g. Artificial Intelligence Club"
              className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-stardustsilver-300/15 text-white text-xs focus:outline-none focus:border-warmgold-500/60"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-almond-200 mb-1">Category *</label>
            <select
              value={newCommunity.category}
              onChange={(e) => setNewCommunity({ ...newCommunity, category: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-stardustsilver-300/15 text-white text-xs focus:outline-none focus:border-warmgold-500/60"
            >
              <option value="TECHNICAL">Technical & Engineering</option>
              <option value="CULTURAL">Cultural & Fine Arts</option>
              <option value="SPORTS">Sports & Athletics</option>
              <option value="SOCIAL_SERVICE">Social Service & NSS</option>
              <option value="ACADEMIC">Academic & Research</option>
              <option value="LEADERSHIP">Leadership & Innovation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-almond-200 mb-1">Description *</label>
            <textarea
              required
              rows={3}
              value={newCommunity.description}
              onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
              placeholder="Describe community objectives, activities, and membership criteria..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-stardustsilver-300/15 text-white text-xs focus:outline-none focus:border-warmgold-500/60"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-almond-200 mb-1">Select / Write Faculty Lead</label>
              <input
                type="text"
                value={newCommunity.facultyCoordinator}
                onChange={(e) => setNewCommunity({ ...newCommunity, facultyCoordinator: e.target.value })}
                placeholder="Dr. Faculty Lead Name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-stardustsilver-300/15 text-white text-xs focus:outline-none focus:border-warmgold-500/60"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-almond-200 mb-1">Select / Write Student Lead</label>
              <input
                type="text"
                value={newCommunity.studentCoordinator}
                onChange={(e) => setNewCommunity({ ...newCommunity, studentCoordinator: e.target.value })}
                placeholder="Student Lead Name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-stardustsilver-300/15 text-white text-xs focus:outline-none focus:border-warmgold-500/60"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setCreateModal(false)}
              className="px-4 py-2 rounded-xl text-stardustsilver-300 hover:text-white text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-warmgold-500 text-arsenic-950 font-bold text-xs hover:bg-warmgold-400 transition"
            >
              {submitting ? 'Creating...' : 'Create Community'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Assign Staff Coordinator (With Dropdown List) */}
      <Modal
        isOpen={assignModal}
        onClose={() => setAssignModal(false)}
        title={selectedCommunity ? `Assign Staff Coordinator - ${selectedCommunity.name}` : 'Assign Coordinator'}
      >
        <form onSubmit={handleAssignCoordinator} className="space-y-4">
          <div className="p-3 rounded-xl bg-arsenic-900 border border-warmgold-500/30 text-xs text-stardustsilver-300">
            Select a registered coordinator or faculty staff from the dropdown list, or enter custom details.
          </div>

          {/* Registered Coordinators Dropdown */}
          {staffUsers.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-warmgold-400 mb-1">
                Select from Registered Coordinator Staff Dropdown
              </label>
              <select
                onChange={(e) => {
                  const val = e.target.value;
                  if (val) {
                    const u = staffUsers.find((user) => user.email === val || user.id.toString() === val);
                    if (u) {
                      setAssignData({
                        ...assignData,
                        studentCoordinator: u.email,
                        coordinatorUserId: u.id,
                      });
                    }
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-950 border border-warmgold-500/40 text-white text-xs focus:outline-none focus:border-warmgold-400 font-mono"
              >
                <option value="">-- Choose Registered Staff Member --</option>
                {staffUsers.map((u) => (
                  <option key={u.id} value={u.email}>
                    {u.email} ({u.role.replace('ROLE_', '')})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-almond-200 mb-1">Faculty Lead / Staff Advisor</label>
            <input
              type="text"
              required
              value={assignData.facultyCoordinator}
              onChange={(e) => setAssignData({ ...assignData, facultyCoordinator: e.target.value })}
              placeholder="e.g. Dr. Sarah Jenkins (Prof. CSE)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-stardustsilver-300/15 text-white text-xs focus:outline-none focus:border-warmgold-500/60"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-almond-200 mb-1">Student Coordinator / Head</label>
            <input
              type="text"
              required
              value={assignData.studentCoordinator}
              onChange={(e) => setAssignData({ ...assignData, studentCoordinator: e.target.value })}
              placeholder="e.g. Alex Rivera (coordinator@scts.edu)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-stardustsilver-300/15 text-white text-xs focus:outline-none focus:border-warmgold-500/60 font-mono"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setAssignModal(false)}
              className="px-4 py-2 rounded-xl text-stardustsilver-300 hover:text-white text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-warmgold-500 text-arsenic-950 font-bold text-xs hover:bg-warmgold-400 transition flex items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" />
              {submitting ? 'Updating...' : 'Assign Staff Coordinators'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AllCommunitiesView;
