import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const config = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-gradient-to-r from-green-500 to-emerald-600',
      iconColor: 'text-white',
      borderColor: 'border-green-400'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
      iconColor: 'text-white',
      borderColor: 'border-red-400'
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-gradient-to-r from-amber-500 to-orange-600',
      iconColor: 'text-white',
      borderColor: 'border-amber-400'
    },
    info: {
      icon: Info,
      bgColor: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      iconColor: 'text-white',
      borderColor: 'border-blue-400'
    }
  };

  const { icon: Icon, bgColor, iconColor, borderColor } = config[type];

  return (
    <div
      className={`${bgColor} ${borderColor} border-l-4 rounded-lg shadow-2xl p-4 flex items-center justify-between min-w-[320px] max-w-md animate-slide-in-right`}
      style={{
        animation: 'slideInRight 0.3s ease-out'
      }}
    >
      <div className="flex items-center space-x-3">
        <Icon className={`h-6 w-6 ${iconColor} flex-shrink-0`} />
        <p className="text-white font-medium text-sm">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-white hover:text-gray-200 transition-colors flex-shrink-0"
      >
        <X className="h-5 w-5" />
      </button>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
