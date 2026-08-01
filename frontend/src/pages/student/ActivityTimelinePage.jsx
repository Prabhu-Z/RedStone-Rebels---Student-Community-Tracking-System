import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import { CheckSquare, Calendar, Link2, FileText, CheckCircle2, XCircle, Clock, Globe, Lock, Ticket, Award } from 'lucide-react';

const ActivityTimelinePage = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [taskSubmissions, setTaskSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      let studentIdParam = user?.studentId || user?.id;

      const [actRes, taskRes] = await Promise.all([
        api.get(`/students/${studentIdParam}/activities`).catch(() => ({ data: [] })),
        api.get(`/tasks/student/${studentIdParam}`).catch(() => ({ data: [] })),
      ]);

      setActivities(actRes.data || []);
      const submittedTasks = (taskRes.data || []).filter((t) => t.status !== 'PENDING');
      setTaskSubmissions(submittedTasks);
    } catch (err) {
      console.error('Error fetching activity timeline:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner label="Compiling activity timeline & event registrations..." />;

  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-serif font-bold text-warmgold-400 uppercase tracking-widest flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-warmgold-400" /> Extracurricular Progress & Timeline
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-white mt-1">Activity Timeline</h1>
          <p className="text-xs text-stardustsilver-300/70 mt-1">
            Chronological history of registered campus events, task proof deliverables, and verified activity records.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-arsenic-900/90 px-4 py-2 rounded-2xl border border-white/10 text-xs font-mono">
          <Ticket className="w-4 h-4 text-amber-400" />
          <span>Timeline Items: <strong className="text-amber-300">{activities.length + taskSubmissions.length} Recorded</strong></span>
        </div>
      </div>

      {/* SECTION 1: EVENT REGISTRATION PARTICIPATION TIMELINE */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl border border-warmgold-500/30 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-warmgold-400" /> Registered Events Timeline ({activities.length})
          </h3>
          <span className="text-xs text-amber-300 font-mono font-bold">+1 Point Per Event Registration</span>
        </div>

        {activities.length > 0 ? (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-warmgold-500/50 before:to-chestnut-700/20">
            {activities.map((act, idx) => (
              <div key={act.id || idx} className="relative group">
                <div className="absolute -left-[30px] top-1.5 w-6 h-6 rounded-full bg-arsenic-950 border border-warmgold-500/60 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                  <Ticket className="w-3.5 h-3.5 text-warmgold-400" />
                </div>

                <div className="glass-card p-5 rounded-2xl border border-stardustsilver-300/15 hover:border-warmgold-500/40 transition space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-warmgold-400 font-mono flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-warmgold-400" /> {act.activityDate}
                    </span>
                    <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold font-mono">
                      {act.role || 'REGISTERED'} (+1 Pt)
                    </span>
                  </div>

                  <h4 className="font-serif text-lg font-bold text-white flex items-center justify-between">
                    <span>{act.eventTitle || act.communityName}</span>
                    <span className="text-xs font-serif font-bold text-warmgold-300">{act.communityName}</span>
                  </h4>

                  {act.contribution && (
                    <p className="text-xs text-almond-200 font-medium flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-400" /> {act.contribution}
                    </p>
                  )}

                  {act.description && (
                    <p className="text-xs text-stardustsilver-300/70 font-mono bg-arsenic-900/60 p-2.5 rounded-xl border border-white/10">
                      {act.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-stardustsilver-300/50 glass-card rounded-2xl border border-dashed border-white/10">
            <Ticket className="w-8 h-8 text-warmgold-400/40 mx-auto mb-2" />
            No registered events logged in timeline yet. Register for events to build your timeline!
          </div>
        )}
      </div>

      {/* SECTION 2: TASK SUBMISSIONS & APPROVAL STATUS TIMELINE */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl border border-white/10 space-y-4">
        <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-warmgold-400" /> Community Task Deliverables Approval Status ({taskSubmissions.length})
        </h3>

        {taskSubmissions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {taskSubmissions.map((t) => (
              <div
                key={t.id}
                className="glass-card p-6 rounded-2xl border border-stardustsilver-300/15 space-y-3 hover:border-warmgold-500/30 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-chestnut-700/30 text-warmgold-400 border border-warmgold-500/20">
                    {t.communityName}
                  </span>
                  <Badge status={t.status}>{t.status}</Badge>
                </div>

                <div>
                  <h4 className="font-serif text-base font-bold text-white">{t.taskTitle}</h4>
                  <p className="text-xs text-stardustsilver-300/70 line-clamp-2 mt-0.5">{t.taskDescription}</p>
                </div>

                <div className="p-3 rounded-xl bg-arsenic-900/90 border border-stardustsilver-300/15 space-y-1.5 text-xs">
                  <div className="text-[10px] text-warmgold-400 font-semibold uppercase tracking-wider">
                    Submitted Proof Details:
                  </div>
                  {t.proofLink && (
                    <a
                      href={t.proofLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-morning-300 underline font-mono text-[11px] truncate flex items-center gap-1.5"
                    >
                      <Link2 className="w-3.5 h-3.5" /> {t.proofLink}
                    </a>
                  )}
                  {t.proofFileName && (
                    <div className="text-almond-200 text-[11px] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-warmgold-400" /> {t.proofFileName}
                    </div>
                  )}

                  {t.status === 'REJECTED' && t.rejectionReason && (
                    <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs mt-2 space-y-0.5">
                      <div className="font-bold flex items-center gap-1">
                        <XCircle className="w-4 h-4 text-rose-400" /> Rejected by Coordinator
                      </div>
                      <div className="text-[11px] leading-relaxed">
                        <strong>Reason:</strong> {t.rejectionReason}
                      </div>
                    </div>
                  )}

                  {t.status === 'VERIFIED' && (
                    <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-1.5 font-bold mt-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Approved & Verified by Coordinator
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-6 rounded-2xl border border-stardustsilver-300/15 text-center text-xs text-stardustsilver-300/50">
            No submitted task proofs yet. Once you submit a task proof, its coordinator approval status will appear here.
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityTimelinePage;
