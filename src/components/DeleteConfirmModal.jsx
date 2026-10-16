import React from 'react';
import { Trash2, X } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-4 bg-neutral-900/30 backdrop-blur-xs transition-opacity animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={!isDeleting ? onClose : undefined}
      />

      <div className="relative bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl border border-neutral-200/80 shadow-xl overflow-hidden z-10 animate-slide-up sm:animate-fade-in p-5">
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-semibold text-neutral-950 tracking-tight">
            Supprimer l'article
          </h3>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
          Êtes-vous sûr de vouloir retirer <span className="font-medium text-neutral-900">"{article.nom}"</span> du catalogue ? Cette action est irréversible.
        </p>

        {/* Minimal Item Preview */}
        <div className="mt-3.5 p-3 rounded-lg bg-neutral-50 border border-neutral-200/60 flex items-center justify-between text-xs">
          <span className="font-medium text-neutral-800 truncate mr-2">
            {article.nom}
          </span>
          <span className="font-mono font-medium text-neutral-900 shrink-0">
            {formatFCFA(article.prix)}
          </span>
        </div>

        {/* Buttons */}
        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-3.5 py-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={() => onConfirm(article.id)}
            disabled={isDeleting}
            className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
