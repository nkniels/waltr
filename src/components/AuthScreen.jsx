import React, { useState } from 'react';
import { 
  KeyRound, 
  Globe, 
  Check, 
  AlertCircle, 
  X, 
  Sparkles, 
  Database, 
  Copy, 
  Share2, 
  Store,
  UserCheck,
  Trash2
} from 'lucide-react';
import WaltrMascot from './WaltrMascot';
import { TRANSLATIONS } from '../i18n';

export default function AuthScreen({
  isOpen,
  onClose,
  storeProfile,
  onLogin,
  onDemoLogin,
  onLogout,
  isLoggedIn,
  onClearDatabase,
  onLoadSamples,
  lang = 'fr'
}) {
  const t = (key) => TRANSLATIONS[lang]?.[key] || TRANSLATIONS['fr']?.[key] || key;
  const [email, setEmail] = useState(storeProfile?.ownerEmail || 'gerant@walter.app');
  const [password, setPassword] = useState(storeProfile?.temporaryPassword || 'walter-temp-pass');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onLogin(email, password);
      onClose();
    } catch (err) {
      setError(err.message || "Erreur de connexion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inviteUrl = `${window.location.origin}/?store=${encodeURIComponent(storeProfile?.storeName || 'Ma Boutique')}&email=${encodeURIComponent(storeProfile?.ownerEmail || 'client@shop.com')}&db=${encodeURIComponent(storeProfile?.databaseId || 'walter_db_live')}`;

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-4 bg-neutral-900/40 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border border-neutral-200/90 shadow-2xl overflow-hidden z-10 animate-slide-up sm:animate-fade-in">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center overflow-hidden border border-neutral-200">
              <WaltrMascot variant="logo" size={26} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-950 tracking-tight">
                {t('authModalTitle')}
              </h2>
              <p className="text-[11px] text-neutral-400">
                {t('authModalSub')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Active Store & Database Card */}
          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/70 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500 font-medium">{t('activeStoreLabel')}</span>
              <span className="font-semibold text-neutral-900">{storeProfile?.storeName || t('storeDefaultName')}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-neutral-500 font-medium">{t('databaseStatusLabel')}</span>
              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {storeProfile?.databaseId}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-neutral-500 font-medium">{t('managerEmailLabel')}</span>
              <span className="font-mono text-neutral-700">{storeProfile?.ownerEmail}</span>
            </div>
          </div>

          {/* Invite Link Generator (for team to send to client) */}
          <div className="p-3 bg-neutral-100/60 rounded-xl border border-neutral-200/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-900">
              <span className="flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-orange-500" />
                <span>{t('inviteLinkTitle')}</span>
              </span>
              <button
                type="button"
                onClick={handleCopyInviteLink}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-neutral-700 hover:text-neutral-950 bg-white border border-neutral-200 shadow-2xs hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>{t('copiedLinkBtn')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>{t('copyLinkBtn')}</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              {t('inviteLinkDesc')}
            </p>
          </div>

          {/* Quick Sign-In Form if not logged in or switching */}
          <form onSubmit={handleSignIn} className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-neutral-900 mb-1">
                {t('managerEmailLabel')}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 bg-white focus:border-neutral-950 outline-hidden transition-colors font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-900 mb-1">
                {t('password')}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('passwordPlaceholder')}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 bg-white focus:border-neutral-950 outline-hidden transition-colors font-mono"
              />
            </div>

            {error && (
              <div className="p-2.5 rounded-lg text-xs bg-rose-50 text-rose-900 border border-rose-200 flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-neutral-950 hover:bg-neutral-800 text-white rounded-lg font-medium text-xs transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t('signingInBtn')}</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t('signInBtn')}</span>
                </>
              )}
            </button>
          </form>

          {/* Database Maintenance: Clean State */}
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/70 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-900">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-neutral-500" />
                <span>{t('databaseMgmtTitle')}</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                {storeProfile?.databaseId}
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              {t('databaseMgmtDesc')}
            </p>
            <div className="flex items-center gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => {
                  if (onClearDatabase) onClearDatabase();
                  onClose();
                }}
                className="flex-1 py-1.5 px-2.5 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200/90 rounded-lg text-xs font-medium transition-colors cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
                title={t('clearDatabaseBtn')}
              >
                <Trash2 className="w-3 h-3 text-neutral-400" />
                <span>{t('clearDatabaseBtn')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onLoadSamples) onLoadSamples();
                  onClose();
                }}
                className="py-1.5 px-2.5 bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200/90 rounded-lg text-xs transition-colors cursor-pointer shadow-2xs flex items-center justify-center gap-1"
                title={t('loadSamplesBtn')}
              >
                <Sparkles className="w-3 h-3 text-orange-400" />
                <span>{t('loadSamplesBtn')}</span>
              </button>
            </div>
          </div>

          {/* Quick Demo Access & Logout */}
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                onDemoLogin();
                onClose();
              }}
              className="text-neutral-500 hover:text-neutral-950 font-medium transition-colors cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('demoAccessBtn')}</span>
            </button>

            {isLoggedIn && (
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="text-rose-600 hover:text-rose-700 font-medium transition-colors cursor-pointer"
              >
                {t('logoutBtn')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
