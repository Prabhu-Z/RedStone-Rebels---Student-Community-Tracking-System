import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Trophy, Award, Medal, Crown, Star, Users, CheckSquare, Sparkles, Building2, Calendar, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentLeaderboardPage = () => {
  const { user } = useAuth();
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRankInfo, setMyRankInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserCommunities();
  }, [user]);

  const fetchUserCommunities = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      let studentIdParam = user?.studentId || user?.id;
      let mems = [];

      try {
        const memRes = await api.get(`/memberships/student/${studentIdParam}`);
        mems = (memRes.data || []).filter(m => m.status === 'APPROVED');
      } catch (e) {
        if (user?.id) {
          const uMemRes = await api.get(`/memberships/user/${user.id}`).catch(() => ({ data: [] }));
          mems = (uMemRes.data || []).filter(m => m.status === 'APPROVED');
        }
      }

      setCommunities(mems);

      if (mems.length > 0) {
        setSelectedCommunity(mems[0]);
        loadLeaderboard(mems[0].communityId);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching user communities for leaderboard:', err);
      setLoading(false);
    }
  };

  const loadLeaderboard = async (communityId) => {
    setLoading(true);
    try {
      const res = await api.get(`/leaderboard/community/${communityId}`);
      const data = res.data || [];
      setLeaderboard(data);

      let studentId = user?.studentId || user?.id;
      const myEntry = data.find(
        (entry) =>
          entry.studentId === studentId ||
          (user?.email && entry.studentCode?.toLowerCase().includes(user.email.split('@')[0].toLowerCase())) ||
          (user?.name && entry.studentName?.toLowerCase() === user.name.toLowerCase())
      );

      if (myEntry) {
        setMyRankInfo(myEntry);
      } else if (data.length > 0) {
        setMyRankInfo(data[0]);
      } else {
        setMyRankInfo(null);
      }
    } catch (err) {
      console.error('Error loading community leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCommunityChange = (communityId) => {
    const found = communities.find((c) => c.communityId === Number(communityId));
    if (found) {
      setSelectedCommunity(found);
      loadLeaderboard(found.communityId);
    }
  };

  if (loading) return <LoadingSpinner label="Loading community points & leaderboard..." />;

  const top3 = leaderboard.slice(0, 3);

  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-serif font-bold text-warmgold-400 uppercase tracking-widest flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-warmgold-400" /> Community Gamification & Leaderboard
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-white mt-1">Community Leaderboard</h1>
          <p className="text-xs text-stardustsilver-300/70 mt-1">
            Earn points and climb your community leaderboard through active participation!
          </p>
        </div>

        {/* Community Dropdown Selector */}
        {communities.length > 0 && (
          <div className="flex items-center gap-2 bg-arsenic-900 px-4 py-2 rounded-2xl border border-white/10 self-start sm:self-auto">
            <Users className="w-4 h-4 text-warmgold-400" />
            <select
              value={selectedCommunity?.communityId || ''}
              onChange={(e) => handleCommunityChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              {communities.map((c) => (
                <option key={c.communityId} value={c.communityId} className="bg-arsenic-950 text-white">
                  {c.communityName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* GAMIFICATION POINT SYSTEM LEGEND BADGE */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
            <Ticket className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="text-[11px] text-stardustsilver-300/70 uppercase tracking-wider font-semibold">Event Registered</div>
            <div className="text-sm font-bold text-purple-300 font-mono">+1 Point</div>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <div className="text-[11px] text-stardustsilver-300/70 uppercase tracking-wider font-semibold">Daily Task Completed</div>
            <div className="text-sm font-bold text-sky-300 font-mono">+3 Points</div>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="text-[11px] text-stardustsilver-300/70 uppercase tracking-wider font-semibold">Community Task Completed</div>
            <div className="text-sm font-bold text-amber-300 font-mono">+5 Points</div>
          </div>
        </div>
      </div>

      {communities.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-dashed border-stardustsilver-300/20 text-center space-y-4">
          <Building2 className="w-12 h-12 text-warmgold-400/40 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-white">Not Enrolled in Any Community Yet</h3>
          <p className="text-xs text-stardustsilver-300/60 max-w-md mx-auto">
            Join an active campus community to participate in community tasks, earn points, and climb your community leaderboard!
          </p>
          <Link
            to="/student/communities"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-warmgold-500 to-amber-500 text-black font-extrabold text-xs shadow-gold-glow hover:scale-105 transition"
          >
            Explore & Join Communities
          </Link>
        </div>
      ) : (
        <>
          {/* MY RANK HIGHLIGHT BANNER */}
          {myRankInfo && (
            <div className="glass-panel p-6 rounded-3xl border border-warmgold-500/40 bg-gradient-to-r from-warmgold-500/15 via-arsenic-900 to-chestnut-900/40 shadow-gold-glow flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-warmgold-500 to-amber-400 flex items-center justify-center shadow-gold-glow">
                  <Crown className="w-8 h-8 text-black" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-warmgold-400 uppercase tracking-widest">
                    Your Current Standings in {selectedCommunity?.communityName}
                  </span>
                  <h2 className="font-serif text-2xl font-extrabold text-white mt-0.5">
                    {myRankInfo.studentName}
                  </h2>
                  <p className="text-xs text-stardustsilver-300/80 font-mono">
                    Department: {myRankInfo.department} • Student Code: {myRankInfo.studentCode}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 bg-arsenic-950/80 px-6 py-3.5 rounded-2xl border border-white/10 self-stretch sm:self-auto justify-around">
                <div className="text-center">
                  <div className="text-[10px] text-stardustsilver-300/60 font-mono uppercase">Your Rank</div>
                  <div className="font-serif text-3xl font-extrabold text-warmgold-400">#{myRankInfo.rank}</div>
                </div>
                <div className="w-px h-8 bg-white/15" />
                <div className="text-center">
                  <div className="text-[10px] text-stardustsilver-300/60 font-mono uppercase">Total Points</div>
                  <div className="font-serif text-3xl font-extrabold text-amber-300 flex items-center gap-1 justify-center">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> {myRankInfo.points} <span className="text-xs font-sans text-stardustsilver-300/60">pts</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TOP 3 PODIUM */}
          {top3.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {top3.map((st, index) => {
                let badgeBg = 'from-amber-400 to-yellow-600';
                let medalIcon = <Trophy className="w-6 h-6 text-black" />;
                let borderStyle = 'border-warmgold-500/60';

                if (st.rank === 2) {
                  badgeBg = 'from-slate-300 to-slate-500';
                  medalIcon = <Medal className="w-6 h-6 text-black" />;
                  borderStyle = 'border-slate-400/40';
                } else if (st.rank === 3) {
                  badgeBg = 'from-amber-700 to-amber-900';
                  medalIcon = <Award className="w-6 h-6 text-white" />;
                  borderStyle = 'border-amber-700/40';
                }

                return (
                  <div
                    key={st.studentId || index}
                    className={`glass-card p-6 rounded-3xl border ${borderStyle} text-center space-y-3 relative overflow-hidden group hover:scale-[1.02] transition`}
                  >
                    <div className="absolute top-3 right-3 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-warmgold-300 border border-white/10">
                      RANK #{st.rank}
                    </div>

                    <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr ${badgeBg} flex items-center justify-center shadow-lg`}>
                      {medalIcon}
                    </div>

                    <div>
                      <h3 className="font-serif text-lg font-bold text-white group-hover:text-warmgold-300 transition">{st.studentName}</h3>
                      <p className="text-[11px] text-stardustsilver-300/60 font-mono mt-0.5">{st.department}</p>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-1.5 font-bold text-amber-300 text-sm">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {st.points} Points
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* FULL LEADERBOARD ROSTER TABLE */}
          <div className="glass-panel p-6 lg:p-8 rounded-3xl border border-warmgold-500/30 space-y-4">
            <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-warmgold-400" /> Full Member Leaderboard ({leaderboard.length} Members)
            </h3>

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
                    <tr
                      key={st.studentId}
                      className={`hover:bg-white/5 transition ${
                        myRankInfo?.studentId === st.studentId ? 'bg-warmgold-500/10 font-bold border-l-4 border-l-warmgold-400' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-sm text-white">
                        #{st.rank}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                        {st.studentName}
                        {myRankInfo?.studentId === st.studentId && (
                          <span className="px-2 py-0.5 rounded-full bg-warmgold-500 text-black text-[9px] font-extrabold uppercase">
                            YOU
                          </span>
                        )}
                      </td>
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
          </div>
        </>
      )}
    </div>
  );
};

export default StudentLeaderboardPage;
