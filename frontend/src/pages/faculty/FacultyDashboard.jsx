import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import ChartCard from '../../components/common/ChartCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import FacultyNaacReportModal from '../../components/reports/FacultyNaacReportModal';
import { Users, Building2, Calendar, Award, CheckCircle2, Search, ArrowRight, Send, CheckSquare, Sparkles, Clock, Check, AlertCircle, Eye, ChevronRight, BarChart3, ShieldCheck, Printer } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Link } from 'react-router-dom';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [groupedTasks, setGroupedTasks] = useState([]);
  const [allCommunities, setAllCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected Task Modal for Viewing Accepted Communities
  const [selectedGroupedTask, setSelectedGroupedTask] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showNaacModal, setShowNaacModal] = useState(false);

  // Faculty Task Broadcast Modal State
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskSubmitting, setTaskSubmitting] = useState(false);
  const [taskTargetType, setTaskTargetType] = useState('ALL'); // 'ALL' or specific community ID
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    targetYear: 'ALL',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 23:59',
    taskType: 'COMMUNITY_TASK'
  });

  useEffect(() => {
    fetchDashboardAndTasks();
  }, []);

  const fetchDashboardAndTasks = async () => {
    try {
      const [dashRes, commRes, tasksRes] = await Promise.all([
        api.get('/dashboards/faculty'),
        api.get('/communities').catch(() => ({ data: [] })),
        api.get('/tasks/faculty/grouped').catch(() => ({ data: [] }))
      ]);

      setData(dashRes.data);
      setAllCommunities(commRes.data || []);
      setGroupedTasks(tasksRes.data || []);
    } catch (err) {
      console.error('Error fetching faculty dashboard & tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProposeFacultyTask = async (e) => {
    e.preventDefault();
    setTaskSubmitting(true);
    try {
      const facultyNameParam = encodeURIComponent(user?.name || user?.email || 'Faculty Office');
      const payload = {
        ...taskForm,
        taskType: 'COMMUNITY_TASK',
        assignedByFacultyName: user?.name || user?.email || 'Faculty Office'
      };

      if (taskTargetType === 'ALL') {
        await api.post(`/tasks/faculty/propose-all?facultyName=${facultyNameParam}`, payload);
        alert('🏛️ Task broadcast successfully to all 30+ campus communities!');
      } else {
        const commId = parseInt(taskTargetType);
        await api.post(`/tasks?communityId=${commId}`, payload);
        alert(`🏛️ Task assigned successfully to selected community!`);
      }

      setShowTaskModal(false);
      setTaskForm({
        title: '',
        description: '',
        targetYear: 'ALL',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 23:59',
        taskType: 'COMMUNITY_TASK'
      });
      fetchDashboardAndTasks();
    } catch (err) {
      console.error('Error proposing task:', err);
      alert(err.response?.data?.message || err.message || 'Failed to broadcast task proposal to coordinators.');
    } finally {
      setTaskSubmitting(false);
    }
  };

  const handleOpenDetailModal = (task) => {
    setSelectedGroupedTask(task);
    setShowDetailModal(true);
  };

  if (loading) return <LoadingSpinner label="Loading college-wide extracurricular oversight..." />;
  if (!data) return <div className="p-8 text-center text-[#D0C5AF]">Failed to load analytics dashboard.</div>;

  const COLORS = ['#F2CA50', '#954535', '#38bdf8', '#34d399', '#a78bfa'];

  const communityDistribution = data.communityDistribution || [
    { name: 'Technical & Coding', value: 12 },
    { name: 'Cultural & Arts', value: 8 },
    { name: 'Social & NSS/NCC', value: 6 },
    { name: 'Sports & Wellness', value: 5 }
  ];

  const topCommunities = data.topCommunities || [];

  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Faculty Header Banner */}
      <div className="glass-panel-apple p-6 lg:p-8 rounded-3xl border border-white/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div>
          <span className="text-xs font-bold text-[#F2CA50] uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#F2CA50]" /> College-Level Monitoring & Oversight
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-1">
            Faculty Executive Dashboard
          </h1>
          <p className="text-xs md:text-sm text-[#D0C5AF] mt-1">
            Institutional tracking across 30+ communities, task assignments, volunteer hours, and student achievements.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowTaskModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl honey-btn text-xs font-extrabold shadow-gold-glow hover:scale-105 transition"
          >
            <CheckSquare className="w-4 h-4 text-black" /> Assign Task to All Communities
          </button>
          <button
            onClick={() => setShowNaacModal(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition shadow-lg"
          >
            <ShieldCheck className="w-4 h-4 text-[#F2CA50]" /> NAAC Accreditation Report
          </button>
          <Link
            to="/faculty/analytics"
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#F2CA50]/20 text-[#F2CA50] border border-[#F2CA50]/30 font-bold text-xs hover:bg-[#F2CA50]/30 transition"
          >
            <BarChart3 className="w-4 h-4" /> Participation Analytics
          </Link>
        </div>
      </div>

      {/* Institutional Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Communities" value={data.totalCommunities || 30} icon={Building2} accentColor="gold" />
        <StatCard title="Total Enrolled Students" value={data.totalStudents || 1} icon={Users} accentColor="chestnut" />
        <StatCard title="Proposed Campus Tasks" value={groupedTasks.length} icon={CheckSquare} accentColor="stardust" />
        <StatCard title="Student Achievements" value={data.totalAchievements || 0} icon={Award} accentColor="emerald" />
      </div>

      {/* DEDICATED TABLE: FACULTY ASSIGNED COMMUNITY TASKS */}
      <div className="glass-panel-apple p-6 lg:p-8 rounded-3xl border border-white/15 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-6 h-6 text-[#F2CA50]" /> Faculty Assigned Tasks & Community Acceptance
            </h2>
            <p className="text-xs text-[#D0C5AF] mt-1">
              Click on any assigned task row to view which communities have accepted the task.
            </p>
          </div>

          <button
            onClick={() => setShowTaskModal(true)}
            className="px-4 py-2 rounded-xl bg-[#F2CA50]/20 text-[#F2CA50] border border-[#F2CA50]/30 text-xs font-bold hover:bg-[#F2CA50]/30 transition"
          >
            + Propose New Task
          </button>
        </div>

        {groupedTasks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/15 text-[#F2CA50] font-mono uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Task Title & Details</th>
                  <th className="py-3 px-4">Year & Deadline</th>
                  <th className="py-3 px-4">Community Acceptance Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-[#E2E2E8]">
                {groupedTasks.map((gt, idx) => {
                  const hasAccepted = gt.acceptedCommunitiesCount > 0;

                  return (
                    <tr
                      key={idx}
                      onClick={() => handleOpenDetailModal(gt)}
                      className="hover:bg-white/5 cursor-pointer transition group"
                    >
                      <td className="py-4 px-4">
                        <div className="font-bold text-white text-sm group-hover:text-[#F2CA50] transition">{gt.title}</div>
                        <div className="text-[11px] text-[#D0C5AF]/60 line-clamp-1 mt-0.5">{gt.description}</div>
                      </td>
                      <td className="py-4 px-4 font-mono text-[11px]">
                        <div>Target: <strong className="text-white">{gt.targetYear}</strong></div>
                        <div className="text-[#D0C5AF]/60">{gt.deadline}</div>
                      </td>
                      <td className="py-4 px-4">
                        {hasAccepted ? (
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-[11px] font-bold flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              {gt.acceptedCommunitiesCount} / {gt.totalCommunitiesTargeted} Communities Accepted
                            </span>
                          </div>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono text-[11px] font-bold flex items-center gap-1.5 inline-flex">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                            No community has accepted this task yet
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetailModal(gt);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#F2CA50]/20 text-[#F2CA50] hover:bg-[#F2CA50]/30 border border-[#F2CA50]/40 font-bold text-xs inline-flex items-center gap-1 transition"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Acceptance <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-[#D0C5AF]/50 glass-card-apple rounded-2xl border border-dashed border-white/10">
            <CheckSquare className="w-8 h-8 text-[#F2CA50]/40 mx-auto mb-2" />
            No tasks proposed yet. Click "Assign Task to All Communities" to start.
          </div>
        )}
      </div>

      {/* Visual Overview Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Community Distribution by Category" subtitle="Overview of technical, cultural, & service chapters">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={communityDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {communityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#F2CA50', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Top Active Communities" subtitle="Highest student engagement and activity">
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {topCommunities.length > 0 ? (
              topCommunities.map((comm, idx) => (
                <div key={comm.id || idx} className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:border-[#F2CA50]/40 transition">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#F2CA50]/20 text-[#F2CA50] font-mono text-[10px] flex items-center justify-center font-bold">
                        #{idx + 1}
                      </span>
                      {comm.name}
                    </div>
                    <div className="text-[10px] text-[#D0C5AF]/60 ml-7">
                      Category: {comm.category} • Coordinator: {comm.studentCoordinator || 'Assigned'}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {comm.status || 'ACTIVE'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-[#D0C5AF]/50">No communities loaded yet.</div>
            )}
          </div>
        </ChartCard>
      </div>

      {/* MODAL 1: COMMUNITY ACCEPTANCE ROSTER FOR SELECTED TASK */}
      {showDetailModal && selectedGroupedTask && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-apple max-w-3xl w-full p-6 lg:p-8 rounded-3xl border border-white/15 shadow-2xl relative max-h-[85vh] flex flex-col text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 shrink-0">
              <div>
                <h3 className="text-xl font-bold text-white">{selectedGroupedTask.title}</h3>
                <p className="text-[11px] text-[#F2CA50] font-mono">
                  Community Acceptance Breakdown ({selectedGroupedTask.acceptedCommunitiesCount} / {selectedGroupedTask.totalCommunitiesTargeted} Accepted)
                </p>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="text-white/60 hover:text-white text-lg font-bold px-2">✕</button>
            </div>

            <div className="overflow-y-auto pr-1 space-y-6 flex-1 text-xs">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-[#E2E2E8] leading-relaxed text-xs">{selectedGroupedTask.description}</div>
                <div className="flex flex-wrap gap-4 font-mono text-[11px] text-[#F2CA50] pt-1 border-t border-white/10">
                  <span>Target Year: {selectedGroupedTask.targetYear}</span>
                  <span>Deadline: {selectedGroupedTask.deadline}</span>
                  <span>Assigned By: {selectedGroupedTask.assignedByFacultyName}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Communities That Accepted The Task ({selectedGroupedTask.communityAssignments.filter(ca => ca.status !== 'PENDING' && ca.status !== 'DECLINED').length})
                </h4>

                {selectedGroupedTask.communityAssignments.filter(ca => ca.status !== 'PENDING' && ca.status !== 'DECLINED').length > 0 ? (
                  <div className="space-y-2.5">
                    {selectedGroupedTask.communityAssignments.filter(ca => ca.status !== 'PENDING' && ca.status !== 'DECLINED').map((ca) => (
                      <div key={ca.id} className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-white text-sm">{ca.communityName}</div>
                          <div className="text-[11px] text-[#D0C5AF]/70 font-mono mt-0.5">
                            Status: <strong className="text-emerald-300">{ca.status === 'COMPLETED' ? 'COMPLETED (Submitted to Admin)' : 'ASSIGNED & ACTIVE'}</strong>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-[11px] font-mono text-emerald-400 font-bold">
                            Verified Students: {ca.verifiedStudentCount} / {ca.assignedStudentCount}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-center font-mono">
                    ⚠️ No community has accepted this task yet.
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold text-[#D0C5AF] flex items-center gap-2 uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-amber-400" /> Communities Pending Review ({selectedGroupedTask.communityAssignments.filter(ca => ca.status === 'PENDING').length})
                </h4>

                {selectedGroupedTask.communityAssignments.filter(ca => ca.status === 'PENDING').length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {selectedGroupedTask.communityAssignments.filter(ca => ca.status === 'PENDING').map((ca) => (
                      <div key={ca.id} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#E2E2E8]">{ca.communityName}</span>
                        <span className="text-[10px] font-mono text-amber-400 font-bold">PENDING</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-white/5 text-[#D0C5AF]/50 text-center text-[11px]">
                    All communities have reviewed this task.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: FACULTY PROPOSE TASK MODAL */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-apple max-w-lg w-full p-6 lg:p-8 rounded-3xl border border-white/15 shadow-2xl relative text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-6 h-6 text-[#F2CA50]" />
                <div>
                  <h3 className="text-xl font-bold text-white">Assign Campus Community Task</h3>
                  <p className="text-[10px] text-[#F2CA50] uppercase tracking-widest font-mono">Propose Task to Communities</p>
                </div>
              </div>
              <button
                onClick={() => setShowTaskModal(false)}
                className="text-white/60 hover:text-white text-lg font-bold px-2"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProposeFacultyTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#D0C5AF] uppercase tracking-wider mb-1">Target Community Scope</label>
                <select
                  value={taskTargetType}
                  onChange={(e) => setTaskTargetType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white font-bold focus:outline-none focus:border-[#F2CA50]"
                >
                  <option value="ALL" className="bg-black text-white">🌐 ALL COMMUNITIES (Broadcast to All 30+ Chapters)</option>
                  {allCommunities.map(c => (
                    <option key={c.id} value={c.id} className="bg-black text-white">
                      🎯 {c.name} ({c.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#D0C5AF] uppercase tracking-wider mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="e.g. Annual Campus Environment Audit & Report"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/20 focus:outline-none focus:border-[#F2CA50]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#D0C5AF] uppercase tracking-wider mb-1">Target Student Year</label>
                <select
                  value={taskForm.targetYear}
                  onChange={(e) => setTaskForm({ ...taskForm, targetYear: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#F2CA50]"
                >
                  <option value="ALL" className="bg-black text-white">ALL YEARS (1st, 2nd, 3rd, 4th Year)</option>
                  <option value="1st Year" className="bg-black text-white">1st Year Only</option>
                  <option value="2nd Year" className="bg-black text-white">2nd Year Only</option>
                  <option value="3rd Year" className="bg-black text-white">3rd Year Only</option>
                  <option value="4th Year" className="bg-black text-white">4th Year Only</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#D0C5AF] uppercase tracking-wider mb-1">Deadline Date & Time</label>
                <input
                  type="text"
                  required
                  value={taskForm.deadline}
                  onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                  placeholder="YYYY-MM-DD 23:59"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#F2CA50]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#D0C5AF] uppercase tracking-wider mb-1">Task Description & Deliverables</label>
                <textarea
                  rows={4}
                  required
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  placeholder="Specify task instructions, proof upload requirements, and guidelines for students..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/20 focus:outline-none focus:border-[#F2CA50]"
                />
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-[#F2CA50]">
                ℹ️ <strong>Workflow:</strong> Task starts as <strong>PENDING</strong> ➔ Transitions to <strong>ASSIGNED</strong> when accepted by Coordinator ➔ Transitions to <strong>COMPLETED</strong> when Coordinator submits verified student package to Admin.
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={taskSubmitting}
                  className="px-6 py-2.5 rounded-xl honey-btn text-black font-extrabold shadow-gold-glow flex items-center gap-2 disabled:opacity-50"
                >
                  {taskSubmitting ? 'Assigning...' : 'Assign Task'} <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NAAC Accreditation Modal */}
      <FacultyNaacReportModal
        isOpen={showNaacModal}
        onClose={() => setShowNaacModal(false)}
        reportData={data}
      />
    </div>
  );
};

export default FacultyDashboard;
