import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Search, UserCheck, Eye, BookOpen } from 'lucide-react';

const StudentSearchPage = () => {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students');
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return fetchStudents();
    setLoading(true);
    try {
      const res = await api.get(`/search/students?query=${encodeURIComponent(query)}`);
      setStudents(res.data);
    } catch (err) {
      console.error('Error searching students:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner label="Searching student community database..." />;

  return (
    <div className="space-y-8 p-4 lg:p-8">
      <div>
        <h1 className="font-sans text-3xl font-extrabold text-slate-900">Global Student Search & Oversight</h1>
        <p className="text-xs text-slate-600 mt-1">Search any student by Register Number, Name, Department, or Degree to inspect their complete extracurricular portfolio.</p>
      </div>

      <form onSubmit={handleSearch} className="flex items-center gap-3 bg-white border border-slate-200 shadow-sm rounded-3xl p-3 rounded-2xl border border-slate-200">
        <Search className="w-5 h-5 text-[#7c3aed] ml-2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter Register Code (e.g. REG2026001), Student Name, or Department..."
          className="flex-1 bg-transparent text-slate-900 placeholder-almond-300/30 text-sm focus:outline-none"
        />
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-purple-600 text-arsenic-950 font-bold text-xs hover:bg-purple-600 transition"
        >
          Search Student
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((s) => (
          <div key={s.id} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 rounded-2xl border border-slate-100 space-y-4 hover:border-purple-200 transition">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-slate-200 flex items-center justify-center font-sans text-xl font-bold text-[#7c3aed]">
                {s.name[0]}
              </div>
              <span className="text-xs font-mono font-bold text-[#7c3aed] px-2.5 py-1 rounded-md bg-white border border-purple-600/20">
                {s.studentCode}
              </span>
            </div>

            <div>
              <h3 className="font-sans text-xl font-bold text-slate-900">{s.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{s.department}</p>
              <p className="text-xs text-slate-500">{s.degree} • Year {s.year} (Sem {s.semester})</p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-3 border-t border-slate-100">
              <div>
                <div className="font-bold text-slate-900">{s.totalCommunitiesJoined}</div>
                <div className="text-[10px] text-slate-500">Clubs</div>
              </div>
              <div>
                <div className="font-bold text-emerald-400">{s.totalVolunteerHours}h</div>
                <div className="text-[10px] text-slate-500">Hours</div>
              </div>
              <div>
                <div className="font-bold text-[#7c3aed]">{s.attendancePercentage}%</div>
                <div className="text-[10px] text-slate-500">Attend.</div>
              </div>
            </div>

            <button
              onClick={() => navigate(`/faculty/students/${s.id}`)}
              className="w-full py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-200 text-[#8b5cf6] font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <Eye className="w-4 h-4" /> View Full Extracurricular Portfolio
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentSearchPage;
