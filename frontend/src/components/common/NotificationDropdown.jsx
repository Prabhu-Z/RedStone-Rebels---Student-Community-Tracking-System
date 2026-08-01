import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, Check, CheckCheck } from 'lucide-react';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl text-almond-200 hover:text-white hover:bg-arsenic-800 transition"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-chestnut-600 text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel rounded-2xl border border-warmgold-500/30 shadow-2xl z-50 p-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-stardustsilver-300/15">
              <h4 className="font-serif text-sm font-bold text-warmgold-400">Notifications</h4>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[11px] text-morning-300 hover:underline flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                      n.isRead
                        ? 'bg-arsenic-900/40 border-almond-300/5 text-stardustsilver-300/60'
                        : 'bg-chestnut-900/20 border-warmgold-500/30 text-almond-100 font-medium'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-warmgold-400">{n.title}</span>
                      <span className="text-[10px] text-stardustsilver-300/40">
                        {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <p className="mt-1 text-almond-200/90 leading-relaxed">{n.message}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-stardustsilver-300/50">
                  No notifications
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;
