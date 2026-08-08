import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, CheckCheck } from 'lucide-react';

const NotificationsPage = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="space-y-8 p-4 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans text-3xl font-extrabold text-slate-900">All Notifications</h1>
          <p className="text-xs text-slate-600 mt-1">Updates on memberships, events, certificates, and announcements.</p>
        </div>

        <button
          onClick={markAllAsRead}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/20 text-[#8b5cf6] font-bold text-xs hover:bg-purple-600/30 transition border border-slate-200"
        >
          <CheckCheck className="w-4 h-4" /> Mark All as Read
        </button>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 rounded-3xl border border-slate-100 space-y-3">
        {notifications && notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`p-4 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-4 ${
                n.isRead
                  ? 'bg-white/40 border-almond-300/5 text-slate-600'
                  : 'bg-chestnut-900/20 border-slate-200 text-white font-medium'
              }`}
            >
              <div>
                <h4 className="font-sans font-bold text-[#7c3aed] text-sm">{n.title}</h4>
                <p className="text-xs text-slate-700 mt-1">{n.message}</p>
                <span className="text-[10px] text-slate-400 font-mono mt-2 block">
                  {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-xs text-slate-500">No notifications available.</div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
