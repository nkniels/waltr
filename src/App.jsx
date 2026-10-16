import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  AlertCircle, 
  RefreshCw, 
  Sparkles, 
  Check, 
  Layers, 
  HelpCircle,
  PackageX
} from 'lucide-react';
import { api } from './api';
import Header from './components/Header';
import ArticleCard from './components/ArticleCard';
import ArticleFormModal from './components/ArticleFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import AuthScreen from './components/AuthScreen';
import EmptyState from './components/EmptyState';
import Toast from './components/Toast';

export default function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deletingArticle, setDeletingArticle] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Toast state
  const [toast, setToast] = useState(null);

  // API Config state
  const [isMockMode, setIsMockMode] = useState(api.isInMockMode());
  const [token, setToken] = useState(api.getToken());
  const [apiUrl, setApiUrl] = useState(api.getBaseUrl());

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Fetch articles from API or Mock
  const fetchArticles = useCallback(async (query = searchQuery) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const data = await api.getArticles(query);
      setArticles(data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setErrorMessage(
        err.message || "Erreur de connexion avec le serveur API. Vérifiez votre URL ou passez en Mode Démo."
      );
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  // Initial load
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchArticles(searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchArticles]);

  // Handle Create or Update
  const handleSaveArticle = async (articleData) => {
    setIsSubmitting(true);
    try {
      if (editingArticle) {
        // Update existing article (PUT /api/articles/{id}/)
        const updated = await api.updateArticle(editingArticle.id, articleData);
        setArticles(prev => prev.map(item => item.id === editingArticle.id ? updated : item));
        showToast(`Article "${updated.nom}" mis à jour avec succès !`, 'success');
      } else {
        // Create new article (POST /api/articles/)
        const created = await api.createArticle(articleData);
        setArticles(prev => [created, ...prev]);
        showToast(`Article "${created.nom}" ajouté au catalogue !`, 'success');
      }
      setIsFormOpen(false);
      setEditingArticle(null);
    } catch (err) {
      console.error('Save failed:', err);
      showToast(err.message || "Erreur lors de l'enregistrement de l'article.", 'error');
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
      showToast("L'article a été supprimé du catalogue.", 'success');
      setDeletingArticle(null);
    } catch (err) {
      console.error('Delete failed:', err);
      showToast(err.message || "Erreur lors de la suppression.", 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Open Edit modal
  const handleOpenEdit = (article) => {
    setEditingArticle(article);
    setIsFormOpen(true);
  };

  // Open Add modal
  const handleOpenAdd = () => {
    setEditingArticle(null);
    setIsFormOpen(true);
  };

  // Save Credentials / Switch Mode
  const handleSaveCredentials = (newToken, newUrl, useMock) => {
    api.setCredentials(newToken, newUrl, useMock);
    setToken(newToken);
    setApiUrl(newUrl);
    setIsMockMode(api.isInMockMode());
    showToast(
      useMock 
        ? "Mode Démo activé (données locales simulées)" 
        : "Configuration API mise à jour !",
      'success'
    );
    fetchArticles();
  };

  // Logout
  const handleLogout = () => {
    api.logout();
    setToken('');
    setIsMockMode(true);
    showToast("Déconnexion réussie. Mode Démo actif.", 'info');
    fetchArticles();
  };

  // Reset Mock
  const handleResetMock = () => {
    const defaults = api.resetMockData();
    setArticles(defaults);
    showToast("Articles du mock réinitialisés !", 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] text-slate-800">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header Bar */}
      <Header
        articles={articles}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAddModal={handleOpenAdd}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        isMockMode={isMockMode}
        token={token}
        apiUrl={apiUrl}
        onRefresh={() => fetchArticles()}
        loading={loading}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-4 sm:py-6 pb-24">
        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 shadow-2xs animate-fade-in flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wide">
                  Erreur de connexion API
                </h4>
                <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">
                  {errorMessage}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => fetchArticles()}
                className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Réessayer
              </button>
              <button
                onClick={() => handleSaveCredentials('', apiUrl, true)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Passer en Mode Démo
              </button>
            </div>
          </div>
        )}

        {/* Section title & count */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {searchQuery ? `Résultats de recherche (${articles.length})` : 'Articles du catalogue'}
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-600">
              {articles.length} {articles.length > 1 ? 'articles' : 'article'}
            </span>
          </div>

          <div className="text-xs text-slate-400 hidden sm:block">
            {isMockMode ? 'Mise à jour immédiate (Mock)' : 'Synchronisé avec WhatsApp Commerce'}
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && articles.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200/70 animate-pulse space-y-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-slate-200 rounded-xl"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
                    <div className="h-5 bg-slate-200 rounded-md w-1/2"></div>
                  </div>
                </div>
                <div className="h-4 bg-slate-100 rounded-md w-full"></div>
                <div className="pt-2 flex gap-2">
                  <div className="h-8 bg-slate-200 rounded-xl flex-1"></div>
                  <div className="h-8 bg-slate-200 rounded-xl flex-1"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Articles List / Grid */}
        {!loading && articles.length === 0 ? (
          <EmptyState
            isSearching={Boolean(searchQuery)}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery('')}
            onOpenAddModal={handleOpenAdd}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {articles.map((article) => (
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

      {/* Fixed "Ajouter un article" Button for Mobile thumb ergonomics */}
      <div className="fixed bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-50 via-slate-50/95 to-transparent pointer-events-none z-20 sm:hidden">
        <button
          onClick={handleOpenAdd}
          className="pointer-events-auto w-full py-3.5 px-5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Ajouter un article</span>
        </button>
      </div>

      {/* Add / Edit Article Form Modal */}
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

      {/* Login / API Credentials Modal */}
      <AuthScreen
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSave={handleSaveCredentials}
        currentToken={token}
        currentApiUrl={apiUrl}
        isMockMode={isMockMode}
        onResetMock={handleResetMock}
      />
    </div>
  );
}
