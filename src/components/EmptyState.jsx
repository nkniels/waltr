import React from 'react';
import { Plus } from 'lucide-react';
import WaltrMascot from './WaltrMascot';

export default function EmptyState({ isSearching, searchQuery, onClearSearch, onOpenAddModal }) {
  if (isSearching) {
    return (
      <div className="py-14 px-4 text-center bg-white rounded-xl border border-neutral-200/80">
        <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center">
          <WaltrMascot variant="logo" size={48} className="opacity-40 grayscale" />
        </div>
        <p className="text-sm font-semibold text-neutral-900">
          Aucun vêtement ne correspond à "{searchQuery}"
        </p>
        <p className="mt-1 text-xs text-neutral-400">
          Modifiez votre recherche ou réinitialisez le filtre.
        </p>
        <button
          onClick={onClearSearch}
          className="mt-3.5 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200/80 rounded-lg transition-colors cursor-pointer"
        >
          Effacer la recherche
        </button>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 text-center bg-white rounded-xl border border-neutral-200/80">
      <div className="mb-3 flex justify-center">
        <WaltrMascot variant="catalog" size={96} />
      </div>
      <h3 className="text-sm font-bold text-neutral-950">
        Votre catalogue est vide
      </h3>
      <p className="mt-1 text-xs text-neutral-400 max-w-xs mx-auto">
        Ajoutez votre premier vêtement pour qu'il soit disponible immédiatement sur WhatsApp.
      </p>
      <button
        onClick={onOpenAddModal}
        className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer shadow-2xs"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Ajouter mon premier article</span>
      </button>
    </div>
  );
}
