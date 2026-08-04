import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import ChartCard from '../../components/common/ChartCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Users, Building2, Calendar, CheckSquare, Search, Sparkles, Activity, Download, Info } from 'lucide-react';
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

  const handleExportCSV = () => {
    if (!analytics) return;
    const headers = ["Metric", "Value"];
    const rows = [
      ["Community Name", analytics.communityName],
      ["Category", analytics.category],
      ["Total Members", analytics.totalMembers],
      ["Tasks Assigned", analytics.totalTasksAssigned],
      ["Total Submissions", analytics.totalSubmissions],
      ["Verified Submissions", analytics.verifiedSubmissions],
      ["Participation Percentage", `${analytics.participationPercentage}%`],
      ["Total Events", analytics.totalEvents],
      ["Total Event Registrations", analytics.totalEventRegistrations],
    ];

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${analytics.communityName.replace(/\s+/g, "_")}_Participation_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <LoadingSpinner label="Loading all 30+ communities & participation analytics..." />;

  const COLORS = ['#34d399', '#f59e0b', '#f43f5e', '#38bdf8', '#a78bfa'];
  const PARTICIPATION_COLORS = ['#F2CA50', '#475569'];

  const filteredCommunities = allCommunities.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.category && c.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
      {/* Apple Glass Header */}
      <div className="glass-panel-apple p-6 lg:p-8 rounded-3xl border border-white/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div>
          <span className="text-xs font-bold text-[#F2CA50] uppercase tracking-widest flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#F2CA50]" /> College Extracurricular Data Hub
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            Participation Analysis
          </h1>
          <p className="text-xs text-[#D0C5AF] mt-1">
            Select any community below to view real-time data charts for task completion, proof verifications, and active student participation.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#D0C5AF]/50 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search 30+ campus communities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#F2CA50]"
          />
        </div>
      </div>

      {/* ALL COMMUNITIES CLICKABLE LIST */}
      <div className="glass-panel-apple p-6 rounded-3xl border border-white/15 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#F2CA50] uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#F2CA50]" /> All Campus Communities ({allCommunities.length} Total)
          </h3>
          <span className="text-[11px] font-mono text-[#D0C5AF]/60">Click any community button to load real charts</span>
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
                    ? 'bg-gradient-to-r from-[#F2CA50] to-amber-500 text-black border-[#F2CA50] shadow-gold-glow scale-105 font-extrabold'
                    : 'bg-white/5 text-[#E2E2E8] border-white/10 hover:border-[#F2CA50]/40 hover:text-white'
                }`}
              >
                <Building2 className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-[#F2CA50]'}`} />
                <span>{comm.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* REAL DATA CHARTS FOR SELECTED COMMUNITY */}
      {loadingAnalytics ? (
        <div className="p-12 text-center text-xs text-[#D0C5AF]">
          <LoadingSpinner label="Calculating real community participation data & generating graphs..." />
        </div>
      ) : analytics ? (
        <div className="space-y-6">
          {/* COMMUNITY BANNER STATS */}
          <div className="glass-panel-apple p-6 rounded-3xl border border-white/15 bg-gradient-to-r from-[#F2CA50]/10 via-black to-amber-900/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
            <div>
              <span className="text-[10px] font-mono text-[#F2CA50] font-bold uppercase tracking-widest">
                Selected Community Data Summary
              </span>
              <h2 className="text-3xl font-extrabold text-white mt-1">
                {analytics.communityName}
              </h2>
              <p className="text-xs text-[#D0C5AF] font-mono mt-1">
                Category: {analytics.category} • Student Coordinator: {analytics.studentCoordinator || 'Assigned'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center self-stretch md:self-auto">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-[#D0C5AF]/60 uppercase font-mono">Enrolled Members</div>
                  <div className="text-xl font-bold text-white mt-0.5">{analytics.totalMembers}</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-[#D0C5AF]/60 uppercase font-mono">Tasks Assigned</div>
                  <div className="text-xl font-bold text-[#F2CA50] mt-0.5">{analytics.totalTasksAssigned}</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-[#D0C5AF]/60 uppercase font-mono">Verified Submissions</div>
                  <div className="text-xl font-bold text-emerald-400 mt-0.5">{analytics.verifiedSubmissions}</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-[#D0C5AF]/60 uppercase font-mono">Participation Rate</div>
                  <div className="text-xl font-bold text-amber-300 mt-0.5">{analytics.participationPercentage}%</div>
                </div>
              </div>

              <button
                onClick={handleExportCSV}
                className="px-4 py-3 rounded-xl honey-btn text-xs font-bold flex items-center gap-2 shrink-0 shadow-lg"
              >
                <Download className="w-4 h-4" /> Download CSV Report
              </button>
            </div>
          </div>

          {/* REAL DATA CHARTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CHART 1: Real Task Submissions & Verification Breakdown (PieChart) */}
            <ChartCard title="Task Deliverables & Verification Breakdown" subtitle="Real database counts of verified, pending, & rejected proofs">
              {taskStatusData[0]?.isFallback ? (
                <div className="flex flex-col items-center justify-center p-6 text-center text-xs text-[#D0C5AF]/60 space-y-2">
                  <Info className="w-8 h-8 text-[#F2CA50]/40" />
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
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#F2CA50', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                      itemStyle={{ color: '#ffffff', fontWeight: 'bold', fontSize: '12px' }}
                      labelStyle={{ color: '#F2CA50', fontWeight: 'bold', fontSize: '12px' }}
                    />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', color: '#e2e2e8' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            {/* CHART 2: Active Member Participation Rate (PieChart) */}
            <ChartCard title="Active Member Participation Rate" subtitle="Active participating members vs inactive community members">
              {participationRateData[0]?.isFallback ? (
                <div className="flex flex-col items-center justify-center p-6 text-center text-xs text-[#D0C5AF]/60 space-y-2">
                  <Info className="w-8 h-8 text-[#F2CA50]/40" />
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
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#F2CA50', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                      itemStyle={{ color: '#ffffff', fontWeight: 'bold', fontSize: '12px' }}
                      labelStyle={{ color: '#F2CA50', fontWeight: 'bold', fontSize: '12px' }}
                    />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', color: '#e2e2e8' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            {/* CHART 3: Task Type Breakdown (BarChart) */}
            <ChartCard title="Community Task Types Overview" subtitle="Faculty Community Tasks vs Coordinator Daily Tasks">
              {taskTypeData[0]?.isFallback ? (
                <div className="flex flex-col items-center justify-center p-6 text-center text-xs text-[#D0C5AF]/60 space-y-2">
                  <Info className="w-8 h-8 text-[#F2CA50]/40" />
                  <div>No tasks created yet for this community.</div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={taskTypeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#efdecd" fontSize={11} />
                    <YAxis stroke="#efdecd" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#F2CA50', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                      itemStyle={{ color: '#ffffff', fontWeight: 'bold', fontSize: '12px' }}
                      labelStyle={{ color: '#F2CA50', fontWeight: 'bold', fontSize: '12px' }}
                    />
                    <Bar dataKey="value" fill="#F2CA50" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            {/* QUICK STAT SUMMARY BOX */}
            <div className="glass-card-apple p-6 rounded-3xl border border-white/15 flex flex-col justify-between space-y-4 shadow-xl">
              <div>
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#F2CA50]" /> Community Key Metrics Summary
                </h4>
                <p className="text-xs text-[#D0C5AF] mt-1">
                  Real database totals calculated live for <strong>{analytics.communityName}</strong>.
                </p>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between">
                  <span className="text-[#D0C5AF]">Total Hosted Events:</span>
                  <strong className="text-white">{analytics.totalEvents} Events</strong>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between">
                  <span className="text-[#D0C5AF]">Total Event Registrations:</span>
                  <strong className="text-purple-300">{analytics.totalEventRegistrations} Registrations</strong>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between">
                  <span className="text-[#D0C5AF]">Total Task Submissions:</span>
                  <strong className="text-amber-300">{analytics.totalSubmissions} Submissions</strong>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between">
                  <span className="text-[#D0C5AF]">Verified Task Proofs (+Pts):</span>
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
