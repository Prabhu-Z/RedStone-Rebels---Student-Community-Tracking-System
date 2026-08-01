import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Trophy, Award, Medal, Crown, Star, Users, Sparkles, Building2, Globe } from 'lucide-react';

const FacultyLeaderboardPage = () => {
  const [communities, setCommunities] = useState([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState('ALL'); // 'ALL' or communityId
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommunitiesAndLeaderboard();
  }, []);

  const fetchCommunitiesAndLeaderboard = async () => {
    try {
      const commRes = await api.get('/communities');
      setCommunities(commRes.data || []);

      loadLeaderboard('ALL');
    } catch (err) {
      console.error('Error fetching faculty leaderboard:', err);
      setLoading(false);
    }
  };

  const loadLeaderboard = async (commId) => {
    setLoading(true);
    try {
      if (commId === 'ALL') {
        const res = await api.get('/leaderboard/all');
        setLeaderboard(res.data || []);
      } else {
        const res = await api.get(`/leaderboard/community/${commId}`);
        setLeaderboard(res.data || []);
      }
    } catch (err) {
      console.error('Error loading leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCommunity = (commId) => {
    setSelectedCommunityId(commId);
    loadLeaderboard(commId);
  };

  if (loading) return <LoadingSpinner label="Loading institutional student leaderboards..." />;

  const top3 = leaderboard.slice(0, 3);

  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-serif font-bold text-warmgold-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-warmgold-400" /> College-Wide Student Performance Oversight
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-white mt-1">Institutional Leaderboards</h1>
          <p className="text-xs md:text-sm text-stardustsilver-300/70 mt-1">
            Track student achievements and task points across all 30+ campus communities.
          </p>
        </div>

        {/* Dropdown Filter for Faculty */}
        <div className="flex items-center gap-2 bg-arsenic-900 px-4 py-2.5 rounded-2xl border border-white/10 self-start sm:self-auto">
          <Globe className="w-4 h-4 text-warmgold-400" />
          <select
            value={selectedCommunityId}
            onChange={(e) => handleSelectCommunity(e.target.value)}
            className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-arsenic-950 text-white">🏆 ALL COMMUNITIES (Campus Overall)</option>
            {communities.map((c) => (
              <option key={c.id} value={c.id} className="bg-arsenic-950 text-white">
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TOP 3 PODIUM */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {top3.map((st, index) => {
            let badgeBg = 'from-amber-400 to-yellow-600';
            let medalIcon = <Trophy className="w-6 h-6 text-black" />;

            if (st.rank === 2) {
              badgeBg = 'from-slate-300 to-slate-500';
              medalIcon = <Medal className="w-6 h-6 text-black" />;
            } else if (st.rank === 3) {
              badgeBg = 'from-amber-700 to-amber-900';
              medalIcon = <Award className="w-6 h-6 text-white" />;
            }

            return (
              <div key={st.studentId || index} className="glass-card p-6 rounded-3xl border border-warmgold-500/30 text-center space-y-3 relative">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr ${badgeBg} flex items-center justify-center shadow-lg">
                  {medalIcon}
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold text-white">{st.studentName}</h3>
                  <p className="text-[11px] text-stardustsilver-300/60 font-mono mt-0.5">{st.department}</p>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-1.5 font-bold text-amber-300 text-sm">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {st.points} Points Earned
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULL LEADERBOARD ROSTER TABLE */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl border border-warmgold-500/30 space-y-4">
        <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-warmgold-400" /> Student Leaderboard Roster ({leaderboard.length} Students)
        </h3>

        {leaderboard.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/15 text-warmgold-400 font-mono uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Student Code</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4 text-right">Points Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-stardustsilver-300">
                {leaderboard.map((st) => (
                  <tr key={st.studentId} className="hover:bg-white/5 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-sm text-white">#{st.rank}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{st.studentName}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-stardustsilver-300/70">{st.studentCode}</td>
                    <td className="py-3.5 px-4">{st.department}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-300 text-sm">
                      ⭐ {st.points} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-stardustsilver-300/50">No points recorded for this selection yet.</div>
        )}
      </div>
    </div>
  );
};

export default FacultyLeaderboardPage;
