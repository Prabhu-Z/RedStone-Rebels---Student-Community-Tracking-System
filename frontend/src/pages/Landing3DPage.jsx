import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Immersive3DCanvas from '../components/3d/Immersive3DCanvas';
import { useAuth } from '../context/AuthContext';
import { ArrowRight } from 'lucide-react';

const Landing3DPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Intersection Observer for scroll reveal animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleQuickDemo = async (email, rolePath) => {
    try {
      await login(email, 'password123');
      navigate(rolePath);
    } catch (err) {
      console.error('Demo login failed:', err);
    }
  };

  return (
    <div className="relative bg-white text-slate-900 text-[#e2e2e8] font-['Hanken_Grotesk',sans-serif] selection:bg-[#8b5cf6] selection:text-[#3c2f00] overflow-x-hidden min-h-[320vh]">
      {/* 60 FPS Fixed Background Three.js Celestial Canvas */}
      <Immersive3DCanvas />

      {/* Navigation Shell */}
      <nav className="fixed top-0 w-full z-50 bg-white text-slate-900/90 backdrop-blur-xl border-b border-slate-200 flex justify-between items-center px-6 md:px-16 py-4 max-w-[1440px] mx-auto left-0 right-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#8b5cf6]/10 rounded-lg flex items-center justify-center border border-[#8b5cf6]/20">
            <span className="material-symbols-outlined text-[#8b5cf6]" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
          </div>
          <div>
            <h1 className="font-['Playfair_Display',serif] text-xl font-bold text-[#e2e2e8] tracking-tight leading-none">
              SCTS
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-[#8b5cf6] opacity-80">
              Community System
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 font-['Hanken_Grotesk'] text-base">
          <a className="text-[#64748b] hover:text-slate-900 transition-colors" href="#hero">
            Overview
          </a>
          <a className="text-[#64748b] hover:text-[#8b5cf6] transition-colors" href="#features">
            Communities
          </a>
          <a className="text-[#64748b] hover:text-[#8b5cf6] transition-colors" href="#progress">
            Achievements
          </a>
          <Link className="text-[#64748b] hover:text-[#8b5cf6] transition-colors" to="/login">
            Profile
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <Link
              to={
                user.role === 'ROLE_STUDENT'
                  ? '/student/dashboard'
                  : user.role === 'ROLE_COMMUNITY_COORDINATOR'
                  ? '/coordinator/dashboard'
                  : '/faculty/dashboard'
              }
              className="bg-[#8b5cf6] text-[#3c2f00] font-['Hanken_Grotesk'] font-semibold px-6 py-2 rounded-full scale-95 active:scale-90 transition-transform gold-glow flex items-center gap-2 text-sm"
            >
              Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-[#64748b] hover:text-slate-900 text-sm font-semibold px-5 py-2 transition-all rounded-full border border-slate-200 hover:border-white/40 bg-white/5 hover:bg-white/10"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-[#8b5cf6] text-[#3c2f00] font-['Hanken_Grotesk'] font-semibold px-6 py-2 rounded-full scale-95 active:scale-90 transition-all gold-glow hover:bg-[#ffe088] text-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Ambient Radial Gradient for Depth */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black pointer-events-none"></div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#8b5cf6]/30 bg-[#8b5cf6]/5 mb-8 floating">
            <span className="material-symbols-outlined text-[16px] text-[#8b5cf6]" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
            <span className="font-['Geist'] text-xs text-[#8b5cf6] uppercase tracking-[0.2em]">
              A Continuous 3D Journey
            </span>
          </div>

          <h2 className="font-['Playfair_Display',serif] text-[#7c3aed]xl sm:text-7xl md:text-[84px] leading-tight text-[#e2e2e8] mb-6 drop-shadow-2xl font-bold">
            Unify Your <span className="text-[#8b5cf6] italic">Extracurricular</span> Legacy.
          </h2>

          <p className="font-['Hanken_Grotesk'] text-lg sm:text-xl text-[#64748b] max-w-2xl mb-12 leading-relaxed">
            Track your journey through 30+ college communities in real-time. Every milestone, from workshop attendance to competition titles, captured in a single celestial portfolio.
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            <Link
              to="/register"
              className="group relative px-10 py-4 bg-[#8b5cf6] text-[#3c2f00] rounded-full font-['Hanken_Grotesk'] font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 gold-glow flex items-center justify-center gap-2"
            >
              <span className="relative z-10">Start Tracking Now</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Link>
            <a
              href="#features"
              className="px-10 py-4 border border-slate-200 text-[#e2e2e8] rounded-full font-['Hanken_Grotesk'] font-bold text-lg backdrop-blur-md hover:bg-white/5 transition-all text-center"
            >
              Explore Communities
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 animate-bounce">
          <span className="font-['Geist'] text-[11px] uppercase tracking-widest text-[#8b5cf6]">Scroll</span>
          <span className="material-symbols-outlined text-[#8b5cf6]">expand_more</span>
        </div>
      </main>

      {/* Features Bento Grid Section */}
      <section id="features" className="relative py-32 px-6 md:px-16 max-w-[1440px] mx-auto z-10">
        <div className="mb-20 text-center md:text-left">
          <h3 className="font-['Playfair_Display',serif] text-4xl sm:text-[#7c3aed]xl font-bold mb-4 text-[#e2e2e8]">
            Architected for Excellence
          </h3>
          <p className="text-[#64748b] max-w-xl text-base">
            A suite of precision tools designed to manage, verify, and visualize your professional growth throughout your academic career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="reveal bg-white border border-slate-200 shadow-sm rounded-2xl p-10 rounded-3xl flex flex-col items-start gap-6 group">
            <div className="w-16 h-16 rounded-2xl bg-[#8b5cf6]/10 flex items-center justify-center border border-[#8b5cf6]/20 group-hover:bg-[#8b5cf6] group-hover:text-[#3c2f00] transition-all duration-500">
              <span className="material-symbols-outlined text-3xl" data-icon="school">
                school
              </span>
            </div>
            <div>
              <h4 className="font-['Playfair_Display',serif] text-[#7c3aed]xl font-bold mb-4 text-[#e2e2e8]">
                Student Portfolio Timeline
              </h4>
              <p className="text-[#64748b] leading-relaxed text-sm">
                Complete chronological tracking of joining dates, workshops attended, hackathons won, and leadership roles held from Day 1 to Graduation.
              </p>
            </div>
            <div className="mt-auto pt-6 w-full border-t border-white/5">
              <button
                onClick={() => handleQuickDemo('student@scts.edu', '/student/dashboard')}
                className="flex items-center justify-between text-[#8b5cf6] font-['Geist'] text-xs font-semibold tracking-wider uppercase w-full hover:underline"
              >
                <span>STUDENT DEMO LOGIN</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="reveal bg-white border border-slate-200 shadow-sm rounded-2xl p-10 rounded-3xl flex flex-col items-start gap-6 group md:translate-y-12">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-slate-200 group-hover:bg-[#8b5cf6] group-hover:text-[#3c2f00] transition-all duration-500">
              <span className="material-symbols-outlined text-3xl" data-icon="explore">
                explore
              </span>
            </div>
            <div>
              <h4 className="font-['Playfair_Display',serif] text-[#7c3aed]xl font-bold mb-4 text-[#e2e2e8]">
                Coordinator Control Panel
              </h4>
              <p className="text-[#64748b] leading-relaxed text-sm">
                Seamlessly approve pending student membership requests, conduct events, log attendance, verify volunteer hours, and issue official certificates instantly.
              </p>
            </div>
            <div className="mt-auto pt-6 w-full border-t border-white/5">
              <button
                onClick={() => handleQuickDemo('coordinator@scts.edu', '/coordinator/dashboard')}
                className="flex items-center justify-between text-[#8b5cf6] font-['Geist'] text-xs font-semibold tracking-wider uppercase w-full hover:underline"
              >
                <span>COORDINATOR ACCESS</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="reveal bg-white border border-slate-200 shadow-sm rounded-2xl p-10 rounded-3xl flex flex-col items-start gap-6 group">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-slate-200 group-hover:bg-[#8b5cf6] group-hover:text-[#3c2f00] transition-all duration-500">
              <span className="material-symbols-outlined text-3xl" data-icon="verified_user">
                verified_user
              </span>
            </div>
            <div>
              <h4 className="font-['Playfair_Display',serif] text-[#7c3aed]xl font-bold mb-4 text-[#e2e2e8]">
                Faculty Analytics Hub
              </h4>
              <p className="text-[#64748b] leading-relaxed text-sm">
                College-wide monitoring of student activity by register number, real-time engagement statistics, multi-criteria search, and instant PDF report exports.
              </p>
            </div>
            <div className="mt-auto pt-6 w-full border-t border-white/5">
              <button
                onClick={() => handleQuickDemo('faculty@scts.edu', '/faculty/dashboard')}
                className="flex items-center justify-between text-[#8b5cf6] font-['Geist'] text-xs font-semibold tracking-wider uppercase w-full hover:underline"
              >
                <span>VIEW FACULTY HUB</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Global Progress Section */}
      <section id="progress" className="py-32 bg-white text-slate-900/80 relative overflow-hidden z-10 border-t border-b border-slate-200">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="px-6 md:px-16 max-w-[1440px] mx-auto flex flex-col md:flex-row items-center gap-20">
          <div className="flex-1 reveal">
            <h3 className="font-['Playfair_Display',serif] text-4xl sm:text-[#7c3aed]xl font-bold mb-6 text-[#e2e2e8] leading-tight">
              30+ Communities.<br />One Unified Portfolio.
            </h3>
            <p className="text-[#64748b] text-lg mb-8 leading-relaxed">
              Real-time synchronization between Student Memberships, Event Attendance, Verified Service Hours, and Institutional Analytics.
            </p>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between font-['Geist'] text-xs font-semibold uppercase tracking-widest">
                  <span>Active Enrolled Students</span>
                  <span className="text-[#8b5cf6]">12,400+</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#8b5cf6] w-3/4 rounded-full shadow-[0_0_10px_rgba(242,202,80,0.5)]"></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between font-['Geist'] text-xs font-semibold uppercase tracking-widest">
                  <span>Service Hours Logged</span>
                  <span className="text-[#8b5cf6]">85,000+</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#8b5cf6] w-[85%] rounded-full shadow-[0_0_10px_rgba(242,202,80,0.5)]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 relative reveal">
            <div className="aspect-square relative flex items-center justify-center">
              {/* Rotating Gold Ring */}
              <div className="absolute inset-0 border border-[#8b5cf6]/20 rounded-full animate-[spin_20s_linear_infinite]"></div>
              <div className="absolute inset-10 border border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
              <div className="relative bg-white border border-slate-200 shadow-sm rounded-2xl p-8 rounded-3xl w-64 h-64 flex flex-col items-center justify-center text-center floating shadow-2xl">
                <span className="material-symbols-outlined text-[#7c3aed]xl text-[#8b5cf6] mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>
                  workspace_premium
                </span>
                <div className="font-['Playfair_Display',serif] text-3xl font-bold mb-1 text-[#e2e2e8]">
                  Global Rank
                </div>
                <div className="font-['Geist'] text-[#8b5cf6] text-xl font-bold">TOP 5%</div>
              </div>
              {/* Floating Decorative Elements */}
              <div className="absolute top-10 right-10 w-4 h-4 bg-[#8b5cf6] rounded-full blur-[2px]"></div>
              <div className="absolute bottom-20 left-0 w-2 h-2 bg-white/50 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-slate-900 w-full py-12 border-t border-slate-200 px-6 md:px-16 mt-20 relative z-10">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
          <div className="flex items-center gap-3">
            <span className="font-['Playfair_Display',serif] text-xl text-[#8b5cf6] font-bold">SCTS</span>
            <span className="w-px h-4 bg-white/10 hidden md:block"></span>
            <p className="font-['Hanken_Grotesk'] text-xs text-[#64748b]">
              © 2026 SCTS. Student Community Tracking System.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 font-['Hanken_Grotesk'] text-xs text-[#6e727d]">
            <Link className="hover:text-[#8b5cf6] transition-colors" to="/login">
              Sign In
            </Link>
            <Link className="hover:text-[#8b5cf6] transition-colors" to="/register">
              Sign Up
            </Link>
            <a className="hover:text-[#8b5cf6] transition-colors" href="#hero">
              Terms of Service
            </a>
            <a className="hover:text-[#8b5cf6] transition-colors" href="#hero">
              Documentation
            </a>
          </div>

          <div className="flex gap-4">
            <a className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:border-[#8b5cf6]/50 transition-colors" href="#hero">
              <span className="material-symbols-outlined text-sm text-[#e2e2e8]">public</span>
            </a>
            <a className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:border-[#8b5cf6]/50 transition-colors" href="#hero">
              <span className="material-symbols-outlined text-sm text-[#e2e2e8]">mail</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing3DPage;
