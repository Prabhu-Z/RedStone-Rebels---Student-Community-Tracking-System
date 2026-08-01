import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import CommunityDetailModal from '../../components/common/CommunityDetailModal';
import { Users, PlusCircle, Search, Eye, ShieldAlert } from 'lucide-react';

const CommunitiesPage = () => {
  const { user } = useAuth();
  const [communities, setCommunities] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Community Roster Modal State
  const [detailModal, setDetailModal] = useState(false);
  const [activeCommunity, setActiveCommunity] = useState(null);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [commRes, memRes] = await Promise.all([
        api.get('/communities'),
        user?.studentId ? api.get(`/students/${user.studentId}/communities`) : Promise.resolve({ data: [] }),
      ]);
      setCommunities(commRes.data);
      setMemberships(memRes.data);
    } catch (err) {
      console.error('Error fetching communities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e, communityId) => {
    e.stopPropagation();
    if (!user?.studentId) {
      alert('Student record not found.');
      return;
    }
    if (user?.role === 'ROLE_COMMUNITY_COORDINATOR') {
      alert('Community Coordinators are restricted to coordinating a single community and cannot join other communities.');
      return;
    }
    try {
      await api.post(`/memberships?studentId=${user.studentId}&communityId=${communityId}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit membership request.');
    }
  };

  const handleOpenDetailModal = (community) => {
    setActiveCommunity(community);
    setDetailModal(true);
  };

  const isMemberOrRequested = (communityId) => {
    return memberships.find((m) => m.communityId === communityId);
  };

  const filtered = communities.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['ALL', 'Technical', 'Cultural', 'Social & Outreach', 'Sports & Fitness'];

  if (loading) return <LoadingSpinner label="Loading all college communities..." />;

  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-extrabold text-white">Explore All College Communities</h1>
        <p className="text-xs text-stardustsilver-300/70 mt-1">
          Browse 30+ official student chapters, view leadership rosters, and apply for membership.
        </p>
      </div>

      {user?.role === 'ROLE_COMMUNITY_COORDINATOR' && (
        <div className="glass-panel p-4 rounded-xl border border-warmgold-500/30 flex items-center gap-3 text-xs text-warmgold-300">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 text-warmgold-400" />
          <span>
            <strong>Coordinator Restriction:</strong> As a Community Coordinator, you are dedicated to coordinating 1 community only and cannot apply to join other communities.
          </span>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stardustsilver-300/50" />
          <input
            type="text"
            placeholder="Search communities by name or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-arsenic-900 border border-stardustsilver-300/15 text-white text-xs focus:outline-none focus:border-warmgold-500/60"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-arsenic-900 rounded-xl border border-stardustsilver-300/15">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-warmgold-500 text-arsenic-950 shadow-md'
                  : 'text-stardustsilver-300/70 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((c) => {
          const membership = isMemberOrRequested(c.id);
          const isCoordinator = user?.role === 'ROLE_COMMUNITY_COORDINATOR';

          return (
            <div
              key={c.id}
              onClick={() => handleOpenDetailModal(c)}
              className="glass-card p-6 rounded-2xl border border-stardustsilver-300/15 flex flex-col justify-between cursor-pointer hover:border-warmgold-500/50 hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-chestnut-700/30 text-warmgold-400 border border-warmgold-500/20">
                    {c.category}
                  </span>
                  <span className="text-xs text-stardustsilver-300/60 flex items-center gap-1 font-mono">
                    <Users className="w-3.5 h-3.5 text-morning-300" /> {c.memberCount} Members
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-white group-hover:text-warmgold-400 transition-colors flex items-center justify-between">
                  <span>{c.name}</span>
                  <Eye className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-warmgold-400" />
                </h3>
                <p className="text-xs text-stardustsilver-300/70 line-clamp-3 leading-relaxed">{c.description}</p>

                <div className="text-[11px] text-stardustsilver-300/60 pt-2 border-t border-stardustsilver-300/15">
                  <div>
                    <strong>Faculty Coordinator:</strong> {c.facultyCoordinator || 'Unassigned'}
                  </div>
                  <div>
                    <strong>Student Coordinator:</strong> {c.studentCoordinator || 'Unassigned'}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stardustsilver-300/15 flex items-center justify-between">
                {isCoordinator ? (
                  <div className="w-full py-2 rounded-xl bg-arsenic-800 text-stardustsilver-300/60 border border-stardustsilver-300/15 text-[11px] font-medium text-center">
                    Coordinators Manage 1 Community Only
                  </div>
                ) : membership ? (
                  <Badge status={membership.status}>
                    {membership.status}: {membership.role}
                  </Badge>
                ) : (
                  <button
                    onClick={(e) => handleJoin(e, c.id)}
                    className="w-full py-2.5 rounded-xl bg-warmgold-500/20 hover:bg-warmgold-500/30 border border-warmgold-500/40 text-warmgold-300 font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <PlusCircle className="w-4 h-4" /> Request Membership
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Community Detail Roster Modal */}
      <CommunityDetailModal
        isOpen={detailModal}
        onClose={() => setDetailModal(false)}
        community={activeCommunity}
      />
    </div>
  );
};

export default CommunitiesPage;
