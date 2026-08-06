import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'WARNING': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'ERROR': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'INFO':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBorderColorForType = (type: string) => {
    switch (type) {
      case 'SUCCESS': return 'border-l-green-500';
      case 'WARNING': return 'border-l-yellow-500';
      case 'ERROR': return 'border-l-red-500';
      case 'INFO':
      default:
        return 'border-l-blue-500';
    }
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return interval + " years ago";
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return interval + " months ago";
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return interval + " days ago";
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + " hours ago";
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-6 h-6 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 flex flex-col max-h-[80vh]">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={(e) => { e.stopPropagation(); markAllAsRead(); }}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                No new notifications
              </div>
            ) : (
              notifications.map((notification) => {
                // Determine if read by checking if we still have unread in context
                // Well, the read status isn't exposed directly per-notification from context unless we check localStorage
                // Let's just track read status locally or rely on context
                const stored = localStorage.getItem('readNotifications');
                const readIds = stored ? new Set(JSON.parse(stored)) : new Set();
                const isRead = readIds.has(notification.id);

                return (
                  <div 
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`p-3 rounded-lg border-l-4 ${getBorderColorForType(notification.type)} bg-white dark:bg-slate-800 shadow-sm cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-700/80 ${!isRead ? 'opacity-100' : 'opacity-60'}`}
                  >
                    <div className="flex gap-3">
                      <div className="shrink-0 mt-0.5">
                        {getIconForType(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <p className={`text-sm font-semibold truncate ${!isRead ? 'text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}`}>
                            {notification.title}
                          </p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">
                            {timeAgo(notification.createdAt)}
                          </span>
                        </div>
                        <p className={`text-xs mt-1 break-words ${!isRead ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-500'}`}>
                          {notification.message}
                        </p>
                      </div>
                      {!isRead && (
                        <div className="shrink-0 flex items-center justify-center w-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
