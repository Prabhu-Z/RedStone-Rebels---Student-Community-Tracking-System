import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { CheckSquare, Link2, Upload, FileText, CheckCircle2, Clock, XCircle, ExternalLink, Users, Sparkles, Calendar, AlertCircle } from 'lucide-react';

const StudentTasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [userMemberships, setUserMemberships] = useState([]);
  const [loading, setLoading] = useState(true);

  // Category & Status Filter States
  const [taskTypeFilter, setTaskTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Submission Modal State
  const [submitModal, setSubmitModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [proofLink, setProofLink] = useState('');
  const [proofFileName, setProofFileName] = useState('');
  const [proofFileUrl, setProofFileUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    fetchTasksAndMemberships();
  }, [user]);

  const fetchTasksAndMemberships = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      let studentIdParam = user?.studentId || user?.id;
      let approvedMems = [];

      try {
        const memRes = await api.get(`/memberships/student/${studentIdParam}`);
        approvedMems = (memRes.data || []).filter(m => m.status === 'APPROVED');
      } catch (e) {
        if (user?.id) {
          const uMemRes = await api.get(`/memberships/user/${user.id}`).catch(() => ({ data: [] }));
          approvedMems = (uMemRes.data || []).filter(m => m.status === 'APPROVED');
        }
      }

      setUserMemberships(approvedMems);

      const res = await api.get(`/tasks/student/${studentIdParam}`).catch(() => ({ data: [] }));
      setTasks(res.data || []);
    } catch (err) {
      console.error('Error fetching student tasks & memberships:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSubmitModal = (task) => {
    setSelectedTask(task);
    setProofLink(task.proofLink || '');
    setProofFileName(task.proofFileName || '');
    setProofFileUrl(task.proofFileUrl || '');
    setSuccessMsg('');
    setValidationError('');
    setSubmitModal(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofFileName(file.name);
      const fakeUrl = URL.createObjectURL(file);
      setProofFileUrl(fakeUrl);
      setValidationError('');
    }
  };

  const handleSubmitProof = async (e) => {
    e.preventDefault();
    if (!selectedTask) return;

    // Proof Validation Check
    if (!proofLink.trim() && !proofFileName && !proofFileUrl) {
      setValidationError('⚠️ Submission Blocked: You must provide a Proof URL/Link OR upload a proof photo/document before submitting.');
      return;
    }

    setSubmitting(true);
    setSuccessMsg('');
    setValidationError('');
    try {
      await api.post(`/tasks/submissions/${selectedTask.id}/submit`, {
        proofLink: proofLink.trim(),
        proofFileName: proofFileName,
        proofFileUrl: proofFileUrl,
      });
      setSuccessMsg('Task proof submitted! Deliverable updated.');
      setTimeout(() => {
        setSubmitModal(false);
        setSuccessMsg('');
        fetchTasksAndMemberships();
      }, 1500);
    } catch (err) {
      alert('Failed to submit task proof.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading assigned tasks and deliverables..." />;

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;

    if (taskTypeFilter === 'COMMUNITY_TASK') {
      return t.taskType === 'COMMUNITY_TASK' || t.assignedByFacultyName != null;
    }
    if (taskTypeFilter === 'DAILY_TASK') {
      return t.taskType === 'DAILY_TASK' || t.assignedByFacultyName == null;
    }

    return true;
  });

  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Header Banner */}
      <div className="glass-panel-apple p-6 lg:p-8 rounded-3xl border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xl">
        <div>
          <span className="text-xs font-bold text-[#F2CA50] uppercase tracking-widest flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-[#F2CA50]" /> Deliverables & Proof Submissions
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-1">My Assigned Tasks</h1>
          <p className="text-xs text-[#D0C5AF] mt-1">
            Earn <strong>+1 Point</strong> for every verified task completion on your community leaderboard!
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 self-start sm:self-auto overflow-x-auto">
          <button
            onClick={() => setTaskTypeFilter('COMMUNITY_TASK')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              taskTypeFilter === 'COMMUNITY_TASK'
                ? 'bg-gradient-to-r from-[#F2CA50] to-amber-500 text-black shadow-gold-glow font-extrabold'
                : 'text-[#D0C5AF] hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> 🏛️ Community Tasks
          </button>

          <button
            onClick={() => setTaskTypeFilter('DAILY_TASK')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              taskTypeFilter === 'DAILY_TASK'
                ? 'bg-gradient-to-r from-[#F2CA50] to-amber-500 text-black shadow-gold-glow font-extrabold'
                : 'text-[#D0C5AF] hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> 📅 Daily Tasks
          </button>

          <button
            onClick={() => setTaskTypeFilter('ALL')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              taskTypeFilter === 'ALL'
                ? 'bg-gradient-to-r from-[#F2CA50] to-amber-500 text-black shadow-gold-glow font-extrabold'
                : 'text-[#D0C5AF] hover:text-white'
            }`}
          >
            All ({tasks.length})
          </button>
        </div>
      </div>

      {/* Status Filter Sub-Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs text-[#D0C5AF]/60 font-semibold mr-1">Filter Status:</span>
          {['ALL', 'PENDING', 'SUBMITTED', 'VERIFIED', 'REJECTED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                statusFilter === tab
                  ? 'bg-white/15 text-[#F2CA50] border border-[#F2CA50]/40'
                  : 'text-[#D0C5AF]/60 hover:text-white bg-white/5 border border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards Grid */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((t) => {
            const isCommunityTask = t.taskType === 'COMMUNITY_TASK' || t.assignedByFacultyName != null;

            return (
              <div
                key={t.id}
                className="glass-card-apple p-6 rounded-2xl border border-white/15 flex flex-col justify-between space-y-4 hover:border-[#F2CA50]/40 transition group shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      isCommunityTask ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                    }`}>
                      {isCommunityTask ? '🏛️ Community Task' : '📅 Daily Task'}
                    </span>
                    <Badge status={t.status}>{t.status}</Badge>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#F2CA50] transition">{t.taskTitle}</h3>
                  <p className="text-xs text-[#D0C5AF]/80 leading-relaxed line-clamp-3 font-sans">{t.taskDescription}</p>

                  <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs text-[#D0C5AF]/80">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#F2CA50]" />
                      <span>
                        Deadline: <strong className="text-white">{t.deadline}</strong>
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#D0C5AF]/60 font-mono">
                      <span>Community: {t.communityName}</span>
                      <span className="text-amber-300 font-bold">+1 Pt</span>
                    </div>
                  </div>

                  {/* Submitted Proof Details */}
                  {t.status !== 'PENDING' && (
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
                      <div className="text-[10px] text-[#F2CA50] font-semibold uppercase tracking-wider">
                        Submitted Proof Details:
                      </div>
                      {t.proofLink && (
                        <a
                          href={t.proofLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#F2CA50] underline font-mono text-[11px] truncate flex items-center gap-1"
                        >
                          <Link2 className="w-3 h-3 text-[#F2CA50]" /> {t.proofLink} <ExternalLink className="w-3 h-3 inline" />
                        </a>
                      )}
                      {t.proofFileName && (
                        <div className="text-[#D0C5AF] text-[11px] font-mono flex items-center gap-1">
                          <FileText className="w-3 h-3 text-[#D0C5AF]" /> {t.proofFileName}
                        </div>
                      )}
                      {t.status === 'REJECTED' && t.rejectionReason && (
                        <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-300 text-[11px] mt-1">
                          <strong>Reason:</strong> {t.rejectionReason}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/10">
                  {t.status === 'PENDING' && (
                    <button
                      onClick={() => handleOpenSubmitModal(t)}
                      className="w-full py-2.5 rounded-xl honey-btn text-xs font-bold shadow-md flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4 text-black" /> Submit Task Proof
                    </button>
                  )}
                  {t.status === 'SUBMITTED' && (
                    <button
                      onClick={() => handleOpenSubmitModal(t)}
                      className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                    >
                      <Upload className="w-4 h-4 text-[#F2CA50]" /> Update Submitted Proof
                    </button>
                  )}
                  {t.status === 'VERIFIED' && (
                    <div className="py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Verified (+1 Pt Awarded)
                    </div>
                  )}
                  {t.status === 'REJECTED' && (
                    <button
                      onClick={() => handleOpenSubmitModal(t)}
                      className="w-full py-2.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 font-bold text-xs flex items-center justify-center gap-2 transition"
                    >
                      <XCircle className="w-4 h-4 text-rose-400" /> Resubmit Task Proof
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel-apple p-12 rounded-3xl border border-dashed border-white/20 text-center space-y-4 shadow-xl">
          <CheckSquare className="w-10 h-10 text-[#F2CA50]/40 mx-auto" />
          <div>
            <h3 className="text-lg font-bold text-white">No Tasks Matching Filter ({statusFilter})</h3>
            <p className="text-xs text-[#D0C5AF]/60 mt-1 max-w-md mx-auto">
              Tasks assigned by your Community Coordinator appear strictly after joining that community!
            </p>
          </div>
        </div>
      )}

      {/* Modal: Task Submission */}
      <Modal
        isOpen={submitModal}
        onClose={() => setSubmitModal(false)}
        title={selectedTask ? `Submit Proof - ${selectedTask.taskTitle}` : 'Submit Task Proof'}
      >
        <form onSubmit={handleSubmitProof} className="space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <div className="font-bold text-white text-sm">{selectedTask?.taskTitle}</div>
            <div className="text-[#D0C5AF] leading-relaxed text-xs">{selectedTask?.taskDescription}</div>
            <div className="text-[#F2CA50] font-mono text-[11px] pt-1">Deadline: {selectedTask?.deadline}</div>
          </div>

          {validationError && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" /> {validationError}
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {successMsg}
            </div>
          )}

          {/* Proof Link Input */}
          <div>
            <label className="block font-semibold text-[#D0C5AF] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-[#F2CA50]" /> Proof URL / Link (GitHub, Google Drive, Project Demo)
            </label>
            <input
              type="url"
              value={proofLink}
              onChange={(e) => {
                setProofLink(e.target.value);
                setValidationError('');
              }}
              placeholder="https://github.com/my-project or https://drive.google.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#F2CA50] font-mono"
            />
          </div>

          {/* Proof File Attachment */}
          <div>
            <label className="block font-semibold text-[#D0C5AF] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-[#F2CA50]" /> Upload Proof Screenshot / Photo / PDF
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-[#D0C5AF] text-xs file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#F2CA50]/20 file:text-[#F2CA50] hover:file:bg-[#F2CA50]/30"
            />
            {proofFileName && (
              <div className="mt-1.5 text-xs text-[#F2CA50] flex items-center gap-1 font-mono">
                <FileText className="w-3.5 h-3.5" /> Selected File: {proofFileName}
              </div>
            )}
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setSubmitModal(false)}
              className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl honey-btn text-black font-bold text-xs shadow-lg flex items-center gap-1.5 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              {submitting ? 'Submitting...' : 'Submit Task Proof'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentTasksPage;
