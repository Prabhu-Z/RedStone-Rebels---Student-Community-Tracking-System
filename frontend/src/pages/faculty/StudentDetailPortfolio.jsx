import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Timeline from '../../components/common/Timeline';
import Badge from '../../components/common/Badge';
import PrintReportModal from '../../components/reports/PrintReportModal';
import { ArrowLeft, Printer, BookOpen, Award, CheckCircle2, FileCheck } from 'lucide-react';

const StudentDetailPortfolio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [communities, setCommunities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportModal, setReportModal] = useState(false);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    fetchStudentDetail();
  }, [id]);

  const fetchStudentDetail = async () => {
    try {
      const studentRes = await api.get(`/students/${id}`);
      setStudent(studentRes.data);

      const [commRes, actRes, achRes, certRes] = await Promise.all([
        api.get(`/students/${id}/communities`),
        api.get(`/students/${id}/activities`),
        api.get(`/students/${id}/achievements`),
        api.get(`/students/${id}/certificates`),
      ]);

      setCommunities(commRes.data);
      setActivities(actRes.data);
      setAchievements(achRes.data);
      setCertificates(certRes.data);
    } catch (err) {
      console.error('Error fetching student details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintPortfolio = async () => {
    try {
      const res = await api.get(`/reports/student/${id}`);
      setReportData(res.data);
      setReportModal(true);
    } catch (err) {
      alert('Failed to generate report.');
    }
  };

  if (loading) return <LoadingSpinner label="Loading complete student activity portfolio..." />;
  if (!student) return <div className="p-8 text-center text-stardustsilver-300">Student not found.</div>;

  return (
    <div className="space-y-8 p-4 lg:p-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-semibold text-warmgold-400 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Student Search
      </button>

      {/* Header Banner */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl border border-warmgold-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-chestnut-700 to-warmgold-500 flex items-center justify-center font-serif text-3xl font-bold text-white shadow-xl">
            {student.name[0]}
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-warmgold-400 uppercase tracking-widest">
              OFFICIAL FACULTY REVIEW PORTFOLIO
            </span>
            <h1 className="font-serif text-3xl font-extrabold text-white mt-0.5">{student.name}</h1>
            <p className="text-xs text-stardustsilver-300/80 mt-1">
              {student.department} • {student.degree} (Year {student.year}) • Code: #{student.studentCode}
            </p>
          </div>
        </div>

        <button
          onClick={handlePrintPortfolio}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-warmgold-500 text-arsenic-950 font-bold text-xs hover:bg-warmgold-400 transition shadow-lg"
        >
          <Printer className="w-4 h-4" /> Export Complete Student Report
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border border-stardustsilver-300/15 text-center">
          <span className="text-xs text-stardustsilver-300/60 uppercase">Communities Joined</span>
          <div className="text-2xl font-serif font-bold text-warmgold-400 mt-1">{communities.length}</div>
        </div>
        <div className="glass-card p-4 rounded-xl border border-stardustsilver-300/15 text-center">
          <span className="text-xs text-stardustsilver-300/60 uppercase">Attendance Rate</span>
          <div className="text-2xl font-serif font-bold text-white mt-1">{student.attendancePercentage}%</div>
        </div>
        <div className="glass-card p-4 rounded-xl border border-stardustsilver-300/15 text-center">
          <span className="text-xs text-stardustsilver-300/60 uppercase">Verified Service Hours</span>
          <div className="text-2xl font-serif font-bold text-emerald-400 mt-1">{student.totalVolunteerHours} hrs</div>
        </div>
        <div className="glass-card p-4 rounded-xl border border-stardustsilver-300/15 text-center">
          <span className="text-xs text-stardustsilver-300/60 uppercase">Achievements & Awards</span>
          <div className="text-2xl font-serif font-bold text-chestnut-300 mt-1">{achievements.length}</div>
        </div>
      </div>

      {/* Extracurricular Portfolio Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-stardustsilver-300/15 space-y-3">
            <h3 className="font-serif text-lg font-bold text-warmgold-400 border-b border-stardustsilver-300/15 pb-2">Community Memberships</h3>
            <div className="space-y-2">
              {communities.map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-arsenic-900/60 border border-stardustsilver-300/15 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-serif font-bold text-white">{c.communityName}</div>
                    <div className="text-[10px] text-stardustsilver-300/60">{c.joinedDate}</div>
                  </div>
                  <Badge status={c.role}>{c.role}</Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-stardustsilver-300/15 space-y-3">
            <h3 className="font-serif text-lg font-bold text-warmgold-400 border-b border-stardustsilver-300/15 pb-2">Verified Achievements</h3>
            <div className="space-y-2 text-xs">
              {achievements.map((a) => (
                <div key={a.id} className="p-3 rounded-xl bg-arsenic-900/60 border border-stardustsilver-300/15">
                  <div className="font-serif font-bold text-white">{a.title}</div>
                  <div className="text-[10px] text-warmgold-400">{a.communityName} • {a.achievementDate}</div>
                  <p className="text-[11px] text-stardustsilver-300/70 mt-1">{a.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 glass-panel p-6 lg:p-8 rounded-3xl border border-stardustsilver-300/15">
          <h3 className="font-serif text-xl font-bold text-white mb-6">Complete Extracurricular History</h3>
          <Timeline activities={activities} />
        </div>
      </div>

      <PrintReportModal isOpen={reportModal} onClose={() => setReportModal(false)} reportData={reportData} />
    </div>
  );
};

export default StudentDetailPortfolio;
