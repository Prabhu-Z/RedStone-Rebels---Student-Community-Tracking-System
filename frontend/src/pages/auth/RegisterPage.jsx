import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, AlertCircle, CheckCircle2, UserCheck } from 'lucide-react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your_google_client_id_placeholder.apps.googleusercontent.com';

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ROLE_STUDENT',
    studentCode: '',
    department: 'Computer Science & Engineering',
    degree: 'B.Tech',
    year: 3,
    semester: 5,
    contact: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [googleStep, setGoogleStep] = useState(false);
  const [googleVerifiedEmail, setGoogleVerifiedEmail] = useState('');

  const googleBtnRef = useRef(null);
  const { register, checkEmailExists, loginWithFirebaseGoogle, loading } = useAuth();
  const navigate = useNavigate();

  // Initialize Official Google Identity Services SDK
  useEffect(() => {
    const handleGoogleCallback = async (response) => {
      setError('');
      try {
        const decoded = parseJwt(response.credential);
        if (!decoded || !decoded.email) {
          setError('Could not extract Google account email.');
          return;
        }

        const realEmail = decoded.email.toLowerCase().trim();
        const realName = decoded.name || realEmail.split('@')[0];

        // Check if user already exists in DB
        const exists = await checkEmailExists(realEmail);
        if (exists) {
          const user = await loginWithFirebaseGoogle(realEmail, realName);
          if (user?.role === 'ROLE_COMMUNITY_COORDINATOR') navigate('/coordinator/dashboard');
          else if (user?.role === 'ROLE_FACULTY') navigate('/faculty/dashboard');
          else navigate('/student/dashboard');
          return;
        }

        // New Google User: Open Student Profile Setup Form
        setGoogleVerifiedEmail(realEmail);
        setFormData((prev) => ({
          ...prev,
          email: realEmail,
          name: realName,
          password: 'GOOGLE_OAUTH_PASS_' + Date.now(),
          studentCode: 'REG' + (Date.now() % 1000000),
        }));
        setGoogleStep(true);
      } catch (err) {
        console.error('Google Auth Error:', err);
        setError('Google Registration failed: ' + (err.message || err));
      }
    };

    const initGoogleSDK = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCallback,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          if (googleBtnRef.current) {
            googleBtnRef.current.innerHTML = '';
            window.google.accounts.id.renderButton(googleBtnRef.current, {
              theme: 'filled_black',
              size: 'large',
              width: 440,
              text: 'signup_with',
              shape: 'pill',
            });
          }
        } catch (err) {
          console.warn('Google SDK Init:', err);
        }
      }
    };

    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        initGoogleSDK();
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [checkEmailExists, loginWithFirebaseGoogle, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await register(formData);
      setSuccess('Account created successfully! Logging into your Student Workspace...');

      setTimeout(async () => {
        try {
          await loginWithFirebaseGoogle(formData.email, formData.name);
          navigate('/student/dashboard');
        } catch (e) {
          navigate('/login');
        }
      }, 1000);
    } catch (err) {
      setError(err || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-black">
      <div className="glass-panel max-w-lg w-full p-8 rounded-3xl border border-[#F2CA50]/30 shadow-2xl relative z-10 my-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#F2CA50]/10 border border-[#F2CA50]/20 flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-[#F2CA50] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
          </div>
          <div>
            <h2 className="font-['Playfair_Display',serif] text-2xl font-bold text-white leading-none">
              {googleStep ? 'Complete Student Profile' : 'Register Student Account'}
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-[#F2CA50] opacity-80 mt-0.5">SCTS Campus Access</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        {/* Step 1: Google Quick Signup Header */}
        {!googleStep && (
          <div className="mb-6 space-y-3">
            <div className="flex justify-center min-h-[44px]">
              <div ref={googleBtnRef}></div>
            </div>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <span className="relative z-10 px-3 bg-[#121216] text-[11px] text-[#D0C5AF]/60 font-mono uppercase tracking-widest">
                or register with details
              </span>
            </div>
          </div>
        )}

        {/* Step 2: Google Verified Email Badge */}
        {googleStep && (
          <div className="mb-6 p-3.5 rounded-2xl bg-[#F2CA50]/15 border border-[#F2CA50]/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-5 h-5 text-[#F2CA50]" />
              <div>
                <div className="font-extrabold text-white">Google Verified Email</div>
                <div className="text-[11px] text-[#D0C5AF] font-mono">{googleVerifiedEmail}</div>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#F2CA50] text-[#3C2F00] font-extrabold text-[10px]">VERIFIED</span>
          </div>
        )}

        {/* Student Onboarding Form (Name, Department, Degree, Year, Semester, Register Code) */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#D0C5AF] uppercase tracking-wider mb-1">Full Student Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Prabhu Kumar"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/20 text-xs focus:outline-none focus:border-[#F2CA50]/60 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#D0C5AF] uppercase tracking-wider mb-1">Email Address</label>
              <input
                type="email"
                required
                disabled={!!googleVerifiedEmail}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@scts.edu"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/20 text-xs focus:outline-none focus:border-[#F2CA50]/60 transition disabled:opacity-70"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#D0C5AF] uppercase tracking-wider mb-1">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/20 text-xs focus:outline-none focus:border-[#F2CA50]/60 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#D0C5AF] uppercase tracking-wider mb-1">Register No / Student Code</label>
              <input
                type="text"
                required
                value={formData.studentCode}
                onChange={(e) => setFormData({ ...formData, studentCode: e.target.value })}
                placeholder="REG2026101"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/20 text-xs focus:outline-none focus:border-[#F2CA50]/60 transition"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#D0C5AF] uppercase tracking-wider mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#121216] border border-white/15 text-white text-xs focus:outline-none focus:border-[#F2CA50]/60 transition"
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Electrical & Electronics">Electrical & Electronics</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Information Technology">Information Technology</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-[#D0C5AF] uppercase tracking-wider mb-1">Degree</label>
              <select
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="w-full px-2.5 py-2.5 rounded-xl bg-[#121216] border border-white/15 text-white text-xs"
              >
                <option value="B.Tech">B.Tech</option>
                <option value="M.Tech">M.Tech</option>
                <option value="BCA">BCA</option>
                <option value="MCA">MCA</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#D0C5AF] uppercase tracking-wider mb-1">Year</label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="w-full px-2.5 py-2.5 rounded-xl bg-[#121216] border border-white/15 text-white text-xs"
              >
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#D0C5AF] uppercase tracking-wider mb-1">Semester</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                className="w-full px-2.5 py-2.5 rounded-xl bg-[#121216] border border-white/15 text-white text-xs"
              >
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 rounded-xl honey-btn text-[#3C2F00] font-extrabold text-sm shadow-gold-glow flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Complete & Register Account'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#D0C5AF]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#F2CA50] hover:underline font-bold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
