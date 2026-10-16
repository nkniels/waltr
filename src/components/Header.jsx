import React from 'react';
import { 
  Search, 
  X, 
  Plus, 
  Settings, 
  LogOut, 
  RefreshCw
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
  onLogout,
  filterStatus = 'all',
  onFilterChange = () => {}
}) {
  const totalItems = articles.length;
  const inStockItems = articles.filter(a => a.stock > 0).length;
  const outOfStockItems = articles.filter(a => a.stock === 0).length;

  return (
    <header className="sticky top-0 z-30 bg-[#fafafa]/90 backdrop-blur-md border-b border-neutral-200/70">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Top Navbar */}
        <div className="h-14 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <a 
              href="#" 
              className="text-lg font-semibold tracking-tight text-neutral-950 hover:opacity-80 transition-opacity flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-neutral-950 inline-block"></span>
              waltr
            </a>

            <button
              onClick={onOpenAuthModal}
              className="group inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono tracking-tight border transition-colors cursor-pointer text-neutral-600 border-neutral-200 hover:border-neutral-300 hover:text-neutral-900 bg-white"
              title="Configurer l'API ou le mode démo"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                isMockMode ? 'bg-amber-500' : 'bg-emerald-500'
              }`}></span>
              <span>{isMockMode ? 'démo' : 'api connectée'}</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
              title="Actualiser le catalogue"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-neutral-900' : ''}`} />
            </button>

            <button
              onClick={onOpenAuthModal}
              className="p-2 text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              title="Paramètres API"
            >
              <Settings className="w-4 h-4" />
            </button>

            {token && (
              <button
                onClick={onLogout}
                className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                title="Déconnexion"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onOpenAddModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-950 hover:bg-neutral-800 active:scale-98 text-white rounded-lg text-xs font-medium transition-all shadow-2xs cursor-pointer ml-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter un article</span>
            </button>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="py-2.5 border-t border-neutral-200/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher un article..."
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-neutral-200/80 rounded-lg placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-950 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Minimalist Segmented Filters */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => onFilterChange('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer shrink-0 ${
                filterStatus === 'all'
                  ? 'bg-neutral-950 text-white'
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              Tous <span className="opacity-70 text-[10px] ml-1">{totalItems}</span>
            </button>

            <button
              onClick={() => onFilterChange('in_stock')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer shrink-0 ${
                filterStatus === 'in_stock'
                  ? 'bg-neutral-950 text-white'
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              En stock <span className="opacity-70 text-[10px] ml-1">{inStockItems}</span>
            </button>

            <button
              onClick={() => onFilterChange('out_of_stock')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer shrink-0 ${
                filterStatus === 'out_of_stock'
                  ? 'bg-neutral-950 text-white'
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              Rupture <span className="opacity-70 text-[10px] ml-1">{outOfStockItems}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
