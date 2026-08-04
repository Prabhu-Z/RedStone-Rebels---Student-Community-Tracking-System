import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import ChartCard from '../../components/common/ChartCard';
import Timeline from '../../components/common/Timeline';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import PrintReportModal from '../../components/reports/PrintReportModal';
import PortfolioExportModal from '../../components/common/PortfolioExportModal';
import { Users, Calendar, CheckCircle2, Award, Printer, ShieldCheck, FileDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

const getTierDetails = (points = 0) => {
  if (points >= 100) return { title: '👑 Extracurricular Legend', color: 'border-amber-400 text-amber-400 bg-amber-400/10' };
  if (points >= 61) return { title: '💎 Platinum Leader', color: 'border-cyan-400 text-cyan-400 bg-cyan-400/10' };
  if (points >= 36) return { title: '🥇 Gold Achiever', color: 'border-[#F2CA50] text-[#F2CA50] bg-[#F2CA50]/10' };
  if (points >= 16) return { title: '🥈 Silver Trailblazer', color: 'border-slate-300 text-slate-300 bg-slate-400/10' };
  return { title: '🥉 Bronze Contributor', color: 'border-amber-700 text-amber-600 bg-amber-800/10' };
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportModal, setReportModal] = useState(false);
  const [portfolioModal, setPortfolioModal] = useState(false);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchDashboard = async () => {
      try {
        const res = await api.get(`/dashboards/student/user/${user.id}`);
        setData(res.data);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user]);

  const handleOpenReport = async () => {
    if (!data?.student?.id) return;
    try {
      const res = await api.get(`/reports/student/${data.student.id}`);
      setReportData(res.data);
      setReportModal(true);
    } catch (err) {
      console.error('Error loading student report:', err);
    }
  };

  if (loading) return <LoadingSpinner label="Compiling Apple frosted glass profile..." />;
  if (!data) return <div className="p-8 text-center text-[#D0C5AF]">Failed to load dashboard data.</div>;

  const totalPoints = (data.eventsAttendedCount * 1) + (data.achievementsCount * 5);
  const tier = getTierDetails(totalPoints);

  return (
    <div className="space-y-8">
      {/* Header Banner with Apple Glassmorphism */}
      <div className="glass-panel-apple p-6 lg:p-8 rounded-3xl border border-white/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-[#F2CA50] uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Student Extracurricular Hub
            </span>
            <span className={`px-3 py-0.5 rounded-full text-[11px] font-extrabold border ${tier.color}`}>
              {tier.title}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-1">
            Welcome back, {data.student.name}!
          </h1>
          <p className="text-xs md:text-sm text-[#D0C5AF] font-medium">
            {data.student.department} • {data.student.degree} (Year {data.student.year}, Sem {data.student.semester}) • Register #{data.student.studentCode}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setPortfolioModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl honey-btn text-xs font-extrabold shadow-gold-glow"
          >
            <FileDown className="w-4 h-4" /> Export Verified Portfolio PDF
          </button>
          <button
            onClick={handleOpenReport}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/15"
          >
            <Printer className="w-4 h-4" /> Detailed Report
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Communities Joined"
          value={data.totalCommunities}
          subtitle="Active Member Roles"
          icon={Users}
          color="gold"
        />
        <StatCard
          title="Events Attended"
          value={data.eventsAttendedCount}
          subtitle={`Attendance Rate: ${data.attendancePercentage}%`}
          icon={Calendar}
          color="blue"
        />
        <StatCard
          title="Verified Volunteer Hours"
          value={`${data.totalVolunteerHours} hrs`}
          subtitle="Approved Service Logs"
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          title="Achievements & Awards"
          value={data.achievementsCount}
          subtitle={`${data.certificatesCount} Official Certificates`}
          icon={Award}
          color="chestnut"
        />
      </div>

      {/* Analytics Charts & Upcoming Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Pie Chart */}
        <ChartCard title="Event Attendance Ratio" subtitle="Attended vs Missed Registrations">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.attendanceChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
              >
                <Cell fill="#F2CA50" />
                <Cell fill="#D0C5AF" />
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#000000', borderRadius: '12px', border: '1px solid #F2CA50', color: '#E2E2E8' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Community Category Distribution */}
        <ChartCard title="Community Distribution" subtitle="Participation across categories">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.communityCategoryData}>
              <XAxis dataKey="category" stroke="#E2E2E8" fontSize={10} tickLine={false} />
              <YAxis stroke="#E2E2E8" fontSize={10} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#000000', borderRadius: '12px', border: '1px solid #F2CA50', color: '#E2E2E8' }} />
              <Bar dataKey="count" fill="#F2CA50" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Upcoming Events Box with Apple Glass Styling */}
        <div className="glass-card-apple p-6 rounded-2xl border border-white/15 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-extrabold text-[#E2E2E8]">Upcoming Events</h3>
            <span className="text-xs font-mono text-[#D0C5AF]">{data.upcomingEventsCount} Scheduled</span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-56 pr-1">
            {data.upcomingEvents && data.upcomingEvents.length > 0 ? (
              data.upcomingEvents.map((evt) => (
                <div key={evt.id} className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#F2CA50]/40 transition text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{evt.title}</span>
                    <Badge status={evt.status}>{evt.status}</Badge>
                  </div>
                  <div className="text-[#D0C5AF] mt-1 flex items-center justify-between text-[11px]">
                    <span>{evt.communityName}</span>
                    <span className="font-mono text-[#F2CA50] font-bold">{evt.eventDate}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#D0C5AF]/50 text-center py-6">No upcoming registered events.</p>
            )}
          </div>
        </div>
      </div>

      {/* Activity Timeline Section */}
      <div className="glass-panel-apple p-6 lg:p-8 rounded-3xl border border-white/15 shadow-2xl">
        <h3 className="text-2xl font-extrabold text-white mb-6">Recent Activity Timeline</h3>
        <Timeline activities={data.recentActivities} />
      </div>

      {/* Print & Portfolio Modals */}
      <PrintReportModal isOpen={reportModal} onClose={() => setReportModal(false)} reportData={reportData} />
      <PortfolioExportModal
        isOpen={portfolioModal}
        onClose={() => setPortfolioModal(false)}
        studentData={data.student}
        points={totalPoints}
        verifiedTasks={[]}
      />
    </div>
  );
};

export default StudentDashboard;
