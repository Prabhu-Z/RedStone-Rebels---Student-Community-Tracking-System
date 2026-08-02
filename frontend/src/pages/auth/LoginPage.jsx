import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, UserPlus, UserX } from 'lucide-react';

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

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailExistsStatus, setEmailExistsStatus] = useState(null);

  const googleBtnRef = useRef(null);
  const { login, checkEmailExists, loginWithFirebaseGoogle, loading } = useAuth();
  const navigate = useNavigate();

  const isPlaceholderClientId = !GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.includes('placeholder');

  // Initialize Official Google Identity Services (GIS) SDK
  useEffect(() => {
    if (isPlaceholderClientId) return;

    const handleGoogleCallback = async (response) => {
      setError('');
      try {
        const decoded = parseJwt(response.credential);
        if (!decoded || !decoded.email) {
          setError('Could not extract email from Google Sign-In.');
          return;
        }

        const realEmail = decoded.email.toLowerCase().trim();
        const realName = decoded.name || realEmail.split('@')[0];

        const exists = await checkEmailExists(realEmail);
        if (!exists) {
          setError(`Account with email "${realEmail}" is not registered yet. Please click "Register Student Account" below to sign up!`);
          return;
        }

        const user = await loginWithFirebaseGoogle(realEmail, realName);
        if (user?.role === 'ROLE_COMMUNITY_COORDINATOR') navigate('/coordinator/dashboard');
        else if (user?.role === 'ROLE_FACULTY') navigate('/faculty/dashboard');
        else navigate('/student/dashboard');
      } catch (err) {
        console.error('Google Auth Error:', err);
        setError('Google Sign-In failed: ' + (err.message || err));
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
              width: 380,
              text: 'continue_with',
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
  }, [checkEmailExists, loginWithFirebaseGoogle, navigate, isPlaceholderClientId]);

  // Real-time email existence check for password input
  useEffect(() => {
    if (!email || !email.includes('@')) {
      setEmailExistsStatus(null);
      return;
    }

    const timer = setTimeout(async () => {
      const exists = await checkEmailExists(email);
      setEmailExistsStatus(exists);
    }, 400);

    return () => clearTimeout(timer);
  }, [email, checkEmailExists]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      if (user.role === 'ROLE_STUDENT') navigate('/student/dashboard');
      else if (user.role === 'ROLE_COMMUNITY_COORDINATOR') navigate('/coordinator/dashboard');
      else if (user.role === 'ROLE_FACULTY') navigate('/faculty/dashboard');
    } catch (err) {
      setError(err || 'Failed to login. Please check your credentials.');
    }
  };

  const fillQuickDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  const handlePlaceholderGoogleClick = () => {
    setError('Google Cloud Client ID is not configured yet. Please sign in with email & password or click a 1-Click Demo Account below!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-black">
      <div className="glass-panel max-w-md w-full p-8 rounded-3xl border border-[#F2CA50]/30 shadow-2xl relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#F2CA50]/10 border border-[#F2CA50]/20 flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-[#F2CA50] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
          </div>
          <div>
            <h2 className="font-['Playfair_Display',serif] text-2xl font-bold text-white leading-none">Sign In</h2>
            <p className="text-[10px] uppercase tracking-widest text-[#F2CA50] opacity-80 mt-0.5">SCTS Campus Portal</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5 shadow-lg">
            <UserX className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span className="leading-relaxed font-semibold">{error}</span>
          </div>
        )}

        {/* Google Sign-In Container */}
        <div className="mb-6 space-y-3">
          <div className="flex justify-center min-h-[44px]">
            {isPlaceholderClientId ? (
              <button
                type="button"
                onClick={handlePlaceholderGoogleClick}
                className="w-full py-2.5 px-4 rounded-full bg-[#1e1e24] border border-white/20 text-white text-xs font-semibold flex items-center justify-center gap-3 hover:bg-[#282830] transition shadow-md"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Sign in with Google
              </button>
            ) : (
              <div ref={googleBtnRef}></div>
            )}
          </div>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <span className="relative z-10 px-3 bg-[#121216] text-[11px] text-[#D0C5AF]/60 font-mono uppercase tracking-widest">
              or sign in with password
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-[#D0C5AF] uppercase tracking-wider">Email Address</label>
              {emailExistsStatus !== null && (
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    emailExistsStatus
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {emailExistsStatus ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Registered
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3 h-3 text-amber-400" /> Not Registered
                    </>
                  )}
                </span>
              )}
            </div>

            <div className="relative">
              <Mail className="w-4 h-4 text-[#D0C5AF]/40 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@scts.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#F2CA50]/60 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D0C5AF] uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#D0C5AF]/40 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#F2CA50]/60 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl honey-btn text-[#3C2F00] font-extrabold text-sm shadow-gold-glow flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-xs text-center text-[#F2CA50] font-semibold mb-2">Quick Demo Accounts (click to autofill):</p>
          <div className="flex flex-wrap gap-1.5 justify-center text-[11px]">
            <button onClick={() => fillQuickDemo('student@scts.edu')} className="px-2.5 py-1 rounded-md bg-[#F2CA50]/15 text-[#F2CA50] hover:bg-[#F2CA50]/30 transition">Student Demo</button>
            <button onClick={() => fillQuickDemo('coordinator@scts.edu')} className="px-2.5 py-1 rounded-md bg-white/10 text-white hover:bg-white/20 transition">Coordinator Demo</button>
            <button onClick={() => fillQuickDemo('faculty@scts.edu')} className="px-2.5 py-1 rounded-md bg-[#F2CA50]/15 text-[#F2CA50] hover:bg-[#F2CA50]/30 transition">Faculty Demo</button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-[#D0C5AF]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#F2CA50] hover:underline font-bold">
            Register Student Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
