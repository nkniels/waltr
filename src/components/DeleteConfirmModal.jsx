import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { formatFCFA } from '../utils/formatters';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  article = null,
  isDeleting = false
}) {
  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={!isDeleting ? onClose : undefined}
      />

      <div className="relative bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-10 animate-slide-up sm:animate-fade-in p-5">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-3">
          <h3 className="text-base font-bold text-slate-900">
            Supprimer cet article ?
          </h3>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Êtes-vous certain de vouloir supprimer définitivement cet habit de votre catalogue de vente WhatsApp ?
          </p>

          {/* Article recap card */}
          <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="text-xs font-bold text-slate-800 truncate">
              {article.nom}
            </div>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="font-extrabold text-emerald-600">
                {formatFCFA(article.prix)}
              </span>
              <span className={`text-[11px] font-medium ${
                article.stock === 0 ? 'text-rose-600' : 'text-slate-500'
              }`}>
                Stock: {article.stock}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={() => onConfirm(article.id)}
            disabled={isDeleting}
            className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-semibold text-xs transition-all shadow-sm shadow-rose-600/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Suppression...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Supprimer</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
