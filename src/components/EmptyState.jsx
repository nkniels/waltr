import React, { useState } from 'react';
import { Camera, Plus } from 'lucide-react';
import WaltrMascot from './WaltrMascot';
import { TRANSLATIONS } from '../i18n';

export default function EmptyState({ isSearching, searchQuery, onClearSearch, onOpenAddModal, lang = 'fr' }) {
  const [imgError, setImgError] = useState(false);
  const t = (key) => TRANSLATIONS[lang]?.[key] || TRANSLATIONS['fr']?.[key] || key;

  if (isSearching) {
    return (
      <div className="py-14 px-4 text-center bg-white rounded-xl border border-neutral-200/80">
        <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center">
          <WaltrMascot variant="logo" size={48} className="opacity-40 grayscale" />
        </div>
        <p className="text-sm font-semibold text-neutral-900">
          {t('noResultsTitle')} "{searchQuery}"
        </p>
        <p className="mt-1 text-xs text-neutral-400">
          {t('noResultsDesc')}
        </p>
        <button
          onClick={onClearSearch}
          className="mt-3.5 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200/80 rounded-lg transition-colors cursor-pointer"
        >
          {t('clearSearch')}
        </button>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 text-center bg-white rounded-xl border border-neutral-200/80">
      <div className="mb-3 flex justify-center">
        {!imgError ? (
          <div className="w-48 max-w-full aspect-[4/3] rounded-xl overflow-hidden flex items-center justify-center">
            <img 
              src="/illustrations/waltr-catalog.jpg" 
              alt="waltr catalogue" 
              onError={() => setImgError(true)}
              className="w-full h-full object-contain select-none"
            />
          </div>
        ) : (
          <WaltrMascot variant="catalog" size={96} />
        )}
      </div>
      <h3 className="text-sm font-bold text-neutral-950">
        {t('emptyCatalogTitle')}
      </h3>
      <p className="mt-1 text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
        {t('emptyCatalogDesc')}
      </p>
      
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-medium rounded-xl transition-all cursor-pointer shadow-2xs hover:shadow-xs"
        >
          <Camera className="w-4 h-4 text-orange-400" />
          <span>{t('snapFirstItem')}</span>
        </button>
      </div>

      <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-mono text-neutral-400 bg-neutral-50 px-3 py-1 rounded-full border border-neutral-100">
        <span className="text-orange-500 font-semibold">{t('step1')}</span>
        <span>→</span>
        <span>{t('step2')}</span>
        <span>→</span>
        <span>{t('step3')}</span>
        <span>→</span>
        <span>{t('step4')}</span>
      </div>
    </div>
  );
}
