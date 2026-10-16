import React from 'react';
import { 
  ShoppingBag, 
  Search, 
  X, 
  Plus, 
  Wifi, 
  WifiOff, 
  Settings, 
  LogOut, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function Header({
  articles = [],
  searchQuery,
  onSearchChange,
  onOpenAddModal,
  onOpenAuthModal,
  isMockMode,
  token,
  apiUrl,
  onRefresh,
  loading,
  onLogout
}) {
  const totalItems = articles.length;
  const inStockItems = articles.filter(a => a.stock > 0).length;
  const outOfStockItems = articles.filter(a => a.stock === 0).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner / Status bar */}
      <div className="bg-slate-900 text-white px-4 py-2 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isMockMode ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              Mode Démo / Mock Local
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              API Connectée ({apiUrl.replace(/https?:\/\//, '')})
            </span>
          )}
          <span className="hidden sm:inline text-slate-400">• Vente WhatsApp Commerce</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Paramètres de connexion API"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{token ? 'Modifier Clé API' : 'Connexion API'}</span>
          </button>
          {token && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1 text-rose-300 hover:text-rose-200 transition-colors cursor-pointer"
              title="Déconnexion"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Déconnexion</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          {/* Brand & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-sm shrink-0">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate flex items-center gap-2">
                Catalogue Boutique
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                  Admin
                </span>
              </h1>
              <p className="text-xs text-slate-500 truncate">
                Gérez facilement vos articles, prix FCFA et stocks
              </p>
            </div>
          </div>

          {/* Quick Actions (Desktop & Tablet) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 sm:px-3 sm:py-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer disabled:opacity-50"
              title="Actualiser la liste"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
              <span className="hidden sm:inline">Actualiser</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl font-semibold text-xs transition-all shadow-sm cursor-pointer shadow-emerald-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un article</span>
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-center">
          <div className="bg-slate-50 rounded-lg py-1.5 px-2">
            <div className="text-[11px] text-slate-500">Total articles</div>
            <div className="text-base sm:text-lg font-bold text-slate-800">{totalItems}</div>
          </div>
          <div className="bg-emerald-50/60 rounded-lg py-1.5 px-2">
            <div className="text-[11px] text-emerald-700 font-medium">Disponibles</div>
            <div className="text-base sm:text-lg font-bold text-emerald-600">{inStockItems}</div>
          </div>
          <div className="bg-rose-50/60 rounded-lg py-1.5 px-2">
            <div className="text-[11px] text-rose-700 font-medium">Rupture de stock</div>
            <div className="text-base sm:text-lg font-bold text-rose-600">{outOfStockItems}</div>
          </div>
        </div>

        {/* Search bar */}
        <div className="mt-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher un habit ou article par son nom..."
            className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-slate-100/90 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl outline-hidden transition-all text-slate-800 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
