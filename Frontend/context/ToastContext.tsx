'use client';

import React, { createContext, useContext, useState, useCallback, PropsWithChildren } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Floating Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2.5 max-w-md w-full pointer-events-none p-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border animate-slide-in transition-all duration-300 bg-white dark:bg-zinc-900 ${
              toast.type === 'success' ? 'border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-400' :
              toast.type === 'error' ? 'border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-450' :
              toast.type === 'warning' ? 'border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-450' :
              'border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300'
            }`}
          >
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
              {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />}
              {toast.type === 'warning' && <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
              {toast.type === 'info' && <Info className="h-5 w-5 text-zinc-650 dark:text-zinc-400" />}
            </div>

            {/* Message */}
            <div className="flex-1 text-sm font-semibold tracking-tight leading-snug">
              {toast.message}
            </div>

            {/* Close Button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-0.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-850"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
