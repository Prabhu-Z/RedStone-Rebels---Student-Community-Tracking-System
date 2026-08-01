import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import { Award, CheckCircle2, XCircle, Clock, Link2, FileText, Sparkles, UserCheck, GraduationCap } from 'lucide-react';

const CoordinatorActivityRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('PENDING'); // 'PENDING' vs 'ALL'

  // Modal / Approval State
  const [selectedReq, setSelectedReq] = useState(null);
  const [grantedPoints, setGrantedPoints] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      // Coordinator community defaults to 1 or all
      const res = await api.get('/activity-requests/community/1');
      setRequests(res.data || []);
    } catch (err) {
      console.error('Error fetching activity claims:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (e) => {
    e.preventDefault();
    if (!selectedReq) return;

    setSubmitting(true);
    try {
      await api.put(
        `/activity-requests/${selectedReq.id}/approve?points=${grantedPoints}&feedback=${encodeURIComponent(feedback)}`
      );
      alert(`✅ Approved achievement claim "${selectedReq.title}"! Awarded +${grantedPoints} Points to ${selectedReq.studentName}.`);
      setSelectedReq(null);
      fetchRequests();
    } catch (err) {
      alert('Failed to approve activity claim.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async (reqObj) => {
    const reason = window.prompt(`Provide feedback for declining "${reqObj.title}":`, 'Proof verification unsuccessful.');
    if (reason === null) return;

    try {
      await api.put(`/activity-requests/${reqObj.id}/reject?feedback=${encodeURIComponent(reason)}`);
      alert(`Decline recorded for "${reqObj.title}". Notification sent to student.`);
      fetchRequests();
    } catch (err) {
      alert('Failed to reject claim.');
    }
  };

  if (loading) return <LoadingSpinner label="Loading student activity claims..." />;

  const filteredRequests = requests.filter((r) => (activeTab === 'PENDING' ? r.status === 'PENDING' : true));

  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-serif font-bold text-warmgold-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-warmgold-400" /> Student Achievements & Gamification Point Awards
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-white mt-1">Activity Claim Approvals</h1>
          <p className="text-xs text-stardustsilver-300/70 mt-1">
            Review individual achievement claims submitted by students in your community & grant custom gamification points.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-arsenic-900/90 px-4 py-2.5 rounded-2xl border border-white/10 self-start sm:self-auto font-mono text-xs">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Pending Claims: <strong className="text-amber-300">{requests.filter((r) => r.status === 'PENDING').length} Requests</strong></span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-stardustsilver-300/15 pb-4">
        <button
          onClick={() => setActiveTab('PENDING')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'PENDING'
              ? 'bg-gradient-to-r from-warmgold-500 to-amber-500 text-black shadow-gold-glow'
              : 'bg-arsenic-900 text-stardustsilver-300 hover:text-white border border-white/10'
          }`}
        >
          <Clock className="w-4 h-4" /> Pending Evaluation ({requests.filter((r) => r.status === 'PENDING').length})
        </button>

        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'ALL'
              ? 'bg-gradient-to-r from-warmgold-500 to-amber-500 text-black shadow-gold-glow'
              : 'bg-arsenic-900 text-stardustsilver-300 hover:text-white border border-white/10'
          }`}
        >
          <Award className="w-4 h-4" /> All Claims History ({requests.length})
        </button>
      </div>

      {/* Request Grid */}
      {filteredRequests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRequests.map((r) => (
            <div
              key={r.id}
              className="glass-card p-6 rounded-2xl border border-stardustsilver-300/15 flex flex-col justify-between space-y-4 hover:border-warmgold-500/40 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-chestnut-700/30 text-warmgold-400 border border-warmgold-500/20">
                    {r.category}
                  </span>
                  <Badge status={r.status}>{r.status}</Badge>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-white border-b border-white/10 pb-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>{r.studentName}</span>
                  <span className="text-warmgold-300 font-mono text-[11px]">(Reg #{r.studentCode})</span>
                </div>

                <div>
                  <h4 className="font-serif text-lg font-bold text-white">{r.title}</h4>
                  <p className="text-xs text-stardustsilver-300/70 mt-0.5">{r.communityName}</p>
                </div>

                <p className="text-xs text-stardustsilver-300/90 leading-relaxed bg-arsenic-900/60 p-3 rounded-xl border border-white/10">
                  {r.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-stardustsilver-300/70 pt-2 border-t border-white/10">
                  <div>Requested: <strong className="text-white">{r.requestedPoints || 5} Pts</strong></div>
                  <div>Granted: <strong className="text-amber-300">{r.grantedPoints ? `+${r.grantedPoints} Pts` : 'Pending'}</strong></div>
                </div>

                {r.proofLink && (
                  <a
                    href={r.proofLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-morning-300 underline font-mono text-[11px] truncate flex items-center gap-1.5 pt-1"
                  >
                    <Link2 className="w-3.5 h-3.5" /> {r.proofLink}
                  </a>
                )}

                {r.coordinatorFeedback && (
                  <div className="p-3 rounded-xl bg-arsenic-900 border border-white/10 text-xs space-y-1">
                    <div className="text-[10px] text-warmgold-400 font-bold uppercase">Feedback Provided:</div>
                    <p className="text-stardustsilver-300/90 italic">{r.coordinatorFeedback}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons for Pending Claims */}
              {r.status === 'PENDING' && (
                <div className="pt-4 border-t border-white/15 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleReject(r)}
                    className="py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <XCircle className="w-4 h-4 text-rose-400" /> Decline Claim
                  </button>
                  <button
                    onClick={() => {
                      setSelectedReq(r);
                      setGrantedPoints(r.requestedPoints || 5);
                      setFeedback('Excellent achievement! Points awarded.');
                    }}
                    className="py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-extrabold shadow-lg flex items-center justify-center gap-1.5 transition"
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" /> Evaluate & Award Points
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center text-xs text-stardustsilver-300/60 glass-panel rounded-3xl border border-dashed border-white/15">
          <Award className="w-10 h-10 text-warmgold-400/40 mx-auto mb-3" />
          No activity requests found for this filter tab.
        </div>
      )}

      {/* EVALUATION & POINT AWARDING MODAL */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-6 lg:p-8 rounded-3xl border border-warmgold-500/40 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-warmgold-400" />
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">Award Gamification Points</h3>
                  <p className="text-[10px] text-warmgold-400 font-mono">Evaluate Achievement Claim</p>
                </div>
              </div>
              <button onClick={() => setSelectedReq(null)} className="text-white/60 hover:text-white text-lg font-bold px-2">
                ✕
              </button>
            </div>

            <form onSubmit={handleApprove} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-arsenic-900 border border-white/10 space-y-1">
                <div className="font-serif font-bold text-white text-sm">{selectedReq.title}</div>
                <div className="text-[11px] text-warmgold-300">Submitted by: {selectedReq.studentName}</div>
              </div>

              <div>
                <label className="block font-semibold text-almond-200 uppercase tracking-wider mb-1">Points to Grant</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={100}
                  value={grantedPoints}
                  onChange={(e) => setGrantedPoints(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-warmgold-500/40 text-white font-bold text-base text-amber-300 focus:outline-none"
                />
                <p className="text-[10px] text-stardustsilver-300/60 mt-1">
                  Requested by student: {selectedReq.requestedPoints || 5} Pts
                </p>
              </div>

              <div>
                <label className="block font-semibold text-almond-200 uppercase tracking-wider mb-1">Feedback / Notes</label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="e.g. Approved! Great job winning 1st place in national hackathon."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-arsenic-900 border border-white/15 text-white"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedReq(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-extrabold shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? 'Granting Points...' : 'Approve & Award Points'} <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoordinatorActivityRequestsPage;
