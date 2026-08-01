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
        <h1 className="font-serif text-3xl font-extrabold text-white">Global Student Search & Oversight</h1>
        <p className="text-xs text-stardustsilver-300/70 mt-1">Search any student by Register Number, Name, Department, or Degree to inspect their complete extracurricular portfolio.</p>
      </div>

      <form onSubmit={handleSearch} className="flex items-center gap-3 glass-panel p-3 rounded-2xl border border-warmgold-500/30">
        <Search className="w-5 h-5 text-warmgold-400 ml-2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter Register Code (e.g. REG2026001), Student Name, or Department..."
          className="flex-1 bg-transparent text-white placeholder-almond-300/30 text-sm focus:outline-none"
        />
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-warmgold-500 text-arsenic-950 font-bold text-xs hover:bg-warmgold-400 transition"
        >
          Search Student
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((s) => (
          <div key={s.id} className="glass-card p-6 rounded-2xl border border-stardustsilver-300/15 space-y-4 hover:border-warmgold-500/40 transition">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-warmgold-500/20 border border-warmgold-500/30 flex items-center justify-center font-serif text-xl font-bold text-warmgold-400">
                {s.name[0]}
              </div>
              <span className="text-xs font-mono font-bold text-warmgold-400 px-2.5 py-1 rounded-md bg-arsenic-900 border border-warmgold-500/20">
                {s.studentCode}
              </span>
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-white">{s.name}</h3>
              <p className="text-xs text-stardustsilver-300/60 mt-0.5">{s.department}</p>
              <p className="text-xs text-stardustsilver-300/60">{s.degree} • Year {s.year} (Sem {s.semester})</p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-3 border-t border-stardustsilver-300/15">
              <div>
                <div className="font-bold text-white">{s.totalCommunitiesJoined}</div>
                <div className="text-[10px] text-stardustsilver-300/50">Clubs</div>
              </div>
              <div>
                <div className="font-bold text-emerald-400">{s.totalVolunteerHours}h</div>
                <div className="text-[10px] text-stardustsilver-300/50">Hours</div>
              </div>
              <div>
                <div className="font-bold text-warmgold-400">{s.attendancePercentage}%</div>
                <div className="text-[10px] text-stardustsilver-300/50">Attend.</div>
              </div>
            </div>

            <button
              onClick={() => navigate(`/faculty/students/${s.id}`)}
              className="w-full py-2.5 rounded-xl bg-warmgold-500/20 hover:bg-warmgold-500/30 border border-warmgold-500/40 text-warmgold-300 font-bold text-xs flex items-center justify-center gap-2 transition"
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
