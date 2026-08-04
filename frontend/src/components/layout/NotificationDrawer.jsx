import React from 'react';
import { X, Bell, CheckCircle2, Award, Calendar, AlertCircle } from 'lucide-react';

const mockNotifications = [
  { id: 1, title: 'Task Verified! (+5 Pts)', message: 'Your Coding Club Hackathon Submission proof was verified.', time: '10 mins ago', type: 'points' },
  { id: 2, title: 'Membership Approved', message: 'You are now an approved member of Robotics Club.', time: '1 hour ago', type: 'membership' },
  { id: 3, title: 'Upcoming Event Tomorrow', message: 'Annual AI & ML Summit starts at 10:00 AM in Main Hall.', time: '3 hours ago', type: 'event' },
  { id: 4, title: 'Activity Claim Approved (+10 Pts)', message: 'Your Google Cloud Certification claim was approved by Coordinator.', time: '1 day ago', type: 'claim' },
];

const NotificationDrawer = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel-apple border-l border-white/15 p-6 shadow-2xl flex flex-col justify-between text-white">
          
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#F2CA50]" />
                <h3 className="text-lg font-bold text-white">Notifications</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#F2CA50]/20 text-[#F2CA50] text-[10px] font-mono font-bold">
                  {mockNotifications.length} New
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-160px)] pr-1">
              {mockNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#F2CA50]/40 transition space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F2CA50] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {notif.title}
                    </span>
                    <span className="text-[10px] font-mono text-[#D0C5AF]/60">{notif.time}</span>
                  </div>
                  <p className="text-xs text-[#E2E2E8] leading-relaxed">{notif.message}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-center">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition"
            >
              Close Notification Center
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NotificationDrawer;
