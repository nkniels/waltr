import React from 'react';
import { Shirt, Edit3, Trash2 } from 'lucide-react';
import { formatFCFA } from '../utils/formatters';
import { TRANSLATIONS } from '../i18n';

export default function ArticleCard({ article, onEdit, onDelete, lang = 'fr' }) {
  const t = (key) => TRANSLATIONS[lang]?.[key] || TRANSLATIONS['fr']?.[key] || key;
  const isOutOfStock = article.stock === 0;
  const isLowStock = article.stock > 0 && article.stock <= 3;

  return (
    <article className={`group relative bg-white rounded-xl border transition-all duration-150 flex flex-col justify-between overflow-hidden ${
      isOutOfStock 
        ? 'border-neutral-200/60 bg-neutral-50/30' 
        : 'border-neutral-200/80 hover:border-neutral-300 hover:shadow-2xs'
    }`}>
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row: ID + Stock status badge */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-[11px] font-mono text-neutral-400">
              #{article.id}
            </span>

            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
                {t('soldOut')}
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                {article.stock} {article.stock > 1 ? t('unitsLeftPlural') : t('unitsLeft')}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium text-neutral-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {article.stock} {t('inStockCount')}
              </span>
            )}
          </div>

          {/* Main Info with Real Snapped Photo Thumbnail */}
          <div className="flex items-start gap-3.5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-neutral-100 border border-neutral-200/70 overflow-hidden flex items-center justify-center text-neutral-400 shrink-0 select-none">
              {article.image ? (
                <img
                  src={article.image}
                  alt={article.nom}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <Shirt className="w-6 h-6 text-neutral-400 stroke-[1.5]" />
              )}
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              <h3 className={`text-sm sm:text-base font-semibold tracking-tight text-neutral-900 leading-snug line-clamp-2 ${
                isOutOfStock ? 'text-neutral-500 line-through decoration-neutral-300' : ''
              }`}>
                {article.nom}
              </h3>

              <div className="mt-1.5 font-bold text-neutral-950 text-base sm:text-lg tracking-tight">
                {formatFCFA(article.prix)}
              </div>
            </div>
          </div>
        </div>

        {/* Card Actions: Minimalist footer */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-end gap-1.5">
          <button
            onClick={() => onEdit(article)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            title={t('edit')}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{t('edit')}</span>
          </button>

          <button
            onClick={() => onDelete(article)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title={t('delete')}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t('delete')}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
