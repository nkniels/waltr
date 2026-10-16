import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Check, AlertCircle, ShieldCheck, Database } from 'lucide-react';
import WaltrMascot from './WaltrMascot';

export default function FirstLoginModal({
  isOpen,
  storeProfile,
  onPasswordCreated
}) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 4) {
      setError("Le mot de passe doit comporter au moins 4 caractères.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onPasswordCreated(newPassword);
    } catch (err) {
      setError(err.message || "Erreur lors de la création du mot de passe.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-4 bg-neutral-900/60 backdrop-blur-sm transition-opacity animate-fade-in">
      {/* Modal Card */}
      <div className="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border border-neutral-200/90 shadow-2xl overflow-hidden z-10 animate-slide-up sm:animate-fade-in">
        {/* Header with Waltr Mascot */}
        <div className="pt-6 pb-2 px-6 text-center bg-gradient-to-b from-neutral-50/70 to-white border-b border-neutral-100">
          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-white border border-neutral-200 shadow-2xs flex items-center justify-center overflow-hidden">
            <WaltrMascot variant="logo" size={54} />
          </div>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-tight bg-orange-50 text-orange-700 border border-orange-200/60 mb-1.5">
            Première connexion
          </span>
          <h2 className="text-lg font-bold tracking-tight text-neutral-950">
            Définissez votre mot de passe
          </h2>
          <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
            Votre compte boutique a été configuré par l'équipe waltr. Choisissez votre mot de passe personnel pour débloquer votre accès.
          </p>
        </div>

        {/* Store & Connected Database Recap */}
        <div className="px-6 pt-4">
          <div className="p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-neutral-600">
              <span className="font-medium">Boutique :</span>
              <span className="font-semibold text-neutral-900 truncate max-w-[200px]">
                {storeProfile?.storeName || 'Boutique WhatsApp'}
              </span>
            </div>
            <div className="flex items-center justify-between text-neutral-600">
              <span className="font-medium">Base de données :</span>
              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {storeProfile?.databaseId || 'waltr_db_live'}
              </span>
            </div>
            <div className="flex items-center justify-between text-neutral-600">
              <span className="font-medium">Compte gérant :</span>
              <span className="font-mono text-[11px] text-neutral-700">
                {storeProfile?.ownerEmail || 'gérant@boutique.com'}
              </span>
            </div>
          </div>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-900 mb-1.5">
              Nouveau mot de passe personnel
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Votre mot de passe secret"
                className="w-full pl-3 pr-10 py-2.5 text-xs rounded-lg border border-neutral-200 bg-white focus:border-neutral-950 outline-hidden transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-900 mb-1.5">
              Confirmez le mot de passe
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Répétez le mot de passe"
              className="w-full px-3 py-2.5 text-xs rounded-lg border border-neutral-200 bg-white focus:border-neutral-950 outline-hidden transition-colors"
            />
          </div>

          {error && (
            <div className="p-2.5 rounded-lg text-xs bg-rose-50 text-rose-900 border border-rose-200 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-neutral-950 hover:bg-neutral-800 text-white rounded-lg font-medium text-xs transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Activation du compte...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Activer mon accès au tableau de bord</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
