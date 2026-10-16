import React from 'react';
import { 
  Search, 
  X, 
  Camera, 
  Settings, 
  RefreshCw, 
  Sparkles
} from 'lucide-react';
import WaltrMascot from './WaltrMascot';
import { TRANSLATIONS } from '../i18n';

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
  filterStatus = 'all',
  onFilterChange = () => {},
  lang = 'fr',
  onLanguageChange = () => {}
}) {
  const t = (key) => TRANSLATIONS[lang]?.[key] || TRANSLATIONS['fr']?.[key] || key;

  const totalItems = articles.length;
  const inStockItems = articles.filter(a => a.stock > 0).length;
  const outOfStockItems = articles.filter(a => a.stock === 0).length;

  return (
    <header className="sticky top-0 z-30 bg-[#fafafa]/90 backdrop-blur-md border-b border-neutral-200/70">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Top Navbar */}
        <div className="h-14 flex items-center justify-between gap-3">
          {/* Brand: Store Name first + waltr buddy assistant */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <button 
              onClick={onOpenAuthModal}
              className="group flex items-center gap-2.5 hover:opacity-85 transition-opacity cursor-pointer text-left min-w-0"
              title={t('account')}
            >
              <div className="w-9 h-9 rounded-full bg-white border border-neutral-200 shadow-2xs flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 shrink-0">
                <WaltrMascot variant="logo" size={30} />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-sm sm:text-base font-bold tracking-tight text-neutral-950 truncate max-w-[130px] sm:max-w-[210px] leading-tight">
                    {storeProfile?.storeName || t('storeDefaultName')}
                  </h1>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0 hidden xs:inline-block"></span>
                </div>
                <div className="text-[10px] text-neutral-400 font-mono tracking-tight flex items-center gap-1 leading-none mt-0.5">
                  <span>{t('organizedWith')}</span>
                  <span className="font-semibold text-neutral-900 tracking-tight">waltr</span>
                  <span className="text-orange-500 font-bold text-[8px]">●</span>
                </div>
              </div>
            </button>

            {/* Database Chip */}
            <button
              onClick={onOpenAuthModal}
              className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono tracking-tight border transition-colors cursor-pointer text-neutral-500 border-neutral-200 hover:border-neutral-300 hover:text-neutral-900 bg-white"
              title={t('account')}
            >
              <span className="text-neutral-400">{t('database')}:</span>
              <span className="text-neutral-800 font-medium">{storeProfile?.databaseId}</span>
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Language Switcher Button (FR / EN) */}
            <div className="inline-flex items-center p-0.5 rounded-lg border border-neutral-200/90 bg-neutral-100/80 text-[11px] font-mono mr-1">
              <button
                type="button"
                onClick={() => onLanguageChange('fr')}
                className={`px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
                  lang === 'fr' 
                    ? 'bg-white text-neutral-950 shadow-2xs' 
                    : 'text-neutral-400 hover:text-neutral-800'
                }`}
                title="Afficher en Français"
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
                  lang === 'en' 
                    ? 'bg-white text-neutral-950 shadow-2xs' 
                    : 'text-neutral-400 hover:text-neutral-800'
                }`}
                title="Switch to English"
              >
                EN
              </button>
            </div>

            {/* Guide button */}
            <button
              onClick={onOpenOnboarding}
              className="p-2 text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-medium"
              title={t('guide')}
            >
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="hidden md:inline text-neutral-600">{t('guide')}</span>
            </button>

            {/* Refresh */}
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
              title={t('refresh')}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-neutral-900' : ''}`} />
            </button>

            {/* Settings */}
            <button
              onClick={onOpenAuthModal}
              className="p-2 text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              title={t('account')}
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Snap First Add Article Button */}
            <button
              onClick={onOpenAddModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-950 hover:bg-neutral-800 active:scale-98 text-white rounded-lg text-xs font-medium transition-all shadow-2xs cursor-pointer ml-0.5"
            >
              <Camera className="w-3.5 h-3.5 text-orange-400" />
              <span>{t('snapFirstBtn')}</span>
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
              placeholder={t('searchPlaceholder')}
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
              {t('all')} <span className="opacity-70 text-[10px] ml-1">{totalItems}</span>
            </button>

            <button
              onClick={() => onFilterChange('in_stock')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer shrink-0 ${
                filterStatus === 'in_stock'
                  ? 'bg-neutral-950 text-white'
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {t('inStock')} <span className="opacity-70 text-[10px] ml-1">{inStockItems}</span>
            </button>

            <button
              onClick={() => onFilterChange('out_of_stock')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer shrink-0 ${
                filterStatus === 'out_of_stock'
                  ? 'bg-neutral-950 text-white'
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {t('outOfStock')} <span className="opacity-70 text-[10px] ml-1">{outOfStockItems}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
