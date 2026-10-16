import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 pointer-events-none animate-slide-up">
      <div className={`pointer-events-auto flex items-center justify-between gap-2.5 p-3.5 rounded-2xl shadow-lg border ${
        isSuccess 
          ? 'bg-emerald-950 text-white border-emerald-800' 
          : isError
          ? 'bg-rose-950 text-white border-rose-800'
          : 'bg-slate-900 text-white border-slate-700'
      }`}>
        <div className="flex items-center gap-2.5 min-w-0">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          {!isSuccess && !isError && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}

          <div className="text-xs font-semibold truncate leading-tight">
            {toast.message}
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-white/60 hover:text-white p-1 rounded-lg shrink-0 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
