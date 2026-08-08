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
        className="relative p-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-chestnut-600 text-slate-900 font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-slate-200 shadow-sm rounded-3xl rounded-2xl border border-slate-200 shadow-2xl z-50 p-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
              <h4 className="font-sans text-sm font-bold text-[#7c3aed]">Notifications</h4>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[11px] text-[#8b5cf6] hover:underline flex items-center gap-1"
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
                        ? 'bg-white/40 border-almond-300/5 text-slate-500'
                        : 'bg-chestnut-900/20 border-slate-200 text-almond-100 font-medium'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-sans font-bold text-[#7c3aed]">{n.title}</span>
                      <span className="text-[10px] text-slate-400">
                        {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <p className="mt-1 text-slate-700/90 leading-relaxed">{n.message}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-slate-500">
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
