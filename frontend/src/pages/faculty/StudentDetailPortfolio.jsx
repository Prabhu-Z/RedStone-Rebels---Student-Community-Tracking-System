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
  if (!student) return <div className="p-8 text-center text-slate-600">Student not found.</div>;

  return (
    <div className="space-y-8 p-4 lg:p-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-semibold text-[#7c3aed] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Student Search
      </button>

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 lg:p-8 rounded-3xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-chestnut-700 to-purple-600 flex items-center justify-center font-sans text-3xl font-bold text-slate-900 shadow-xl">
            {student.name[0]}
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-[#7c3aed] uppercase tracking-widest">
              OFFICIAL FACULTY REVIEW PORTFOLIO
            </span>
            <h1 className="font-sans text-3xl font-extrabold text-slate-900 mt-0.5">{student.name}</h1>
            <p className="text-xs text-slate-600 mt-1">
              {student.department} • {student.degree} (Year {student.year}) • Code: #{student.studentCode}
            </p>
          </div>
        </div>

        <button
          onClick={handlePrintPortfolio}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-600 text-arsenic-950 font-bold text-xs hover:bg-purple-600 transition shadow-lg"
        >
          <Printer className="w-4 h-4" /> Export Complete Student Report
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 rounded-xl border border-slate-100 text-center">
          <span className="text-xs text-slate-500 uppercase">Communities Joined</span>
          <div className="text-[#7c3aed]xl font-sans font-bold text-[#7c3aed] mt-1">{communities.length}</div>
        </div>
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 rounded-xl border border-slate-100 text-center">
          <span className="text-xs text-slate-500 uppercase">Attendance Rate</span>
          <div className="text-[#7c3aed]xl font-sans font-bold text-slate-900 mt-1">{student.attendancePercentage}%</div>
        </div>
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 rounded-xl border border-slate-100 text-center">
          <span className="text-xs text-slate-500 uppercase">Verified Service Hours</span>
          <div className="text-[#7c3aed]xl font-sans font-bold text-emerald-400 mt-1">{student.totalVolunteerHours} hrs</div>
        </div>
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 rounded-xl border border-slate-100 text-center">
          <span className="text-xs text-slate-500 uppercase">Achievements & Awards</span>
          <div className="text-[#7c3aed]xl font-sans font-bold text-[#7c3aed] mt-1">{achievements.length}</div>
        </div>
      </div>

      {/* Extracurricular Portfolio Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 rounded-2xl border border-slate-100 space-y-3">
            <h3 className="font-sans text-lg font-bold text-[#7c3aed] border-b border-slate-100 pb-2">Community Memberships</h3>
            <div className="space-y-2">
              {communities.map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-[#eef2f6] border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-sans font-bold text-slate-900">{c.communityName}</div>
                    <div className="text-[10px] text-slate-500">{c.joinedDate}</div>
                  </div>
                  <Badge status={c.role}>{c.role}</Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 rounded-2xl border border-slate-100 space-y-3">
            <h3 className="font-sans text-lg font-bold text-[#7c3aed] border-b border-slate-100 pb-2">Verified Achievements</h3>
            <div className="space-y-2 text-xs">
              {achievements.map((a) => (
                <div key={a.id} className="p-3 rounded-xl bg-[#eef2f6] border border-slate-100">
                  <div className="font-sans font-bold text-slate-900">{a.title}</div>
                  <div className="text-[10px] text-[#7c3aed]">{a.communityName} • {a.achievementDate}</div>
                  <p className="text-[11px] text-slate-600 mt-1">{a.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border border-slate-200 shadow-sm rounded-3xl p-6 lg:p-8 rounded-3xl border border-slate-100">
          <h3 className="font-sans text-xl font-bold text-slate-900 mb-6">Complete Extracurricular History</h3>
          <Timeline activities={activities} />
        </div>
      </div>

      <PrintReportModal isOpen={reportModal} onClose={() => setReportModal(false)} reportData={reportData} />
    </div>
  );
};

export default StudentDetailPortfolio;
