import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import ChartCard from '../../components/common/ChartCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Users, Building2, Calendar, CheckSquare, Search, Sparkles, Activity, PieChart as PieChartIcon, BarChart3, AlertCircle, Info } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const AnalyticsView = () => {
  const [allCommunities, setAllCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Community Participation State
  const [selectedCommunityId, setSelectedCommunityId] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const res = await api.get('/communities');
      const list = res.data || [];
      setAllCommunities(list);

      if (list.length > 0) {
        handleSelectCommunity(list[0].id);
      }
    } catch (err) {
      console.error('Error fetching communities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCommunity = async (communityId) => {
    setSelectedCommunityId(communityId);
    setLoadingAnalytics(true);
    try {
      const res = await api.get(`/dashboards/community-analytics/${communityId}`);
      setAnalytics(res.data);
    } catch (err) {
      console.error('Error loading community analytics:', err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading all 30+ communities & participation analytics..." />;

  const COLORS = ['#34d399', '#f59e0b', '#f43f5e', '#38bdf8', '#a78bfa'];
  const PARTICIPATION_COLORS = ['#d4af37', '#475569'];

  const filteredCommunities = allCommunities.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.category && c.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Helper function to prepare chart data with fallback if all values are 0
  const prepareChartData = (data, fallbackLabel) => {
    if (!data || data.length === 0) {
      return [{ name: fallbackLabel, value: 1, isFallback: true }];
    }
    const total = data.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
    if (total === 0) {
      return [{ name: fallbackLabel, value: 1, isFallback: true }];
    }
    return data.filter((item) => Number(item.value) > 0);
  };

  const taskStatusData = analytics ? prepareChartData(analytics.taskStatusChartData, 'No Submissions Yet') : [];
  const participationRateData = analytics ? prepareChartData(analytics.participationRateChartData, 'No Member Activity Yet') : [];
  const taskTypeData = analytics ? prepareChartData(analytics.taskTypeChartData, 'No Tasks Created Yet') : [];

  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Header */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl border border-warmgold-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-serif font-bold text-warmgold-400 uppercase tracking-widest flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-warmgold-400" /> College Extracurricular Data Hub
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-white mt-1">
            Participation Analysis
          </h1>
          <p className="text-xs text-stardustsilver-300/70 mt-1">
            Click on any community below to generate real-time data charts for task completion, proof verifications, and active student member participation.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stardustsilver-300/50 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search 30+ campus communities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-arsenic-900 border border-white/15 text-xs text-white placeholder-white/30 focus:outline-none focus:border-warmgold-400"
          />
        </div>
      </div>

      {/* ALL COMMUNITIES CLICKABLE LIST */}
      <div className="glass-panel p-6 rounded-3xl border border-stardustsilver-300/15 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-sm font-bold text-warmgold-400 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-warmgold-400" /> All Campus Communities ({allCommunities.length} Total)
          </h3>
          <span className="text-[11px] font-mono text-stardustsilver-300/60">Click any community button to load real charts</span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pr-1 scrollbar-thin">
          {filteredCommunities.map((comm) => {
            const isSelected = selectedCommunityId === comm.id;
            return (
              <button
                key={comm.id}
                onClick={() => handleSelectCommunity(comm.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition shrink-0 flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-warmgold-500 to-amber-500 text-black border-warmgold-400 shadow-gold-glow scale-105 font-extrabold'
                    : 'bg-arsenic-900/80 text-stardustsilver-300 border-white/10 hover:border-warmgold-500/40 hover:text-white'
                }`}
              >
                <Building2 className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-warmgold-400'}`} />
                <span>{comm.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* REAL DATA CHARTS FOR SELECTED COMMUNITY */}
      {loadingAnalytics ? (
        <div className="p-12 text-center text-xs text-stardustsilver-300">
          <LoadingSpinner label="Calculating real community participation data & generating graphs..." />
        </div>
      ) : analytics ? (
        <div className="space-y-6">
          {/* COMMUNITY BANNER STATS */}
          <div className="glass-panel p-6 rounded-3xl border border-warmgold-500/40 bg-gradient-to-r from-warmgold-500/10 via-arsenic-900 to-chestnut-900/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-gold-glow">
            <div>
              <span className="text-[10px] font-mono text-warmgold-400 font-bold uppercase tracking-widest">
                Selected Community Data Summary
              </span>
              <h2 className="font-serif text-3xl font-extrabold text-white mt-1">
                {analytics.communityName}
              </h2>
              <p className="text-xs text-stardustsilver-300/80 font-mono mt-1">
                Category: {analytics.category} • Student Coordinator: {analytics.studentCoordinator || 'Assigned'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center self-stretch md:self-auto">
              <div className="p-3 rounded-2xl bg-arsenic-950/80 border border-white/10">
                <div className="text-[10px] text-stardustsilver-300/60 uppercase font-mono">Enrolled Members</div>
                <div className="font-serif text-xl font-bold text-white mt-0.5">{analytics.totalMembers}</div>
              </div>
              <div className="p-3 rounded-2xl bg-arsenic-950/80 border border-white/10">
                <div className="text-[10px] text-stardustsilver-300/60 uppercase font-mono">Tasks Assigned</div>
                <div className="font-serif text-xl font-bold text-warmgold-300 mt-0.5">{analytics.totalTasksAssigned}</div>
              </div>
              <div className="p-3 rounded-2xl bg-arsenic-950/80 border border-white/10">
                <div className="text-[10px] text-stardustsilver-300/60 uppercase font-mono">Verified Submissions</div>
                <div className="font-serif text-xl font-bold text-emerald-400 mt-0.5">{analytics.verifiedSubmissions}</div>
              </div>
              <div className="p-3 rounded-2xl bg-arsenic-950/80 border border-white/10">
                <div className="text-[10px] text-stardustsilver-300/60 uppercase font-mono">Participation Rate</div>
                <div className="font-serif text-xl font-bold text-amber-300 mt-0.5">{analytics.participationPercentage}%</div>
              </div>
            </div>
          </div>

          {/* REAL DATA CHARTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CHART 1: Real Task Submissions & Verification Breakdown (PieChart) */}
            <ChartCard title="Task Deliverables & Verification Breakdown" subtitle="Real database counts of verified, pending, & rejected proofs">
              {taskStatusData[0]?.isFallback ? (
                <div className="flex flex-col items-center justify-center p-6 text-center text-xs text-stardustsilver-300/60 space-y-2">
                  <Info className="w-8 h-8 text-warmgold-400/40" />
                  <div>No task proof submissions submitted yet for this community.</div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={taskStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      outerRadius={65}
                      stroke="#18181b"
                      strokeWidth={2}
                    >
                      {taskStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#d4af37', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                      itemStyle={{ color: '#ffffff', fontWeight: 'bold', fontSize: '12px' }}
                      labelStyle={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '12px' }}
                    />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', color: '#e2e2e8' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            {/* CHART 2: Active Member Participation Rate (PieChart) */}
            <ChartCard title="Active Member Participation Rate" subtitle="Active participating members vs inactive community members">
              {participationRateData[0]?.isFallback ? (
                <div className="flex flex-col items-center justify-center p-6 text-center text-xs text-stardustsilver-300/60 space-y-2">
                  <Info className="w-8 h-8 text-warmgold-400/40" />
                  <div>No member activity recorded yet.</div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={participationRateData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      innerRadius={40}
                      outerRadius={65}
                      stroke="#18181b"
                      strokeWidth={2}
                    >
                      {participationRateData.map((entry, index) => (
                        <Cell key={`cell-part-${index}`} fill={PARTICIPATION_COLORS[index % PARTICIPATION_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#d4af37', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                      itemStyle={{ color: '#ffffff', fontWeight: 'bold', fontSize: '12px' }}
                      labelStyle={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '12px' }}
                    />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', color: '#e2e2e8' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            {/* CHART 3: Task Type Breakdown (BarChart) */}
            <ChartCard title="Community Task Types Overview" subtitle="Faculty Community Tasks vs Coordinator Daily Tasks">
              {taskTypeData[0]?.isFallback ? (
                <div className="flex flex-col items-center justify-center p-6 text-center text-xs text-stardustsilver-300/60 space-y-2">
                  <Info className="w-8 h-8 text-warmgold-400/40" />
                  <div>No tasks created yet for this community.</div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={taskTypeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#efdecd" fontSize={11} />
                    <YAxis stroke="#efdecd" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#d4af37', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                      itemStyle={{ color: '#ffffff', fontWeight: 'bold', fontSize: '12px' }}
                      labelStyle={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '12px' }}
                    />
                    <Bar dataKey="value" fill="#d4af37" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            {/* QUICK STAT SUMMARY BOX */}
            <div className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-warmgold-400" /> Community Key Metrics Summary
                </h4>
                <p className="text-xs text-stardustsilver-300/70 mt-1">
                  Real database totals calculated live for <strong>{analytics.communityName}</strong>.
                </p>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-arsenic-900 border border-white/10 flex justify-between">
                  <span className="text-stardustsilver-300">Total Hosted Events:</span>
                  <strong className="text-white">{analytics.totalEvents} Events</strong>
                </div>
                <div className="p-3 rounded-xl bg-arsenic-900 border border-white/10 flex justify-between">
                  <span className="text-stardustsilver-300">Total Event Registrations:</span>
                  <strong className="text-purple-300">{analytics.totalEventRegistrations} Registrations</strong>
                </div>
                <div className="p-3 rounded-xl bg-arsenic-900 border border-white/10 flex justify-between">
                  <span className="text-stardustsilver-300">Total Task Submissions:</span>
                  <strong className="text-amber-300">{analytics.totalSubmissions} Submissions</strong>
                </div>
                <div className="p-3 rounded-xl bg-arsenic-900 border border-white/10 flex justify-between">
                  <span className="text-stardustsilver-300">Verified Task Proofs (+Pts):</span>
                  <strong className="text-emerald-400">{analytics.verifiedSubmissions} Verified</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AnalyticsView;
