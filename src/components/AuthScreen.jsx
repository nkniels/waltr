import React, { useState } from 'react';
import { KeyRound, Globe, Check, AlertCircle, X, Sparkles, Database } from 'lucide-react';

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
        message: 'Veuillez saisir un token d’authentification.',
      });
      return;
    }

    setTestingConnection(true);

    try {
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
          message: 'Connexion API réussie.',
        });
        setTimeout(() => {
          onSave(token.trim(), cleanUrl, false);
          onClose();
        }, 600);
      } else {
        setTestResult({
          type: 'warning',
          message: `Le serveur a répondu (${res.status}). Vérifiez vos droits.`,
        });
        onSave(token.trim(), cleanUrl, false);
      }
    } catch (err) {
      setTestResult({
        type: 'error',
        message: `Serveur injoignable (${err.message}). Vous pouvez utiliser le Mode Démo.`,
      });
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
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-4 bg-neutral-900/30 backdrop-blur-xs transition-opacity animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />

      <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border border-neutral-200/80 shadow-xl overflow-hidden z-10 animate-slide-up sm:animate-fade-in">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-neutral-950 tracking-tight">
              Connexion waltr
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Accès au serveur WhatsApp Commerce
            </p>
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
          <form onSubmit={handleConnectWithToken} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Token Propriétaire
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="ex: 9944b09199c62bcf9418ad846..."
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-200 bg-white focus:border-neutral-950 outline-hidden transition-colors"
                />
              </div>
              <p className="mt-1 text-[11px] text-neutral-400">
                Transmis via le header <code className="font-mono text-neutral-600 bg-neutral-100 px-1 py-0.5 rounded">Authorization: Token ...</code>
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                URL du Serveur API
              </label>
              <input
                type="url"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="http://localhost:8000"
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-200 bg-white focus:border-neutral-950 outline-hidden transition-colors"
              />
            </div>

            {testResult && (
              <div className={`p-2.5 rounded-lg text-xs flex items-center gap-2 border ${
                testResult.type === 'success' 
                  ? 'bg-neutral-50 text-neutral-900 border-neutral-200' 
                  : testResult.type === 'warning'
                  ? 'bg-amber-50 text-amber-900 border-amber-200'
                  : 'bg-rose-50 text-rose-900 border-rose-200'
              }`}>
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{testResult.message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={testingConnection}
              className="w-full py-2 px-4 bg-neutral-950 hover:bg-neutral-800 text-white rounded-lg font-medium text-xs transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {testingConnection ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Vérification...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Enregistrer & Connecter</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-100"></div>
            </div>
            <div className="relative flex justify-center text-[11px]">
              <span className="bg-white px-2 text-neutral-400">ou sans backend</span>
            </div>
          </div>

          {/* Mock Mode */}
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={handleUseMockMode}
              className="w-full py-2 px-3 text-neutral-700 hover:text-neutral-950 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-neutral-500" />
              <span>Activer le Mode Démo (Articles Locaux)</span>
            </button>

            {isMockMode && onResetMock && (
              <button
                type="button"
                onClick={onResetMock}
                className="w-full py-1 text-neutral-400 hover:text-neutral-600 text-[11px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Database className="w-3 h-3" />
                <span>Réinitialiser les données de démo</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
