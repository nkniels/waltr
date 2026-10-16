import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
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
import EmptyState from './components/EmptyState';
import Toast from './components/Toast';
import OnboardingModal from './components/OnboardingModal';

export default function App() {
  // Authentication & Session State
  const [isAuthenticated, setIsAuthenticated] = useState(() => api.isAuthenticated());
  const [isMockMode, setIsMockMode] = useState(() => api.isInMockMode());
  const [token, setToken] = useState(() => api.getToken());
  const [apiUrl, setApiUrl] = useState(() => api.getBaseUrl());
  const [currentUser, setCurrentUser] = useState(() => api.getCurrentUser());

  // Catalog State
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'in_stock' | 'out_of_stock'

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deletingArticle, setDeletingArticle] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Onboarding state: opens only for users explicitly requesting it or first time in dashboard
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Fetch articles from API or Mock
  const fetchArticles = useCallback(async (query = searchQuery) => {
    if (!api.isAuthenticated()) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const data = await api.getArticles(query);
      setArticles(data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      if (err.message && (err.message.includes('401') || err.message.includes('expirée'))) {
        api.logout();
        setIsAuthenticated(false);
        showToast("Votre session a expiré. Veuillez vous reconnecter.", "error");
        return;
      }
      setErrorMessage(
        err.message || "Erreur de communication avec le serveur API."
      );
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  // Initial load when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchArticles();
    }
  }, [isAuthenticated, fetchArticles]);

  // Debounced search
  useEffect(() => {
    if (!isAuthenticated) return;
    const timer = setTimeout(() => {
      fetchArticles(searchQuery);
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery, isAuthenticated, fetchArticles]);

  // Handle Login Success (from Login screen or Settings modal)
  const handleLoginSuccess = ({ token: newToken, apiUrl: newUrl, isMock, user }) => {
    if (isMock) {
      api.loginAsDemo();
    } else if (newToken) {
      api.setCredentials(newToken, newUrl, false);
      if (user) {
        localStorage.setItem('whatsapp_shop_user', user);
      }
    }
    setIsAuthenticated(true);
    setIsMockMode(api.isInMockMode());
    setToken(api.getToken());
    setApiUrl(api.getBaseUrl());
    setCurrentUser(api.getCurrentUser());
    showToast(isMock ? "Connecté en Mode Démo" : "Connexion à la boutique réussie !");
    fetchArticles();
  };

  // Handle Logout
  const handleLogout = () => {
    api.logout();
    setIsAuthenticated(false);
    setToken('');
    setCurrentUser('');
    setIsMockMode(true);
    setArticles([]);
    showToast("Vous avez été déconnecté avec succès.", "info");
  };

  // Handle Add/Edit Submit
  const handleSaveArticle = async (articleData) => {
    setIsSubmitting(true);
    try {
      if (editingArticle) {
        const updated = await api.updateArticle(editingArticle.id, articleData);
        setArticles(prev => prev.map(item => item.id === updated.id ? updated : item));
        showToast(`Article "${updated.nom}" mis à jour.`);
      } else {
        const created = await api.createArticle(articleData);
        setArticles(prev => [created, ...prev]);
        showToast(`Article "${created.nom}" ajouté avec succès.`);
      }
      setIsFormOpen(false);
      setEditingArticle(null);
    } catch (err) {
      console.error('Save failed:', err);
      showToast(err.message || "Erreur lors de l'enregistrement.", 'error');
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
      showToast("Article supprimé du catalogue.");
      setDeletingArticle(null);
    } catch (err) {
      console.error('Delete failed:', err);
      showToast(err.message || "Erreur lors de la suppression.", 'error');
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

  const handleResetMock = () => {
    const defaults = api.resetMockData();
    setArticles(defaults);
    showToast("Données de démo réinitialisées.");
  };

  // Filter articles based on active filter
  const displayedArticles = articles.filter(article => {
    if (filterStatus === 'in_stock') return article.stock > 0;
    if (filterStatus === 'out_of_stock') return article.stock === 0;
    return true;
  });

  // SCREEN 1: Non-authenticated => Show Dedicated Login & Sign In Dashboard
  if (!isAuthenticated) {
    return (
      <>
        <Toast toast={toast} onClose={() => setToast(null)} />
        <AuthScreen
          isModal={false}
          isOpen={true}
          onLoginSuccess={handleLoginSuccess}
          currentToken={token}
          currentApiUrl={apiUrl}
          isMockMode={isMockMode}
          onResetMock={handleResetMock}
        />
      </>
    );
  }

  // SCREEN 2: Authenticated => Show Full WhatsApp Commerce Dashboard
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
        isMockMode={isMockMode}
        token={token}
        apiUrl={apiUrl}
        currentUser={currentUser}
        onRefresh={() => fetchArticles()}
        loading={loading}
        onLogout={handleLogout}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 pb-24">
        {/* Error Alert */}
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
                Réessayer
              </button>
              <button
                onClick={() => handleLoginSuccess({ token: '', apiUrl, isMock: true, user: 'Mode Démo' })}
                className="px-2.5 py-1 bg-neutral-900 text-white rounded-md font-medium transition-colors cursor-pointer"
              >
                Passer en Mode Démo
              </button>
            </div>
          </div>
        )}

        {/* Catalog Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold tracking-tight text-neutral-950">
              {searchQuery ? `Recherche "${searchQuery}"` : 'Articles du catalogue'}
            </h2>
            <span className="text-[11px] font-mono text-neutral-400">
              ({displayedArticles.length})
            </span>
          </div>

          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="text-[11px] text-neutral-400 hover:text-neutral-700 font-mono transition-colors cursor-pointer flex items-center gap-1"
            title="Revoir la présentation"
          >
            <span>waltr commerce</span>
            <span className="text-[10px]">✨</span>
          </button>
        </div>

        {/* Loading Skeletons */}
        {loading && articles.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="bg-white rounded-xl p-4 border border-neutral-200/70 animate-pulse space-y-3">
                <div className="flex gap-3">
                  <div className="w-14 h-14 bg-neutral-100 rounded-lg"></div>
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

        {/* Articles Grid or Empty State */}
        {!loading && displayedArticles.length === 0 ? (
          <EmptyState
            isSearching={Boolean(searchQuery) || filterStatus !== 'all'}
            searchQuery={searchQuery}
            onClearSearch={() => {
              setSearchQuery('');
              setFilterStatus('all');
            }}
            onOpenAddModal={handleOpenAdd}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {displayedArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onEdit={handleOpenEdit}
                onDelete={(item) => setDeletingArticle(item)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button for Mobile Thumb Ergonomics */}
      <div className="fixed bottom-5 inset-x-0 flex justify-center pointer-events-none z-20 sm:hidden">
        <button
          onClick={handleOpenAdd}
          className="pointer-events-auto px-5 py-2.5 bg-neutral-950 text-white rounded-full shadow-lg text-xs font-medium flex items-center gap-2 active:scale-95 transition-all cursor-pointer border border-neutral-800"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvel article</span>
        </button>
      </div>

      {/* Onboarding Experience Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onOpenAddModal={handleOpenAdd}
      />

      {/* Add / Edit Article Modal */}
      <ArticleFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingArticle(null);
        }}
        onSubmit={handleSaveArticle}
        articleToEdit={editingArticle}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingArticle)}
        onClose={() => setDeletingArticle(null)}
        onConfirm={handleDeleteArticle}
        article={deletingArticle}
        isDeleting={isDeleting}
      />

      {/* Auth & API Settings Modal (When logged in) */}
      <AuthScreen
        isModal={true}
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        currentToken={token}
        currentApiUrl={apiUrl}
        isMockMode={isMockMode}
        onResetMock={handleResetMock}
      />
    </div>
  );
}
