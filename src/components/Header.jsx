import React from 'react';
import { 
  Search, 
  X, 
  Plus, 
  Camera, 
  Settings, 
  LogOut, 
  RefreshCw, 
  Sparkles,
  Database
} from 'lucide-react';
import WaltrMascot from './WaltrMascot';

export default function Header({
  articles = [],
  searchQuery,
  onSearchChange,
  onOpenAddModal,
  onOpenAuthModal,
  onOpenOnboarding,
  storeProfile,
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
        <div className="h-14 flex items-center justify-between gap-3">
          {/* Brand with waltr mascot logo + Connected Store Name */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <button 
              onClick={onOpenOnboarding}
              className="group flex items-center gap-2 hover:opacity-85 transition-opacity cursor-pointer shrink-0"
              title="Ouvrir le guide waltr"
            >
              <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 shadow-2xs flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                <WaltrMascot variant="logo" size={26} />
              </div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-neutral-950">
                waltr
              </span>
            </button>

            {/* Connected Store & Database Chip */}
            <button
              onClick={onOpenAuthModal}
              className="group inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono tracking-tight border transition-colors cursor-pointer text-neutral-600 border-neutral-200 hover:border-neutral-300 hover:text-neutral-900 bg-white truncate max-w-[140px] sm:max-w-[220px]"
              title="Gérer le compte et la base de données"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span className="truncate">{storeProfile?.storeName || 'Boutique'}</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Guide / Onboarding button */}
            <button
              onClick={onOpenOnboarding}
              className="p-2 text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-medium"
              title="Guide & Présentation de waltr"
            >
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="hidden md:inline text-neutral-600">Guide</span>
            </button>

            {/* Refresh */}
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
              title="Actualiser le catalogue"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-neutral-900' : ''}`} />
            </button>

            {/* Store & Database Settings */}
            <button
              onClick={onOpenAuthModal}
              className="p-2 text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              title="Compte marchand & Base de données"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Snap First Add Article Button */}
            <button
              onClick={onOpenAddModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-950 hover:bg-neutral-800 active:scale-98 text-white rounded-lg text-xs font-medium transition-all shadow-2xs cursor-pointer ml-1"
            >
              <Camera className="w-3.5 h-3.5 text-orange-400" />
              <span>Photographier un habit</span>
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
              placeholder="Rechercher un vêtement..."
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
