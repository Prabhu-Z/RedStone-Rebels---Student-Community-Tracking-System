import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, CheckCheck } from 'lucide-react';

const NotificationsPage = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="space-y-8 p-4 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-extrabold text-white">All Notifications</h1>
          <p className="text-xs text-stardustsilver-300/70 mt-1">Updates on memberships, events, certificates, and announcements.</p>
        </div>

        <button
          onClick={markAllAsRead}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-warmgold-500/20 text-warmgold-300 font-bold text-xs hover:bg-warmgold-500/30 transition border border-warmgold-500/30"
        >
          <CheckCheck className="w-4 h-4" /> Mark All as Read
        </button>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-stardustsilver-300/15 space-y-3">
        {notifications && notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`p-4 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-4 ${
                n.isRead
                  ? 'bg-arsenic-900/40 border-almond-300/5 text-stardustsilver-300/70'
                  : 'bg-chestnut-900/20 border-warmgold-500/30 text-white font-medium'
              }`}
            >
              <div>
                <h4 className="font-serif font-bold text-warmgold-400 text-sm">{n.title}</h4>
                <p className="text-xs text-almond-200 mt-1">{n.message}</p>
                <span className="text-[10px] text-stardustsilver-300/40 font-mono mt-2 block">
                  {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-xs text-stardustsilver-300/50">No notifications available.</div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
