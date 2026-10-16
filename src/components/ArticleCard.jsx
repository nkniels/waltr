import React from 'react';
import { Edit2, Trash2, Tag, Shirt, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatFCFA } from '../utils/formatters';

export default function ArticleCard({ article, onEdit, onDelete }) {
  const isOutOfStock = article.stock === 0;
  const isLowStock = article.stock > 0 && article.stock <= 3;

  return (
    <article className={`relative bg-white rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden ${
      isOutOfStock 
        ? 'border-rose-200/80 bg-rose-50/10' 
        : 'border-slate-200/90 hover:border-slate-300'
    }`}>
      {/* Top Banner if out of stock */}
      {isOutOfStock && (
        <div className="bg-rose-500 text-white text-[11px] font-bold px-3 py-1 flex items-center justify-between tracking-wide uppercase">
          <span className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            Rupture de stock
          </span>
          <span className="text-[10px] opacity-90 font-medium">Non disponible</span>
        </div>
      )}

      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {/* Main info row: Photo Slot Placeholder + Details */}
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Reserved room for clothes photos (MVP slot ready for images) */}
          <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-xl bg-gradient-to-b from-slate-100 to-slate-200/80 border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 shrink-0 select-none group relative overflow-hidden">
            <Shirt className="w-7 h-7 sm:w-8 sm:h-8 text-slate-400/80 mb-0.5" />
            <span className="text-[9px] font-semibold text-slate-500 text-center px-1 leading-tight">
              Photo
            </span>
            <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-[8px] text-slate-600 font-medium bg-white/90 px-1 py-0.5 rounded shadow-2xs">
                Futur upload
              </span>
            </div>
          </div>

          {/* Texts & Price */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                ID #{article.id}
              </span>
              {article.category && (
                <span className="text-[10px] font-medium text-slate-500 bg-slate-100/70 px-2 py-0.5 rounded-full">
                  {article.category}
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug line-clamp-2">
              {article.nom}
            </h3>

            {/* Price in FCFA */}
            <div className="mt-1.5 flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold text-emerald-600 tracking-tight">
                {formatFCFA(article.prix)}
              </span>
            </div>
          </div>
        </div>

        {/* Stock Level Display */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium flex items-center gap-1.5">
            État du stock :
          </span>

          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1.5 font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              <AlertCircle className="w-3.5 h-3.5" />
              0 article (Épuisé)
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center gap-1.5 font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Plus que {article.stock} en stock !
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {article.stock} articles en stock
            </span>
          )}
        </div>
      </div>

      {/* Card Action Buttons: Modifier & Supprimer */}
      <div className="p-3 bg-slate-50/80 border-t border-slate-100 grid grid-cols-2 gap-2">
        <button
          onClick={() => onEdit(article)}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100/90 active:scale-95 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl font-semibold text-xs transition-all shadow-2xs cursor-pointer"
          title="Modifier cet article"
        >
          <Edit2 className="w-3.5 h-3.5 text-indigo-600" />
          <span>Modifier</span>
        </button>

        <button
          onClick={() => onDelete(article)}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-rose-50 active:scale-95 text-rose-600 hover:text-rose-700 border border-rose-200/80 hover:border-rose-300 rounded-xl font-semibold text-xs transition-all shadow-2xs cursor-pointer"
          title="Supprimer cet article"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
          <span>Supprimer</span>
        </button>
      </div>
    </article>
  );
}
