import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Camera, 
  AlertCircle, 
  RefreshCw, 
  Sparkles 
} from 'lucide-react';
import { api } from './api';
import Header from './components/Header';
import ArticleCard from './components/ArticleCard';
import ArticleFormModal from './components/ArticleFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import AuthScreen from './components/AuthScreen';
import FirstLoginModal from './components/FirstLoginModal';
import EmptyState from './components/EmptyState';
import Toast from './components/Toast';
import OnboardingModal from './components/OnboardingModal';
import { TRANSLATIONS, getInitialLanguage, saveLanguage } from './i18n';

export default function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'in_stock' | 'out_of_stock'

  // Internationalisation (FR / EN)
  const [lang, setLang] = useState(() => getInitialLanguage());

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    saveLanguage(newLang);
  };

  const t = (key, params = {}) => {
    let str = TRANSLATIONS[lang]?.[key] || TRANSLATIONS['fr']?.[key] || key;
    Object.entries(params).forEach(([k, v]) => {
      str = str.replace(`{${k}}`, v);
    });
    return str;
  };

  // Store Profile & Multi-tenant Database
  const [storeProfile, setStoreProfile] = useState(() => api.getStoreProfile());
  const [isMustChangePassword, setIsMustChangePassword] = useState(() => api.isMustChangePassword());
  const [isLoggedIn, setIsLoggedIn] = useState(() => api.isAuthenticated());

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deletingArticle, setDeletingArticle] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Onboarding state : ouvert sur demande via le bouton "Guide" pour un état initial épuré
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Fetch articles from connected database
  const fetchArticles = useCallback(async (query = searchQuery) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const data = await api.getArticles(query);
      setArticles(data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setErrorMessage(
        err.message || (lang === 'en' ? "Failed to connect to the store database." : "Erreur de connexion avec la base de données de la boutique.")
      );
    } finally {
      setLoading(false);
    }
  }, [searchQuery, lang]);

  // Initial load
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchArticles(searchQuery);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchArticles]);

  // Handle Create or Update (With photo!)
  const handleSaveArticle = async (articleData) => {
    setIsSubmitting(true);
    try {
      if (editingArticle) {
        const updated = await api.updateArticle(editingArticle.id, articleData);
        setArticles(prev => prev.map(item => item.id === editingArticle.id ? updated : item));
        showToast(t('articleUpdated', { nom: updated.nom }));
      } else {
        const created = await api.createArticle(articleData);
        setArticles(prev => [created, ...prev]);
        showToast(t('articleAdded', { nom: created.nom }));
      }
      setIsFormOpen(false);
      setEditingArticle(null);
    } catch (err) {
      console.error('Save failed:', err);
      showToast(err.message || (lang === 'en' ? "Error saving item." : "Erreur lors de l'enregistrement."), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete
  const handleDeleteArticle = async (id) => {
    setIsDeleting(true);
    try {
      await api.deleteArticle(id);
      setArticles(prev => prev.filter(item => item.id !== id));
      showToast(t('articleDeleted'));
      setDeletingArticle(null);
    } catch (err) {
      console.error('Delete failed:', err);
      showToast(err.message || (lang === 'en' ? "Error deleting item." : "Erreur lors de la suppression."), 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenEdit = (article) => {
    setEditingArticle(article);
    setIsFormOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingArticle(null);
    setIsFormOpen(true);
  };

  // First Login Password Creation
  const handlePasswordCreated = async (newPassword) => {
    await api.createNewPassword(newPassword);
    setIsMustChangePassword(false);
    setIsLoggedIn(true);
    setStoreProfile(api.getStoreProfile());
    showToast(t('passwordCreatedSuccess'));
  };

  // Merchant Sign In
  const handleLogin = async (email, password) => {
    const res = await api.login(email, password);
    setStoreProfile(api.getStoreProfile());
    setIsLoggedIn(true);
    setIsMustChangePassword(res.mustChangePassword);
    if (res.mustChangePassword) {
      showToast(t('firstLoginDetected'), "info");
    } else {
      showToast(t('connectedTo', { store: storeProfile.storeName }));
    }
    fetchArticles();
  };

  const handleDemoLogin = () => {
    api.loginDemo();
    setStoreProfile(api.getStoreProfile());
    setIsLoggedIn(true);
    setIsMustChangePassword(false);
    showToast(t('demoActivated'));
    fetchArticles();
  };

  const handleLogout = () => {
    api.logout();
    setIsLoggedIn(false);
    showToast(t('logoutSuccess'), "info");
  };

  // Remise à l'état propre (0 articles)
  const handleClearDatabase = () => {
    api.clearDatabase();
    setArticles([]);
    showToast(t('databaseCleared'), "info");
  };

  // Chargement d'articles exemples de test (optionnel)
  const handleLoadSamples = () => {
    const samples = api.loadSampleArticles();
    setArticles(samples);
    showToast(t('samplesLoaded'));
  };

  // Filter articles based on active filter
  const displayedArticles = articles.filter(article => {
    if (filterStatus === 'in_stock') return article.stock > 0;
    if (filterStatus === 'out_of_stock') return article.stock === 0;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-['Inter',-apple-system,sans-serif] text-neutral-900">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header Bar */}
      <Header
        articles={articles}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAddModal={handleOpenAdd}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        storeProfile={storeProfile}
        onRefresh={() => fetchArticles()}
        loading={loading}
        onLogout={handleLogout}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        lang={lang}
        onLanguageChange={handleLanguageChange}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 pb-24">
        {/* Understated Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-white border border-neutral-200 text-neutral-800 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
              <span className="text-neutral-600">{errorMessage}</span>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => fetchArticles()}
                className="px-2.5 py-1 text-neutral-700 hover:text-neutral-950 font-medium hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
              >
                {t('retry')}
              </button>
            </div>
          </div>
        )}

        {/* Catalog Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold tracking-tight text-neutral-950">
              {searchQuery ? `${t('searchTitle')} "${searchQuery}"` : t('catalogTitle')}
            </h2>
            <span className="text-[11px] font-mono text-neutral-400">
              ({displayedArticles.length})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-neutral-400 font-mono hidden xs:inline">
              {t('database')} : {storeProfile?.databaseId}
            </span>
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="text-[11px] text-neutral-500 hover:text-neutral-950 font-medium transition-colors cursor-pointer flex items-center gap-1"
              title={t('guide')}
            >
              <span>{t('guide')}</span>
              <span className="text-orange-500">✨</span>
            </button>
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && articles.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="bg-white rounded-xl p-4 border border-neutral-200/70 animate-pulse space-y-3">
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-neutral-100 rounded-xl"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3.5 bg-neutral-100 rounded w-3/4"></div>
                    <div className="h-4 bg-neutral-100 rounded w-1/3"></div>
                  </div>
                </div>
                <div className="h-px bg-neutral-100"></div>
                <div className="flex justify-end gap-2 pt-1">
                  <div className="h-6 w-16 bg-neutral-100 rounded"></div>
                  <div className="h-6 w-16 bg-neutral-100 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Articles Grid */}
        {!loading && displayedArticles.length === 0 ? (
          <EmptyState
            isSearching={Boolean(searchQuery) || filterStatus !== 'all'}
            searchQuery={searchQuery}
            onClearSearch={() => {
              setSearchQuery('');
              setFilterStatus('all');
            }}
            onOpenAddModal={handleOpenAdd}
            lang={lang}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {displayedArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onEdit={handleOpenEdit}
                onDelete={(item) => setDeletingArticle(item)}
                lang={lang}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button for Mobile: Snap Photo */}
      <div className="fixed bottom-5 inset-x-0 flex justify-center pointer-events-none z-20 sm:hidden">
        <button
          onClick={handleOpenAdd}
          className="pointer-events-auto px-5 py-2.5 bg-neutral-950 text-white rounded-full shadow-lg text-xs font-medium flex items-center gap-2 active:scale-95 transition-all cursor-pointer border border-neutral-800"
        >
          <Camera className="w-4 h-4 text-orange-400" />
          <span>{t('snapClothing')}</span>
        </button>
      </div>

      {/* First Login Password Creation Modal (Prompted when user arrives via invite / first sign in) */}
      <FirstLoginModal
        isOpen={isMustChangePassword}
        storeProfile={storeProfile}
        onPasswordCreated={handlePasswordCreated}
        lang={lang}
      />

      {/* Onboarding Experience Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onOpenAddModal={handleOpenAdd}
        lang={lang}
      />

      {/* "Snap First" Add / Edit Article Form Modal */}
      <ArticleFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingArticle(null);
        }}
        onSubmit={handleSaveArticle}
        articleToEdit={editingArticle}
        isSubmitting={isSubmitting}
        lang={lang}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingArticle)}
        onClose={() => setDeletingArticle(null)}
        onConfirm={handleDeleteArticle}
        article={deletingArticle}
        isDeleting={isDeleting}
        lang={lang}
      />

      {/* Account, Store, & Database Management Modal */}
      <AuthScreen
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        storeProfile={storeProfile}
        onLogin={handleLogin}
        onDemoLogin={handleDemoLogin}
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
        onClearDatabase={handleClearDatabase}
        onLoadSamples={handleLoadSamples}
        lang={lang}
      />
    </div>
  );
}
