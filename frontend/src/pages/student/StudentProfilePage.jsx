import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Timeline from '../../components/common/Timeline';
import Badge from '../../components/common/Badge';
import PrintReportModal from '../../components/reports/PrintReportModal';
import { User, Mail, Phone, BookOpen, Award, CheckCircle2, FileCheck, Printer } from 'lucide-react';

const StudentProfilePage = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [communities, setCommunities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportModal, setReportModal] = useState(false);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchStudentData = async () => {
      try {
        const studentRes = await api.get(`/students/user/${user.id}`);
        const s = studentRes.data;
        setStudent(s);

        if (s?.id) {
          const [commRes, actRes, achRes, certRes] = await Promise.all([
            api.get(`/students/${s.id}/communities`).catch(() => ({ data: [] })),
            api.get(`/students/${s.id}/activities`).catch(() => ({ data: [] })),
            api.get(`/students/${s.id}/achievements`).catch(() => ({ data: [] })),
            api.get(`/students/${s.id}/certificates`).catch(() => ({ data: [] })),
          ]);

          setCommunities(commRes.data || []);
          setActivities(actRes.data || []);
          setAchievements(achRes.data || []);
          setCertificates(certRes.data || []);
        }
      } catch (err) {
        console.error('Error fetching student profile:', err);
        // Fallback profile if API fails or user is new
        setStudent({
          id: user.id,
          name: user.name || 'Student User',
          studentCode: 'STU' + (10000 + user.id),
          department: 'Computer Science & Engineering',
          degree: 'B.Tech',
          year: 2,
          semester: 4,
          email: user.email || 'student@scts.edu',
          contact: '+91 9876543210',
          attendancePercentage: 92.0,
          totalVolunteerHours: 0,
          totalAchievements: 0,
          totalCertificates: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, [user]);

  const handlePrintPortfolio = async () => {
    if (!student?.id) return;
    try {
      const res = await api.get(`/reports/student/${student.id}`);
      setReportData(res.data);
      setReportModal(true);
    } catch (err) {
      console.error('Error generating report:', err);
    }
  };

  if (loading) return <LoadingSpinner label="Loading student portfolio & dashboard..." />;

  const activeStudent = student || {
    id: user?.id || 1,
    name: user?.name || 'Student User',
    studentCode: 'STU10001',
    department: 'Computer Science & Engineering',
    degree: 'B.Tech',
    year: 2,
    semester: 4,
    email: user?.email || 'student@scts.edu',
    contact: '+91 9876543210',
    attendancePercentage: 92.0,
    totalVolunteerHours: 0,
    totalAchievements: 0,
    totalCertificates: 0,
  };

  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Portfolio Header Card */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl border border-warmgold-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-chestnut-700 to-warmgold-500 flex items-center justify-center font-serif text-3xl font-bold text-white shadow-xl shadow-chestnut-900/40">
            {activeStudent.name ? activeStudent.name[0] : 'S'}
          </div>
          <div>
            <h1 className="font-serif text-3xl font-extrabold text-white">{activeStudent.name}</h1>
            <p className="text-xs text-warmgold-400 font-mono mt-0.5">Register Code: {activeStudent.studentCode}</p>
            <div className="flex flex-wrap gap-2 mt-2 text-xs text-stardustsilver-300/80">
              <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-morning-300" /> {activeStudent.department}</span>
              <span>• {activeStudent.degree} (Year {activeStudent.year}, Sem {activeStudent.semester})</span>
            </div>
          </div>
        </div>

        <button
          onClick={handlePrintPortfolio}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-warmgold-500 text-arsenic-950 font-bold text-xs hover:bg-warmgold-400 transition shadow-lg"
        >
          <Printer className="w-4 h-4" /> Download Official Portfolio PDF
        </button>
      </div>

      {/* Portfolio Breakdown Tabs/Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Info & Performance Summary */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-stardustsilver-300/15 space-y-3">
            <h3 className="font-serif text-lg font-bold text-warmgold-400 border-b border-stardustsilver-300/15 pb-2">Academic & Contact</h3>
            <div className="space-y-2 text-xs text-almond-200">
              <div className="flex items-center justify-between">
                <span className="text-stardustsilver-300/60">Email Address:</span>
                <span className="font-mono text-white">{activeStudent.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stardustsilver-300/60">Contact Phone:</span>
                <span>{activeStudent.contact || '+91 9876543210'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stardustsilver-300/60">Department:</span>
                <span>{activeStudent.department}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stardustsilver-300/60">Academic Year:</span>
                <span>Year {activeStudent.year} (Sem {activeStudent.semester})</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-stardustsilver-300/15 space-y-3">
            <h3 className="font-serif text-lg font-bold text-warmgold-400 border-b border-stardustsilver-300/15 pb-2">Overall Performance Metrics</h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-arsenic-900/60 border border-stardustsilver-300/15">
                <div className="text-2xl font-serif font-bold text-warmgold-400">{activeStudent.attendancePercentage || 92}%</div>
                <div className="text-[10px] text-stardustsilver-300/60">Attendance Rate</div>
              </div>
              <div className="p-3 rounded-xl bg-arsenic-900/60 border border-stardustsilver-300/15">
                <div className="text-2xl font-serif font-bold text-emerald-400">{activeStudent.totalVolunteerHours || 0} hrs</div>
                <div className="text-[10px] text-stardustsilver-300/60">Verified Hours</div>
              </div>
              <div className="p-3 rounded-xl bg-arsenic-900/60 border border-stardustsilver-300/15">
                <div className="text-2xl font-serif font-bold text-morning-300">{achievements.length || activeStudent.totalAchievements || 0}</div>
                <div className="text-[10px] text-stardustsilver-300/60">Awards & Titles</div>
              </div>
              <div className="p-3 rounded-xl bg-arsenic-900/60 border border-stardustsilver-300/15">
                <div className="text-2xl font-serif font-bold text-chestnut-300">{certificates.length || activeStudent.totalCertificates || 0}</div>
                <div className="text-[10px] text-stardustsilver-300/60">Certificates Issued</div>
              </div>
            </div>
          </div>
        </div>

        {/* Communities & Verified Achievements */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-stardustsilver-300/15 space-y-4">
            <h3 className="font-serif text-xl font-bold text-white">Joined Communities ({communities.length})</h3>
            {communities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {communities.map((c) => (
                  <div key={c.id} className="glass-card p-4 rounded-xl border border-stardustsilver-300/15 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-serif font-bold text-white">{c.communityName}</h4>
                      <span className="text-[10px] text-stardustsilver-300/60">{c.communityCategory}</span>
                    </div>
                    <Badge status={c.role}>{c.role}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-stardustsilver-300/60 p-4 border border-dashed border-white/10 rounded-xl text-center">
                You haven't joined any communities yet. Explore & join communities to build your portfolio!
              </div>
            )}
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-stardustsilver-300/15 space-y-4">
            <h3 className="font-serif text-xl font-bold text-white">Complete Extracurricular Timeline</h3>
            <Timeline activities={activities} />
          </div>
        </div>
      </div>

      <PrintReportModal isOpen={reportModal} onClose={() => setReportModal(false)} reportData={reportData} />
    </div>
  );
};

export default StudentProfilePage;
