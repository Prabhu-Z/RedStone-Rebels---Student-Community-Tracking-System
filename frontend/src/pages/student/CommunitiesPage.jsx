import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import CommunityDetailModal from '../../components/common/CommunityDetailModal';
import { Users, PlusCircle, Search, Eye, ShieldAlert, Sparkles } from 'lucide-react';

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

  if (loading) return <LoadingSpinner label="Loading all 30+ college communities..." />;

  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Header Banner with Apple Glassmorphism */}
      <div className="glass-panel-apple p-6 lg:p-8 rounded-3xl border border-white/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div>
          <span className="text-xs font-bold text-[#F2CA50] uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#F2CA50]" /> Official Campus Directory
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-1">Explore Campus Communities</h1>
          <p className="text-xs text-[#D0C5AF] mt-1">
            Browse 30+ official student chapters, view leadership rosters, and apply for membership.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D0C5AF]/50" />
          <input
            type="text"
            placeholder="Search communities by name or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#F2CA50]"
          />
        </div>
      </div>

      {user?.role === 'ROLE_COMMUNITY_COORDINATOR' && (
        <div className="glass-panel-apple p-4 rounded-2xl border border-[#F2CA50]/30 flex items-center gap-3 text-xs text-[#F2CA50]">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 text-[#F2CA50]" />
          <span>
            <strong>Coordinator Restriction:</strong> As a Community Coordinator, you are dedicated to coordinating 1 community only and cannot apply to join other communities.
          </span>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap border ${
              categoryFilter === cat
                ? 'bg-gradient-to-r from-[#F2CA50] to-amber-500 text-black border-[#F2CA50] shadow-gold-glow font-extrabold'
                : 'bg-white/5 text-[#E2E2E8] border-white/10 hover:border-[#F2CA50]/40 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
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
              className="glass-card-apple p-6 rounded-2xl border border-white/15 flex flex-col justify-between cursor-pointer hover:border-[#F2CA50]/60 hover:shadow-2xl transition-all duration-300 group shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F2CA50]/15 text-[#F2CA50] border border-[#F2CA50]/30">
                    {c.category}
                  </span>
                  <span className="text-xs text-[#D0C5AF]/70 flex items-center gap-1 font-mono">
                    <Users className="w-3.5 h-3.5 text-[#F2CA50]" /> {c.memberCount} Members
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-white group-hover:text-[#F2CA50] transition-colors flex items-center justify-between">
                  <span>{c.name}</span>
                  <Eye className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#F2CA50]" />
                </h3>
                <p className="text-xs text-[#D0C5AF]/80 line-clamp-3 leading-relaxed">{c.description}</p>

                <div className="text-[11px] text-[#D0C5AF]/60 pt-2 border-t border-white/10 space-y-0.5">
                  <div>
                    <strong>Faculty Coordinator:</strong> {c.facultyCoordinator || 'Unassigned'}
                  </div>
                  <div>
                    <strong>Student Coordinator:</strong> {c.studentCoordinator || 'Unassigned'}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                {isCoordinator ? (
                  <div className="w-full py-2 rounded-xl bg-white/5 text-[#D0C5AF]/60 border border-white/10 text-[11px] font-medium text-center">
                    Coordinators Manage 1 Community Only
                  </div>
                ) : membership ? (
                  <Badge status={membership.status}>
                    {membership.status}: {membership.role}
                  </Badge>
                ) : (
                  <button
                    onClick={(e) => handleJoin(e, c.id)}
                    className="w-full py-2.5 rounded-xl honey-btn text-xs font-bold flex items-center justify-center gap-2 shadow-md"
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
