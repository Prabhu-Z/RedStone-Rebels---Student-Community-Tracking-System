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
        <h1 className="font-sans text-3xl font-extrabold text-slate-900">Verified Achievements & Honors</h1>
        <p className="text-xs text-slate-600 mt-1">Official awards, hackathon ranks, best volunteer honors, and leadership titles.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((ach) => (
          <div key={ach.id} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 rounded-2xl border border-purple-600/20 space-y-4 hover:border-purple-200 transition">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-slate-200 flex items-center justify-center text-[#7c3aed]">
                <Trophy className="w-5 h-5" />
              </div>
              <Badge status={ach.achievementType}>{ach.achievementType}</Badge>
            </div>

            <div>
              <h3 className="font-sans text-xl font-bold text-slate-900">{ach.title}</h3>
              <p className="text-xs text-[#7c3aed] font-sans mt-0.5">{ach.communityName}</p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{ach.description}</p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Awarded Date:</span>
              <span className="text-[#7c3aed]">{ach.achievementDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsPage;
