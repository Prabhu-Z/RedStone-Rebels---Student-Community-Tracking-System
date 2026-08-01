import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import CommunityDetailModal from '../../components/common/CommunityDetailModal';
import { Users, Sparkles, Building2, Eye } from 'lucide-react';

const MyCommunitiesPage = () => {
  const { user } = useAuth();
  const [myMemberships, setMyMemberships] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Roster Detail Modal State
  const [detailModal, setDetailModal] = useState(false);
  const [activeCommunity, setActiveCommunity] = useState(null);

  useEffect(() => {
    fetchMyCommunities();
  }, [user]);

  const fetchMyCommunities = async () => {
    if (!user?.studentId) {
      setLoading(false);
      return;
    }
    try {
      const [memRes, commRes] = await Promise.all([
        api.get(`/students/${user.studentId}/communities`),
        api.get('/communities'),
      ]);

      // Filter ONLY APPROVED memberships
      const approvedMemberships = (memRes.data || []).filter(
        (m) => m.status === 'APPROVED' || m.status === 'ACTIVE'
      );

      setMyMemberships(approvedMemberships);
      setCommunities(commRes.data || []);
    } catch (err) {
      console.error('Error fetching student joined communities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRosterModal = (communityId, communityName, category, facultyCoord, studentCoord, description) => {
    const fullComm = communities.find((c) => c.id === communityId) || {
      id: communityId,
      name: communityName,
      category: category,
      facultyCoordinator: facultyCoord,
      studentCoordinator: studentCoord,
      description: description || 'Accepted member of college community chapter.',
      status: 'ACTIVE',
    };

    setActiveCommunity(fullComm);
    setDetailModal(true);
  };

  if (loading) return <LoadingSpinner label="Loading your accepted communities & member rosters..." />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-serif font-bold text-nebulaviolet-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-nebulaviolet-400" /> Official Chapter Membership
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-white mt-1">My Joined Communities</h1>
          <p className="text-xs text-stardustsilver-300/70 mt-1">
            College communities where your membership application has been accepted by community coordinators.
          </p>
        </div>
      </div>

      {/* Joined Communities Cards Grid */}
      {myMemberships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myMemberships.map((m) => {
            const matchedComm = communities.find((c) => c.id === m.communityId);
            const facultyLead = matchedComm?.facultyCoordinator || 'Dr. Faculty Lead';
            const studentLead = matchedComm?.studentCoordinator || 'Student Coordinator';

            return (
              <div
                key={m.id}
                onClick={() =>
                  handleOpenRosterModal(
                    m.communityId,
                    m.communityName,
                    m.communityCategory,
                    facultyLead,
                    studentLead,
                    matchedComm?.description
                  )
                }
                className="glass-card p-6 rounded-2xl border border-nebulaviolet-500/30 flex flex-col justify-between space-y-4 cursor-pointer hover:border-whiskeysour-400 hover:shadow-whiskey-hover transition-all duration-300 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-nebulaviolet-600/30 text-stardustsilver-300 border border-honeygarlic-500/30">
                      {m.communityCategory}
                    </span>
                    <Badge status={m.status}>APPROVED MEMBER</Badge>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-nebulaviolet-400 transition-colors flex items-center justify-between">
                    <span>{m.communityName}</span>
                    <Eye className="w-4 h-4 text-nebulaviolet-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>

                  <div className="text-[11px] font-mono text-nebulaviolet-300">
                    Role in Community: <strong>{m.role || 'MEMBER'}</strong>
                  </div>

                  {/* Staff & Coordinators Preview */}
                  <div className="space-y-1.5 pt-3 border-t border-stardustsilver-300/15 text-xs text-stardustsilver-300/70">
                    <div className="flex items-center justify-between text-[11px]">
                      <span>Faculty Advisor:</span>
                      <strong className="text-white font-serif">{facultyLead}</strong>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span>Student Coordinator:</span>
                      <strong className="text-white font-serif">{studentLead}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stardustsilver-300/15">
                  <button className="w-full py-2.5 rounded-xl bg-voidcosmos-700/50 hover:bg-nebulaviolet-600/30 border border-nebulaviolet-500/30 text-stardustsilver-300 font-bold text-xs flex items-center justify-center gap-2 transition">
                    <Users className="w-4 h-4 text-nebulaviolet-400" /> View Coordinators & All Members Roster
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-2xl border border-stardustsilver-300/15 text-center space-y-3">
          <Building2 className="w-10 h-10 text-stardustsilver-300/30 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-white">No Accepted Community Memberships Yet</h3>
          <p className="text-xs text-stardustsilver-300/60 max-w-md mx-auto">
            Once your membership application is accepted by a community coordinator, your joined community will appear here with its full coordinator leadership and member roster.
          </p>
        </div>
      )}

      {/* Community Detail & Full Roster Modal */}
      <CommunityDetailModal
        isOpen={detailModal}
        onClose={() => setDetailModal(false)}
        community={activeCommunity}
      />
    </div>
  );
};

export default MyCommunitiesPage;
