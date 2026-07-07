import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    // Start exit animation first
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isExiting: true } : notif
      )
    );

    // Remove from state after animation completes (300ms)
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, 300);
  }, []);

  const showNotification = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    
    setNotifications((prev) => [
      ...prev,
      { id, message, type, duration, isExiting: false },
    ]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  }, [removeNotification]);

  // Shortcut methods
  const success = useCallback((msg, duration) => showNotification(msg, 'success', duration), [showNotification]);
  const error = useCallback((msg, duration) => showNotification(msg, 'error', duration), [showNotification]);
  const warn = useCallback((msg, duration) => showNotification(msg, 'warning', duration), [showNotification]);
  const info = useCallback((msg, duration) => showNotification(msg, 'info', duration), [showNotification]);

  return (
    <NotificationContext.Provider value={{ showNotification, success, error, warn, info }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-md w-[calc(100%-2.5rem)] pointer-events-none px-4 md:px-0">
        {notifications.map((notif) => (
          <ToastItem
            key={notif.id}
            notification={notif}
            onClose={() => removeNotification(notif.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

const ToastItem = ({ notification, onClose }) => {
  const { message, type, isExiting } = notification;

  // Select icon and colors based on type
  let Icon = Info;
  let iconColor = 'text-purple-400';
  let borderColor = 'border-purple-500/20';
  
  if (type === 'success') {
    Icon = CheckCircle2;
    iconColor = 'text-emerald-400';
    borderColor = 'border-emerald-500/20';
  } else if (type === 'error') {
    Icon = AlertCircle;
    iconColor = 'text-rose-400';
    borderColor = 'border-rose-500/20';
  } else if (type === 'warning') {
    Icon = AlertTriangle;
    iconColor = 'text-amber-400';
    borderColor = 'border-amber-500/20';
  }

  return (
    <div
      className={`
        w-full md:max-w-sm pointer-events-auto flex items-start gap-3 p-4
        bg-[#16171d]/95 backdrop-blur-md border ${borderColor} rounded-xl
        shadow-2xl shadow-black/40 text-zinc-100 transition-all duration-300
        ${isExiting ? 'animate-slide-out' : 'animate-slide-in'}
      `}
    >
      <div className={`mt-0.5 shrink-0 ${iconColor}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 text-sm font-medium leading-5 break-words">
        {message}
      </div>
      <button
        onClick={onClose}
        className="shrink-0 text-zinc-500 hover:text-zinc-300 transition-colors p-0.5 rounded-lg hover:bg-zinc-800/50 cursor-pointer"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
