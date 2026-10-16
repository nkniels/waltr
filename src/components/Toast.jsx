import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none animate-slide-up">
      <div className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-neutral-950 text-white shadow-lg border border-neutral-800 text-xs font-medium">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
          toast.type === 'error' ? 'bg-rose-400' : 'bg-emerald-400'
        }`}></span>
        <span>{toast.message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-neutral-400 hover:text-white p-0.5 rounded cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
