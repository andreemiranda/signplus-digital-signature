
import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-emerald-600 border-emerald-400',
    error: 'bg-red-600 border-red-400',
    info: 'bg-blue-600 border-blue-400'
  };

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  };

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-3 rounded-xl shadow-2xl text-white border animate-in slide-in-from-bottom-4 duration-300 ${styles[type]}`}>
      <span className="text-xl">{icons[type]}</span>
      <p className="font-bold text-sm">{message}</p>
      <button onClick={onClose} className="ml-4 opacity-70 hover:opacity-100 text-lg">&times;</button>
    </div>
  );
};

export default Toast;
