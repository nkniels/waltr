import React from 'react';
import { PackageOpen, Plus, SearchX } from 'lucide-react';

export default function EmptyState({ isSearching, searchQuery, onClearSearch, onOpenAddModal }) {
  if (isSearching) {
    return (
      <div className="py-12 px-4 text-center bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <SearchX className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">
          Aucun vêtement ne correspond à "{searchQuery}"
        </h3>
        <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">
          Vérifiez l'orthographe du nom ou réinitialisez la recherche.
        </p>
        <button
          onClick={onClearSearch}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
        >
          Effacer la recherche
        </button>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 text-center bg-white rounded-2xl border border-dashed border-slate-300 shadow-2xs">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
        <PackageOpen className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-slate-800">
        Votre catalogue est vide
      </h3>
      <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
        Commencez par ajouter votre premier habit ou vêtement pour qu'il soit disponible sur waltr et votre boutique WhatsApp.
      </p>
      <button
        onClick={onOpenAddModal}
        className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold rounded-xl transition-all shadow-sm shadow-emerald-600/20 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Ajouter mon premier article
      </button>
    </div>
  );
}
