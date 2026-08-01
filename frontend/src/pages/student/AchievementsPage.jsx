import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import { Award, Trophy, Star, Medal } from 'lucide-react';

const AchievementsPage = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.studentId) return;
    const fetchAchievements = async () => {
      try {
        const res = await api.get(`/achievements/student/${user.studentId}`);
        setAchievements(res.data);
      } catch (err) {
        console.error('Error fetching achievements:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, [user]);

  if (loading) return <LoadingSpinner label="Loading official achievements..." />;

  return (
    <div className="space-y-8 p-4 lg:p-8">
      <div>
        <h1 className="font-serif text-3xl font-extrabold text-white">Verified Achievements & Honors</h1>
        <p className="text-xs text-stardustsilver-300/70 mt-1">Official awards, hackathon ranks, best volunteer honors, and leadership titles.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((ach) => (
          <div key={ach.id} className="glass-card p-6 rounded-2xl border border-warmgold-500/20 space-y-4 hover:border-warmgold-500/40 transition">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-warmgold-500/20 border border-warmgold-500/30 flex items-center justify-center text-warmgold-400">
                <Trophy className="w-5 h-5" />
              </div>
              <Badge status={ach.achievementType}>{ach.achievementType}</Badge>
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-white">{ach.title}</h3>
              <p className="text-xs text-warmgold-400 font-serif mt-0.5">{ach.communityName}</p>
            </div>

            <p className="text-xs text-stardustsilver-300/80 leading-relaxed">{ach.description}</p>

            <div className="pt-3 border-t border-stardustsilver-300/15 flex items-center justify-between text-[11px] text-stardustsilver-300/60 font-mono">
              <span>Awarded Date:</span>
              <span className="text-warmgold-400">{ach.achievementDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsPage;
