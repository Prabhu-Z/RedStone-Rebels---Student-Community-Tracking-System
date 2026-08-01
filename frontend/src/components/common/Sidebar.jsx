import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  CheckSquare,
  Clock,
  Award,
  FileCheck,
  Megaphone,
  BarChart3,
  Search,
  FileText,
  Bell,
  CheckCircle2,
  FolderKanban,
  UserCheck,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Trophy
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  if (!user) return null;

  const role = user.role;

  const studentLinks = [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/my-communities', icon: FolderKanban, label: 'My Joined Communities' },
    { to: '/student/tasks', icon: CheckSquare, label: 'Tasks & Proofs' },
    { to: '/student/activity-requests', icon: Sparkles, label: 'Activity Requests' },
    { to: '/student/leaderboard', icon: Trophy, label: 'Community Leaderboard' },
    { to: '/student/communities', icon: Users, label: 'Explore Communities' },
    { to: '/student/events', icon: Calendar, label: 'Events & Registration' },
    { to: '/student/attendance', icon: CheckSquare, label: 'My Attendance' },
    { to: '/student/timeline', icon: Clock, label: 'Activity Timeline' },
    { to: '/student/volunteer-hours', icon: CheckCircle2, label: 'Volunteer Hours' },
    { to: '/student/achievements', icon: Award, label: 'Achievements' },
    { to: '/student/certificates', icon: FileCheck, label: 'Certificates' },
    { to: '/student/notifications', icon: Bell, label: 'Notifications' },
  ];

  const coordinatorLinks = [
    { to: '/coordinator/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/coordinator/community', icon: FolderKanban, label: 'Community Info' },
    { to: '/coordinator/tasks', icon: CheckSquare, label: 'Task Assignments' },
    { to: '/coordinator/activity-requests', icon: Sparkles, label: 'Activity Requests' },
    { to: '/coordinator/leaderboard', icon: Trophy, label: 'Member Leaderboard' },
    { to: '/coordinator/student-search', icon: Search, label: 'Member Student Search' },
    { to: '/coordinator/membership-requests', icon: Users, label: 'Pending Requests' },
    { to: '/coordinator/events', icon: Calendar, label: 'Event Management' },
    { to: '/coordinator/attendance', icon: CheckSquare, label: 'Record Attendance' },
    { to: '/coordinator/activities', icon: Clock, label: 'Activity Logging' },
    { to: '/coordinator/volunteer-hours', icon: CheckCircle2, label: 'Verify Hours' },
    { to: '/coordinator/announcements', icon: Megaphone, label: 'Announcements' },
    { to: '/coordinator/reports', icon: FileText, label: 'Community Reports' },
  ];

  const facultyLinks = [
    { to: '/faculty/dashboard', icon: LayoutDashboard, label: 'College Dashboard' },
    { to: '/faculty/leaderboards', icon: Trophy, label: 'Campus Leaderboards' },
    { to: '/faculty/communities', icon: Users, label: 'All 30+ Communities' },
    { to: '/faculty/coordinator-search', icon: UserCheck, label: 'Coordinator Search' },
    { to: '/faculty/student-search', icon: Search, label: 'Student Search' },
    { to: '/faculty/analytics', icon: BarChart3, label: 'Participation Analytics' },
    { to: '/faculty/reports', icon: FileText, label: 'College Reports' },
  ];

  let links = [];
  if (role === 'ROLE_STUDENT') links = studentLinks;
  else if (role === 'ROLE_COMMUNITY_COORDINATOR') links = coordinatorLinks;
  else if (role === 'ROLE_FACULTY') links = facultyLinks;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 z-40 lg:z-20 h-full lg:h-[calc(100vh-4rem)] w-64 sidebar-glass flex flex-col transition-transform duration-300 ease-in-out border-r border-white/10 flex-shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            {role === 'ROLE_STUDENT' && <GraduationCap className="w-5 h-5 text-[#F2CA50]" />}
            {role === 'ROLE_COMMUNITY_COORDINATOR' && <ShieldCheck className="w-5 h-5 text-[#F2CA50]" />}
            {role === 'ROLE_FACULTY' && <Sparkles className="w-5 h-5 text-[#F2CA50]" />}
            <h2 className="text-sm font-bold text-[#E2E2E8] tracking-tight">
              {role === 'ROLE_STUDENT' && 'Student Workspace'}
              {role === 'ROLE_COMMUNITY_COORDINATOR' && 'Coordinator Workspace'}
              {role === 'ROLE_FACULTY' && 'Faculty Workspace'}
            </h2>
          </div>
          <p className="text-[10px] text-[#F2CA50] opacity-80 mt-1 font-mono uppercase tracking-wider">SCTS Campus Platform</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-3.5 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#F2CA50] to-[#FFE088] text-[#3C2F00] font-extrabold shadow-gold-glow translate-x-1'
                      : 'text-[#D0C5AF] hover:text-white hover:bg-white/5 hover:translate-x-1.5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#3C2F00] font-black' : 'text-[#F2CA50] group-hover:scale-110 transition-transform'}`} />
                      <span>{link.label}</span>
                    </div>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3C2F00] animate-ping" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 shadow-inner hover:border-[#F2CA50]/30 transition">
            <div className="w-8 h-8 rounded-full bg-[#F2CA50] flex items-center justify-center text-[#3C2F00] font-bold text-xs shadow-md">
              {user.name ? user.name[0] : 'U'}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">{user.name || 'User'}</div>
              <div className="text-[10px] text-[#D0C5AF] truncate font-mono">{user.email}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
