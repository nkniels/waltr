import React, { useState } from 'react';
import { KeyRound, Globe, Check, AlertCircle, X, ShieldCheck, Sparkles, Database } from 'lucide-react';
import { api } from '../api';

export default function AuthScreen({
  isOpen,
  onClose,
  onSave,
  currentToken = '',
  currentApiUrl = '',
  isMockMode = true,
  onResetMock
}) {
  const [token, setToken] = useState(currentToken || '');
  const [apiUrl, setApiUrl] = useState(currentApiUrl || import.meta.env.VITE_API_URL || 'http://localhost:8000');
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleConnectWithToken = async (e) => {
    e.preventDefault();
    setTestResult(null);

    if (!token.trim()) {
      setTestResult({
        type: 'error',
        message: 'Veuillez saisir un token d’authentification pour vous connecter au serveur.',
      });
      return;
    }

    setTestingConnection(true);

    try {
      // Test the endpoint with the provided token and URL
      const cleanUrl = apiUrl.trim().replace(/\/+$/, '');
      const testHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token.trim()}`,
      };

      const res = await fetch(`${cleanUrl}/api/articles/`, {
        method: 'GET',
        headers: testHeaders,
      });

      if (res.ok) {
        setTestResult({
          type: 'success',
          message: 'Connexion réussie ! Le serveur API Parfait a répondu avec succès.',
        });
        setTimeout(() => {
          onSave(token.trim(), cleanUrl, false);
          onClose();
        }, 800);
      } else {
        // Even if server responded with an error, allow them to save if they want, but alert them
        setTestResult({
          type: 'warning',
          message: `Le serveur a répondu avec le statut ${res.status}. Vérifiez votre token d’authentification.`,
        });
        onSave(token.trim(), cleanUrl, false);
      }
    } catch (err) {
      setTestResult({
        type: 'error',
        message: `Impossible de joindre le serveur (${err.message}). Vérifiez que l'API tourne ou utilisez le Mode Démo.`,
      });
      // Save anyway in case they are developing
      onSave(token.trim(), apiUrl.trim(), false);
    } finally {
      setTestingConnection(false);
    }
  };

  const handleUseMockMode = () => {
    onSave('', apiUrl, true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />

      <div className="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 animate-slide-up sm:animate-fade-in">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
              <KeyRound className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Connexion waltr — Propriétaire
              </h2>
              <p className="text-[11px] text-slate-500">
                Accès sécurisé au catalogue waltr WhatsApp Commerce
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4">
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900 leading-relaxed">
              Le token est stocké uniquement dans votre navigateur et envoyé dans le header standard <code className="bg-emerald-100/70 text-emerald-800 px-1 py-0.5 rounded font-mono text-[10px]">Authorization: Token ...</code>
            </div>
          </div>

          <form onSubmit={handleConnectWithToken} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Token Secret Propriétaire
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="ex: 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"
                  className="w-full pl-3.5 pr-10 py-2.5 text-xs font-mono rounded-xl border border-slate-200 focus:border-emerald-500 bg-slate-50/50 focus:bg-white outline-hidden transition-all"
                />
                <KeyRound className="absolute right-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Token fourni par l'administrateur API (Parfait).
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                URL de l'API (VITE_API_URL)
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="http://localhost:8000"
                  className="w-full pl-3.5 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 bg-slate-50/50 focus:bg-white outline-hidden transition-all text-slate-800"
                />
                <Globe className="absolute right-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {testResult && (
              <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                testResult.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : testResult.type === 'warning'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{testResult.message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={testingConnection}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white rounded-xl font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {testingConnection ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Test de connexion API...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Enregistrer & Connecter l'API</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-slate-400 font-medium">Ou pour tester sans backend</span>
            </div>
          </div>

          {/* Mock Mode Button */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleUseMockMode}
              className="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100/80 active:scale-98 text-amber-800 border border-amber-200/80 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Activer le Mode Démo (Articles Locaux)</span>
            </button>

            {isMockMode && onResetMock && (
              <button
                type="button"
                onClick={onResetMock}
                className="w-full py-2 px-3 text-slate-400 hover:text-slate-600 text-[11px] font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Réinitialiser les articles du mock aux valeurs d'origine</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
