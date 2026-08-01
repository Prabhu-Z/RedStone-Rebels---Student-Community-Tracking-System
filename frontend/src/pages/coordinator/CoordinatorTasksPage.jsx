import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { CheckSquare, Plus, Calendar, Clock, Users, Link2, FileText, CheckCircle2, ShieldCheck, ExternalLink, Eye, XCircle, Sparkles, Building2, Send, Check } from 'lucide-react';

const CoordinatorTasksPage = () => {
  const { user } = useAuth();
  const [community, setCommunity] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [pendingFacultyTasks, setPendingFacultyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('faculty'); // 'faculty' or 'active'

  // Create Task Modal State
  const [createModal, setCreateModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    targetYear: 'ALL',
    deadline: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Review Submissions Modal State
  const [reviewModal, setReviewModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  useEffect(() => {
    fetchCommunityAndTasks();
  }, [user]);

  const fetchCommunityAndTasks = async () => {
    try {
      const commRes = await api.get('/communities');
      let myCommunity = null;

      if (commRes.data && commRes.data.length > 0) {
        myCommunity =
          commRes.data.find(
            (c) =>
              c.coordinatorUserId === user?.id ||
              (user?.email &&
                (c.studentCoordinator?.toLowerCase().includes(user.email.toLowerCase()) ||
                  c.facultyCoordinator?.toLowerCase().includes(user.email.toLowerCase())))
          ) || commRes.data[0];
      }

      setCommunity(myCommunity);

      if (myCommunity?.id) {
        const taskRes = await api.get(`/tasks/community/${myCommunity.id}`);
        setTasks(taskRes.data || []);

        const pendingRes = await api.get(`/tasks/community/${myCommunity.id}/pending-faculty`);
        setPendingFacultyTasks(pendingRes.data || []);
      }
    } catch (err) {
      console.error('Error fetching coordinator tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptFacultyTask = async (taskId, title) => {
    try {
      await api.put(`/tasks/${taskId}/accept`);
      alert(`✅ Community Task "${title}" accepted! Eligible community students can submit proofs.`);
      fetchCommunityAndTasks();
    } catch (err) {
      alert('Failed to accept task.');
    }
  };

  const handleRejectFacultyTask = async (taskId, title) => {
    const confirmed = window.confirm(`Decline faculty task proposal "${title}"?`);
    if (!confirmed) return;

    try {
      await api.put(`/tasks/${taskId}/reject`);
      alert(`Task proposal "${title}" declined.`);
      fetchCommunityAndTasks();
    } catch (err) {
      alert('Failed to decline task.');
    }
  };

  const handleSubmitTaskToAdmin = async (taskId, title) => {
    const confirmed = window.confirm(`Submit final completed task package for "${title}" to Admin / Faculty? The status will be marked as COMPLETED.`);
    if (!confirmed) return;

    try {
      await api.put(`/tasks/${taskId}/submit-to-admin`);
      alert(`🎉 Community Task "${title}" has been successfully submitted to Admin / Faculty! Status marked as COMPLETED.`);
      fetchCommunityAndTasks();
    } catch (err) {
      alert('Failed to submit task to admin.');
    }
  };

  const handleCreateDailyTask = async (e) => {
    e.preventDefault();
    if (!community?.id) return;
    setSubmitting(true);
    try {
      await api.post(`/tasks?communityId=${community.id}`, newTask);
      alert('📅 Daily Task assigned to community members! Verified strictly by coordinator (No submission to admin needed).');
      setCreateModal(false);
      setNewTask({ title: '', description: '', targetYear: 'ALL', deadline: '' });
      fetchCommunityAndTasks();
    } catch (err) {
      alert('Failed to assign daily task.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenReviewModal = async (task) => {
    setSelectedTask(task);
    setReviewModal(true);
    setLoadingSubmissions(true);
    try {
      const res = await api.get(`/tasks/${task.id}/submissions`);
      setSubmissions(res.data || []);
    } catch (err) {
      console.error('Error fetching task submissions:', err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleVerifySubmission = async (submissionId) => {
    try {
      await api.put(`/tasks/submissions/${submissionId}/verify`);
      if (selectedTask) {
        const res = await api.get(`/tasks/${selectedTask.id}/submissions`);
        setSubmissions(res.data || []);
      }
      fetchCommunityAndTasks();
    } catch (err) {
      alert('Verification failed.');
    }
  };

  const handleRejectSubmission = async (submissionId) => {
    const reason = window.prompt(
      'Enter the reason for rejecting this task submission:',
      'Insufficient proof or invalid files attached.'
    );
    if (reason === null) return;

    try {
      await api.put(`/tasks/submissions/${submissionId}/reject`, { rejectionReason: reason });
      if (selectedTask) {
        const res = await api.get(`/tasks/${selectedTask.id}/submissions`);
        setSubmissions(res.data || []);
      }
      fetchCommunityAndTasks();
    } catch (err) {
      alert('Failed to reject submission.');
    }
  };

  if (loading) return <LoadingSpinner label="Loading community task assignments..." />;

  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-serif font-bold text-warmgold-400 uppercase tracking-widest flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-warmgold-400" /> {community?.name || 'Community'} Workspace
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-white mt-1">Task Assignments & Verification</h1>
          <p className="text-xs text-stardustsilver-300/70 mt-1">
            Manage 🏛️ <strong>Community Tasks</strong> (Faculty ➔ Coordinator ➔ Students) & 📅 <strong>Daily Tasks</strong> (Coordinator ➔ Students).
          </p>
        </div>

        <button
          onClick={() => setCreateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-chestnut-700 to-warmgold-500 text-white font-bold text-xs shadow-lg hover:scale-105 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Daily Task
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-stardustsilver-300/15 pb-4">
        <button
          onClick={() => setActiveTab('faculty')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'faculty'
              ? 'bg-gradient-to-r from-warmgold-500 to-amber-500 text-black shadow-gold-glow'
              : 'bg-arsenic-900 text-stardustsilver-300 hover:text-white border border-white/10'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Faculty Community Task Proposals ({pendingFacultyTasks.length})
        </button>

        <button
          onClick={() => setActiveTab('active')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'active'
              ? 'bg-gradient-to-r from-warmgold-500 to-amber-500 text-black shadow-gold-glow'
              : 'bg-arsenic-900 text-stardustsilver-300 hover:text-white border border-white/10'
          }`}
        >
          <CheckSquare className="w-4 h-4" /> Active Tasks ({tasks.length})
        </button>
      </div>

      {/* TAB 1: FACULTY COMMUNITY TASKS (PENDING ACCEPTANCE) */}
      {activeTab === 'faculty' && (
        <div className="space-y-6">
          {pendingFacultyTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingFacultyTasks.map((task) => (
                <div
                  key={task.id}
                  className="glass-card p-6 rounded-2xl border border-warmgold-500/40 bg-gradient-to-b from-warmgold-500/10 to-transparent flex flex-col justify-between space-y-4 shadow-gold-glow"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono flex items-center gap-1">
                        🏛️ Faculty Community Task
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-warmgold-500 text-black">
                        ACTION REQUIRED
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-white">{task.title}</h3>
                    {task.assignedByFacultyName && (
                      <p className="text-xs text-warmgold-300 font-mono font-bold">
                        Assigned by: {task.assignedByFacultyName}
                      </p>
                    )}

                    <div className="p-3 rounded-xl bg-arsenic-900/80 border border-white/10 text-xs text-stardustsilver-300/90 leading-relaxed">
                      {task.description}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-stardustsilver-300/80 pt-2">
                      <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-warmgold-400" /> <strong>Deadline:</strong> {task.deadline}</div>
                      <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-warmgold-400" /> <strong>Target:</strong> {task.targetYear}</div>
                    </div>
                  </div>

                  {/* Accept / Decline Action Buttons */}
                  <div className="pt-4 border-t border-white/15 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleRejectFacultyTask(task.id, task.title)}
                      className="py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                    >
                      <XCircle className="w-4 h-4 text-rose-400" /> Decline Task
                    </button>
                    <button
                      onClick={() => handleAcceptFacultyTask(task.id, task.title)}
                      className="py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-extrabold shadow-lg flex items-center justify-center gap-1.5 transition"
                    >
                      <CheckCircle2 className="w-4 h-4 text-white" /> Accept & Publish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-stardustsilver-300/60 glass-panel rounded-3xl border border-dashed border-stardustsilver-300/20">
              <Sparkles className="w-10 h-10 text-warmgold-400/40 mx-auto mb-3" />
              No pending faculty task proposals for {community?.name || 'your community'} at this time.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ACTIVE TASKS (COMMUNITY TASKS & DAILY TASKS) */}
      {activeTab === 'active' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map((task) => {
            const isCommunityTask = task.taskType === 'COMMUNITY_TASK' || task.assignedByFacultyName != null;

            return (
              <div key={task.id} className="glass-card p-6 rounded-2xl border border-stardustsilver-300/15 flex flex-col justify-between hover:border-warmgold-500/30 transition space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      isCommunityTask ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                    }`}>
                      {isCommunityTask ? '🏛️ Community Task (Faculty)' : '📅 Daily Task (Coordinator)'}
                    </span>
                    <Badge status={task.status}>{task.status}</Badge>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-white">{task.title}</h3>
                  {task.assignedByFacultyName && (
                    <p className="text-[11px] text-warmgold-400 font-mono">Faculty: {task.assignedByFacultyName}</p>
                  )}
                  <p className="text-xs text-stardustsilver-300/70 leading-relaxed">{task.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-stardustsilver-300/80 pt-3 border-t border-stardustsilver-300/15">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-warmgold-400" /> Deadline: <span className="font-bold text-white">{task.deadline}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono">
                      <Users className="w-3.5 h-3.5 text-emerald-400" /> Submissions: <strong className="text-emerald-300">{task.verifiedStudentCount || 0} / {task.assignedStudentCount} Verified</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stardustsilver-300/15 space-y-2">
                  <button
                    onClick={() => handleOpenReviewModal(task)}
                    className="w-full py-2.5 rounded-xl bg-warmgold-500/20 hover:bg-warmgold-500/30 border border-warmgold-500/40 text-warmgold-300 font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <Eye className="w-4 h-4 text-warmgold-400" /> Review Student Proofs ({task.assignedStudentCount})
                  </button>

                  {/* ONLY COMMUNITY TASKS HAVE "Submit Completed Package to Admin" BUTTON */}
                  {isCommunityTask && (
                    task.status !== 'COMPLETED' ? (
                      <button
                        onClick={() => handleSubmitTaskToAdmin(task.id, task.title)}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-extrabold text-xs shadow-lg hover:scale-[1.02] transition flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" /> Submit Completed Task Package to Admin
                      </button>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold text-center border border-emerald-500/30 flex items-center justify-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-400" /> Submitted to Admin (COMPLETED)
                      </div>
                    )
                  )}

                  {!isCommunityTask && (
                    <div className="p-2 text-[11px] text-stardustsilver-300/60 text-center italic font-mono border border-white/5 rounded-xl bg-white/5">
                      ℹ️ Daily Task: Verified strictly by Coordinator (+1 Pt awarded per verified student).
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* REVIEW SUBMISSIONS MODAL */}
      {reviewModal && selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-3xl w-full p-6 lg:p-8 rounded-3xl border border-warmgold-500/40 shadow-2xl relative max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 shrink-0">
              <div>
                <h3 className="font-serif text-xl font-bold text-white">{selectedTask.title}</h3>
                <p className="text-[11px] text-warmgold-400 font-mono">
                  {selectedTask.taskType === 'COMMUNITY_TASK' ? '🏛️ Faculty Community Task' : '📅 Coordinator Daily Task'} - Student Roster
                </p>
              </div>
              <button onClick={() => setReviewModal(false)} className="text-white/60 hover:text-white text-lg font-bold px-2">✕</button>
            </div>

            {loadingSubmissions ? (
              <div className="p-8 text-center text-xs text-stardustsilver-300"><LoadingSpinner label="Fetching student submissions..." /></div>
            ) : submissions.length > 0 ? (
              <div className="overflow-y-auto pr-1 space-y-3 flex-1">
                {submissions.map((sub) => (
                  <div key={sub.id} className="glass-card p-4 rounded-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{sub.studentName}</span>
                        <span className="text-[10px] font-mono text-warmgold-400">({sub.studentCode})</span>
                        <Badge status={sub.status}>{sub.status}</Badge>
                      </div>

                      {sub.proofLink && (
                        <div className="text-xs text-stardustsilver-300/80 flex items-center gap-1.5 pt-1">
                          <Link2 className="w-3.5 h-3.5 text-warmgold-400" />
                          <a href={sub.proofLink} target="_blank" rel="noreferrer" className="text-warmgold-300 hover:underline flex items-center gap-1">
                            {sub.proofLink} <ExternalLink className="w-3 h-3 inline" />
                          </a>
                        </div>
                      )}

                      {sub.proofFileName && (
                        <div className="text-[11px] text-stardustsilver-300/60 font-mono flex items-center gap-1">
                          <FileText className="w-3 h-3 text-stardustsilver-300" /> File: {sub.proofFileName}
                        </div>
                      )}

                      {sub.rejectionReason && (
                        <div className="text-[10px] text-rose-400 font-mono pt-1">Reason: {sub.rejectionReason}</div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                      {sub.status === 'SUBMITTED' && (
                        <>
                          <button
                            onClick={() => handleVerifySubmission(sub.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-bold transition flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve (+1 Pt)
                          </button>
                          <button
                            onClick={() => handleRejectSubmission(sub.id)}
                            className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-bold transition flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </>
                      )}
                      {sub.status === 'VERIFIED' && <span className="text-xs text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Verified (+1 Pt)</span>}
                      {sub.status === 'PENDING' && <span className="text-xs text-stardustsilver-300/50 font-mono">Not Submitted Yet</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-stardustsilver-300/60">No submissions found for this task.</div>
            )}
          </div>
        </div>
      )}

      {/* CREATE NEW DAILY TASK MODAL */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Assign New Coordinator Daily Task">
        <form onSubmit={handleCreateDailyTask} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-almond-200 uppercase tracking-wider mb-1">Daily Task Title</label>
            <input
              type="text"
              required
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="e.g. Daily LeetCode Problem Solving & Submission"
              className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-stardustsilver-300/15 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-almond-200 uppercase tracking-wider mb-1">Target Student Year</label>
              <select
                value={newTask.targetYear}
                onChange={(e) => setNewTask({ ...newTask, targetYear: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-stardustsilver-300/15 text-white"
              >
                <option value="ALL">ALL YEARS (1st, 2nd, 3rd, 4th Year)</option>
                <option value="1st Year">1st Year Only</option>
                <option value="2nd Year">2nd Year Only</option>
                <option value="3rd Year">3rd Year Only</option>
                <option value="4th Year">4th Year Only</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-almond-200 uppercase tracking-wider mb-1">Deadline</label>
              <input
                type="text"
                required
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                placeholder="2026-08-15 23:59"
                className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-stardustsilver-300/15 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-almond-200 uppercase tracking-wider mb-1">Task Description & Guidelines</label>
            <textarea
              rows={4}
              required
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Detail daily task instructions, proof upload requirements..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-stardustsilver-300/15 text-white"
            />
          </div>

          <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-[11px] text-sky-300 font-mono">
            ℹ️ <strong>Daily Task Rule:</strong> Assigned to community members and verified strictly by Coordinator (+1 Pt awarded). Does not require submission to Admin.
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-chestnut-700 to-warmgold-500 text-white font-bold text-xs shadow-lg disabled:opacity-50"
          >
            {submitting ? 'Assigning Task...' : 'Assign Daily Task to Members'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default CoordinatorTasksPage;
