import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { Search, UserCheck, ShieldCheck, Mail, Building2, Calendar, KeyRound, CheckCircle2 } from 'lucide-react';

const CoordinatorSearchPage = () => {
  const [coordinators, setCoordinators] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');

  // Role Edit & Community Reassign Modal State
  const [editModal, setEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [assignCommunityId, setAssignCommunityId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, commRes] = await Promise.all([
        api.get('/users/coordinators'),
        api.get('/communities'),
      ]);
      setCoordinators(userRes.data || []);
      setCommunities(commRes.data || []);
    } catch (err) {
      console.error('Error fetching coordinator data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    // Find community assigned to this user if any
    const assignedComm = communities.find((c) => c.coordinatorUserId === user.id);
    setAssignCommunityId(assignedComm ? assignedComm.id.toString() : '');
    setEditModal(true);
  };

  const handleReassignCommunity = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    setSubmitting(true);
    setSuccessMsg('');
    try {
      if (assignCommunityId) {
        const comm = communities.find((c) => c.id.toString() === assignCommunityId);
        if (comm) {
          await api.put(`/communities/${comm.id}`, {
            ...comm,
            coordinatorUserId: selectedUser.id,
            studentCoordinator: selectedUser.email,
          });
        }
      }
      setSuccessMsg(`Successfully updated coordinator assignments for ${selectedUser.email}`);
      fetchData();
      setTimeout(() => {
        setEditModal(false);
        setSuccessMsg('');
      }, 1800);
    } catch (err) {
      console.error('Error reassigning coordinator:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading staff & community coordinators directory..." />;

  const filteredCoordinators = coordinators.filter((user) => {
    const matchesQuery =
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase());
    const matchesRole = selectedRole === 'ALL' || user.role === selectedRole;
    return matchesQuery && matchesRole;
  });

  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-serif font-bold text-warmgold-400 uppercase tracking-widest">
            Faculty Governance & Staff Directory
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-white mt-1">
            Coordinator Search & Staff Management
          </h1>
          <p className="text-xs text-stardustsilver-300/70 mt-1">
            Search, inspect, and manage community coordinators and staff advisors across all college chapters.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stardustsilver-300/40 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email or role..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-arsenic-900 border border-stardustsilver-300/15 text-white placeholder-almond-300/30 text-xs focus:outline-none focus:border-warmgold-500/60 font-mono"
            />
          </div>

          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-arsenic-900 border border-stardustsilver-300/15 text-white text-xs focus:outline-none focus:border-warmgold-500/60"
          >
            <option value="ALL">All Roles</option>
            <option value="ROLE_COMMUNITY_COORDINATOR">Community Coordinators</option>
            <option value="ROLE_FACULTY">Faculty Leads</option>
          </select>
        </div>
      </div>

      {/* Coordinators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCoordinators.map((u) => {
          const assignedComm = communities.find((c) => c.coordinatorUserId === u.id);
          return (
            <div
              key={u.id}
              className="glass-card p-6 rounded-2xl border border-stardustsilver-300/15 flex flex-col justify-between space-y-4 hover:border-warmgold-500/40 transition"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-warmgold-500/20 border border-warmgold-500/30 flex items-center justify-center text-warmgold-400 font-bold text-sm">
                    {u.email[0].toUpperCase()}
                  </div>
                  <Badge status={u.status}>{u.status}</Badge>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold text-white font-mono truncate">{u.email}</h3>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-chestnut-700/30 text-warmgold-400 border border-warmgold-500/20 mt-1 inline-block">
                    {u.role.replace('ROLE_', '').replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-2 pt-3 border-t border-stardustsilver-300/15 text-xs text-stardustsilver-300/80">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-warmgold-400 shrink-0" />
                    <span>
                      <strong>Assigned Community:</strong>{' '}
                      {assignedComm ? (
                        <span className="text-white font-bold">{assignedComm.name}</span>
                      ) : (
                        <span className="text-stardustsilver-300/50 italic">None</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-morning-300 shrink-0" />
                    <span className="font-mono text-[11px] truncate">{u.email}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stardustsilver-300/15">
                <button
                  onClick={() => handleOpenEditModal(u)}
                  className="w-full py-2 rounded-xl bg-arsenic-800 hover:bg-chestnut-700/40 border border-warmgold-500/30 text-warmgold-300 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <UserCheck className="w-4 h-4" /> Manage Coordinator Assignment
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Reassign Community */}
      <Modal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        title={selectedUser ? `Manage Assignment - ${selectedUser.email}` : 'Manage Coordinator'}
      >
        <form onSubmit={handleReassignCommunity} className="space-y-4">
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {successMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-almond-200 mb-1">Coordinator Email</label>
            <input
              type="text"
              disabled
              value={selectedUser?.email || ''}
              className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-950 border border-stardustsilver-300/15 text-stardustsilver-300 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-almond-200 mb-1">Assigned Community</label>
            <select
              value={assignCommunityId}
              onChange={(e) => setAssignCommunityId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-stardustsilver-300/15 text-white text-xs focus:outline-none focus:border-warmgold-500/60"
            >
              <option value="">-- No Assigned Community --</option>
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
              onClick={() => setEditModal(false)}
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
              {submitting ? 'Updating...' : 'Save Assignment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CoordinatorSearchPage;
