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

export default function AuthScreen({
  isOpen,
  onClose,
  storeProfile,
  onLogin,
  onDemoLogin,
  onLogout,
  isLoggedIn,
  onClearDatabase,
  onLoadSamples
}) {
  const [email, setEmail] = useState(storeProfile?.ownerEmail || 'gerant@waltr.app');
  const [password, setPassword] = useState(storeProfile?.temporaryPassword || 'waltr-temp-pass');
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

  const inviteUrl = `${window.location.origin}/?store=${encodeURIComponent(storeProfile?.storeName || 'Ma Boutique')}&email=${encodeURIComponent(storeProfile?.ownerEmail || 'client@shop.com')}&db=${encodeURIComponent(storeProfile?.databaseId || 'waltr_db_live')}`;

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
                Gestion du Compte & Boutique
              </h2>
              <p className="text-[11px] text-neutral-400">
                Compte marchand & base de données connectée
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
              <span className="text-neutral-500 font-medium">Boutique active :</span>
              <span className="font-semibold text-neutral-900">{storeProfile?.storeName}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-neutral-500 font-medium">Base de données :</span>
              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {storeProfile?.databaseId}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-neutral-500 font-medium">Gérant provisionné :</span>
              <span className="font-mono text-neutral-700">{storeProfile?.ownerEmail}</span>
            </div>
          </div>

          {/* Invite Link Generator (for team to send to client) */}
          <div className="p-3 bg-neutral-100/60 rounded-xl border border-neutral-200/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-900">
              <span className="flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-orange-500" />
                <span>Lien d'accès marchand</span>
              </span>
              <button
                type="button"
                onClick={handleCopyInviteLink}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-neutral-700 hover:text-neutral-950 bg-white border border-neutral-200 shadow-2xs hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Lien copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copier le lien</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Envoyez ce lien direct au marchand. En l'ouvrant, sa base de données sera automatiquement rattachée et il sera guidé pour créer son mot de passe personnel.
            </p>
          </div>

          {/* Quick Sign-In Form if not logged in or switching */}
          <form onSubmit={handleSignIn} className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-neutral-900 mb-1">
                Email ou Identifiant Boutique
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="fatou@boutique.com"
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 bg-white focus:border-neutral-950 outline-hidden transition-colors font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-900 mb-1">
                Mot de passe (temporaire ou personnel)
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 bg-white focus:border-neutral-950 outline-hidden transition-colors font-mono"
              />
              <p className="mt-1 text-[11px] text-neutral-400">
                Mot de passe temporaire initial : <code className="bg-neutral-100 text-neutral-700 px-1 py-0.5 rounded font-mono">waltr-temp-pass</code>
              </p>
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
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Se connecter à cette boutique</span>
                </>
              )}
            </button>
          </form>

          {/* Database Maintenance: Clean State */}
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/70 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-900">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-neutral-500" />
                <span>Gestion de la Base</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                {storeProfile?.databaseId}
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Conservez votre catalogue dans un état propre pour photographier et ajouter vos articles réels.
            </p>
            <div className="flex items-center gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => {
                  if (onClearDatabase) onClearDatabase();
                  onClose();
                }}
                className="flex-1 py-1.5 px-2.5 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200/90 rounded-lg text-xs font-medium transition-colors cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
                title="Vider tous les articles pour avoir un catalogue propre"
              >
                <Trash2 className="w-3 h-3 text-neutral-400" />
                <span>Vider la base (État propre)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onLoadSamples) onLoadSamples();
                  onClose();
                }}
                className="py-1.5 px-2.5 bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200/90 rounded-lg text-xs transition-colors cursor-pointer shadow-2xs flex items-center justify-center gap-1"
                title="Charger des exemples de test"
              >
                <Sparkles className="w-3 h-3 text-orange-400" />
                <span>Exemples</span>
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
              <span>Accès rapide Démo</span>
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
                Déconnexion
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
