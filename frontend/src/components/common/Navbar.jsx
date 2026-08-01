import React from 'react';
import { useAuth } from '../../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import { LogOut, Sparkles, GraduationCap, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ROLE_STUDENT':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#F2CA50]/15 text-[#F2CA50] border border-[#F2CA50]/30 flex items-center gap-1 shadow-sm">
            <GraduationCap className="w-3 h-3 text-[#F2CA50]" /> STUDENT
          </span>
        );
      case 'ROLE_COMMUNITY_COORDINATOR':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#F2CA50]/25 text-[#FFE088] border border-[#F2CA50]/40 flex items-center gap-1 shadow-sm">
            <ShieldCheck className="w-3 h-3 text-[#FFE088]" /> COORDINATOR
          </span>
        );
      case 'ROLE_FACULTY':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#F2CA50]/20 text-white border border-[#F2CA50]/40 flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3 text-[#F2CA50]" /> FACULTY OVERSIGHT
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="h-16 w-full navbar-glass px-4 lg:px-8 flex items-center justify-between border-b border-white/10 shadow-md relative z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-[#E2E2E8] hover:bg-white/10 border border-white/15 active:scale-95 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-[#F2CA50]/10 rounded-lg flex items-center justify-center border border-[#F2CA50]/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <span className="material-symbols-outlined text-[#F2CA50] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-[#E2E2E8] group-hover:text-[#F2CA50] transition-colors leading-none block font-['Playfair_Display',serif]">
              SCTS
            </span>
            <span className="hidden sm:block text-[10px] uppercase tracking-widest text-[#F2CA50] opacity-80 mt-0.5">
              Community System
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        {user ? (
          <>
            <NotificationDropdown />

            <div className="flex items-center gap-3 pl-3 border-l border-white/10">
              <div className="hidden sm:block text-right">
                <div className="text-xs font-bold text-white tracking-wide">{user.name || user.email}</div>
                <div className="mt-0.5 flex justify-end">{getRoleBadge(user.role)}</div>
              </div>

              <button
                onClick={handleLogout}
                title="Logout"
                className="px-3.5 py-1.5 rounded-xl text-[#E2E2E8] hover:text-white bg-white/5 hover:bg-[#F2CA50]/20 border border-white/15 hover:border-[#F2CA50]/40 active:scale-95 transition-all duration-200 flex items-center gap-1.5 text-xs font-bold shadow-md"
              >
                <LogOut className="w-3.5 h-3.5 text-[#F2CA50]" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-[#D0C5AF] hover:text-white text-xs font-bold transition hover:bg-white/5 border border-transparent hover:border-white/15"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4.5 py-2 rounded-xl honey-btn text-xs font-bold flex items-center gap-1.5 shadow-gold-glow"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
