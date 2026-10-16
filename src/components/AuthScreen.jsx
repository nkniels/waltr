import React, { useState } from 'react';
import { 
  KeyRound, 
  Globe, 
  Check, 
  AlertCircle, 
  X, 
  Sparkles, 
  Database, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import WaltrMascot from './WaltrMascot';

export default function AuthScreen({
  isOpen = true,
  isModal = false,
  onClose = () => {},
  onLoginSuccess = () => {},
  onSave = () => {},
  currentToken = '',
  currentApiUrl = '',
  isMockMode = true,
  onResetMock
}) {
  const [authMethod, setAuthMethod] = useState('credentials'); // 'credentials' | 'token'
  
  // Credentials state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Direct Token state
  const [token, setToken] = useState(currentToken || '');
  
  // API URL & Server settings
  const [apiUrl, setApiUrl] = useState(currentApiUrl || import.meta.env.VITE_API_URL || 'http://localhost:8000');
  const [showServerConfig, setShowServerConfig] = useState(false);

  // Status state
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  if (isModal && !isOpen) return null;

  // Handle Login via Username / Password
  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!username.trim() || !password) {
      setStatusMessage({
        type: 'error',
        message: "Veuillez renseigner votre nom d'utilisateur et votre mot de passe."
      });
      return;
    }

    setSubmitting(true);
    try {
      const cleanUrl = apiUrl.trim().replace(/\/+$/, '');
      const endpoints = ['/api-token-auth/', '/api/auth/token/', '/api/token/', '/api/login/'];
      let lastErr = null;
      let authenticated = false;

      for (const ep of endpoints) {
        try {
          const res = await fetch(`${cleanUrl}${ep}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              username: username.trim(),
              password: password,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            const retrievedToken = data.token || data.key || data.access || data.auth_token;
            if (retrievedToken) {
              authenticated = true;
              setStatusMessage({
                type: 'success',
                message: `Connexion réussie ! Bienvenue ${username.trim()}.`
              });
              setTimeout(() => {
                onLoginSuccess({
                  token: retrievedToken,
                  apiUrl: cleanUrl,
                  isMock: false,
                  user: username.trim(),
                });
                if (onClose) onClose();
              }, 500);
              break;
            }
          } else if (res.status === 400 || res.status === 401 || res.status === 403) {
            const errData = await res.json().catch(() => ({}));
            const msg = errData.non_field_errors?.[0] || 
                        errData.detail || 
                        errData.message || 
                        "Identifiants incorrects. Vérifiez le nom d'utilisateur et le mot de passe.";
            throw new Error(msg);
          }
        } catch (innerErr) {
          lastErr = innerErr;
          if (innerErr.message && !innerErr.message.includes('Failed to fetch') && !innerErr.message.includes('NetworkError')) {
            throw innerErr;
          }
        }
      }

      if (!authenticated) {
        throw new Error(
          lastErr?.message || 
          `Serveur API injoignable sur ${cleanUrl}. Vérifiez que votre backend Django tourne ou utilisez le Mode Démo.`
        );
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        message: err.message || "Erreur de connexion avec le serveur."
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Direct Token Connect
  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(null);

    const cleanToken = token.trim();
    if (!cleanToken) {
      setStatusMessage({
        type: 'error',
        message: "Veuillez saisir votre token d'authentification propriétaire."
      });
      return;
    }

    setSubmitting(true);
    try {
      const cleanUrl = apiUrl.trim().replace(/\/+$/, '');
      const res = await fetch(`${cleanUrl}/api/articles/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${cleanToken}`,
        },
      });

      if (res.ok) {
        setStatusMessage({
          type: 'success',
          message: "Token vérifié avec succès ! Connexion établie."
        });
        setTimeout(() => {
          onLoginSuccess({
            token: cleanToken,
            apiUrl: cleanUrl,
            isMock: false,
            user: 'Propriétaire',
          });
          if (onClose) onClose();
        }, 500);
      } else if (res.status === 401 || res.status === 403) {
        throw new Error("Token d'authentification invalide ou expiré (401/403).");
      } else {
        // Enregistre quand même avec avertissement
        setStatusMessage({
          type: 'warning',
          message: `Le serveur a répondu (${res.status}). Enregistrement effectué.`
        });
        setTimeout(() => {
          onLoginSuccess({
            token: cleanToken,
            apiUrl: cleanUrl,
            isMock: false,
            user: 'Propriétaire',
          });
          if (onClose) onClose();
        }, 600);
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        message: err.message || "Impossible de joindre le serveur avec ce token."
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Demo Mode activation
  const handleActivateDemo = () => {
    onLoginSuccess({
      token: '',
      apiUrl,
      isMock: true,
      user: 'Propriétaire (Démo)',
    });
    if (onClose) onClose();
  };

  const containerClasses = isModal 
    ? "relative bg-white w-full sm:max-w-md rounded-2xl border border-neutral-200/90 shadow-2xl overflow-hidden z-10 animate-fade-in"
    : "w-full max-w-md bg-white rounded-2xl border border-neutral-200/90 shadow-xl overflow-hidden animate-fade-in";

  const wrapperClasses = isModal
    ? "fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
    : "min-h-screen bg-[#fafafa] flex flex-col justify-center items-center p-4 sm:p-6 font-['Inter',-apple-system,sans-serif]";

  return (
    <div className={wrapperClasses}>
      {isModal && (
        <div 
          className="fixed inset-0" 
          onClick={onClose}
        />
      )}

      <div className={containerClasses}>
        {/* Top Header Card */}
        <div className="p-6 pb-4 border-b border-neutral-100 bg-linear-to-b from-neutral-50/70 to-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-neutral-950 flex items-center justify-center text-white shadow-xs">
                <WaltrMascot variant="logo" size={32} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-lg font-bold tracking-tight text-neutral-950">
                    waltr
                  </h1>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-neutral-100 text-neutral-600 font-semibold">
                    Commerce
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {isModal ? "Paramètres de connexion et API" : "Tableau de bord de gestion WhatsApp"}
                </p>
              </div>
            </div>

            {isModal && (
              <button
                onClick={onClose}
                className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mode Switcher Tabs */}
          <div className="mt-5 grid grid-cols-2 gap-1 p-1 bg-neutral-100 rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('credentials');
                setStatusMessage(null);
              }}
              className={`py-1.5 px-3 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authMethod === 'credentials'
                  ? 'bg-white text-neutral-950 shadow-2xs font-semibold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Identifiants</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMethod('token');
                setStatusMessage(null);
              }}
              className={`py-1.5 px-3 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authMethod === 'token'
                  ? 'bg-white text-neutral-950 shadow-2xs font-semibold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Token API</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Method 1: Username & Password */}
          {authMethod === 'credentials' && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Nom d'utilisateur ou Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    autoFocus={!isModal}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ex: admin ou proprietaire"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-200 bg-white focus:border-neutral-950 outline-hidden transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-9 py-2 text-xs rounded-lg border border-neutral-200 bg-white focus:border-neutral-950 outline-hidden transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-500 pt-0.5">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-neutral-950 focus:ring-0 cursor-pointer"
                  />
                  <span>Se souvenir de moi</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowServerConfig(!showServerConfig)}
                  className="text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Globe className="w-3 h-3" />
                  <span>Serveur</span>
                  {showServerConfig ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              {/* Collapsible Server Config */}
              {showServerConfig && (
                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 space-y-1.5 animate-fade-in">
                  <label className="block text-[11px] font-medium text-neutral-600">
                    URL du serveur Backend
                  </label>
                  <input
                    type="url"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="http://localhost:8000"
                    className="w-full px-2.5 py-1.5 text-xs font-mono rounded border border-neutral-200 bg-white outline-hidden focus:border-neutral-950"
                  />
                  <p className="text-[10px] text-neutral-400">
                    Par défaut : <code className="font-mono">http://localhost:8000</code>
                  </p>
                </div>
              )}

              {/* Status feedback */}
              {statusMessage && (
                <div className={`p-3 rounded-lg text-xs flex items-start gap-2 border animate-fade-in ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    : statusMessage.type === 'warning'
                    ? 'bg-amber-50 text-amber-900 border-amber-200'
                    : 'bg-rose-50 text-rose-900 border-rose-200'
                }`}>
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{statusMessage.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 bg-neutral-950 hover:bg-neutral-800 text-white rounded-lg font-medium text-xs transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Connexion en cours...</span>
                  </>
                ) : (
                  <>
                    <span>Se connecter à la boutique</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Method 2: Direct Token */}
          {authMethod === 'token' && (
            <form onSubmit={handleTokenSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Token Propriétaire Boutique
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="ex: 9944b09199c62bcf9418ad846dd0e4bbdfc..."
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-lg border border-neutral-200 bg-white focus:border-neutral-950 outline-hidden transition-colors"
                  />
                </div>
                <p className="mt-1 text-[11px] text-neutral-400">
                  Fourni par l'administrateur API via le header <code className="font-mono text-neutral-700 bg-neutral-100 px-1 py-0.5 rounded">Authorization: Token ...</code>
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  URL du Serveur API
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="url"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="http://localhost:8000"
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-lg border border-neutral-200 bg-white focus:border-neutral-950 outline-hidden transition-colors"
                  />
                </div>
              </div>

              {/* Status feedback */}
              {statusMessage && (
                <div className={`p-3 rounded-lg text-xs flex items-start gap-2 border animate-fade-in ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    : statusMessage.type === 'warning'
                    ? 'bg-amber-50 text-amber-900 border-amber-200'
                    : 'bg-rose-50 text-rose-900 border-rose-200'
                }`}>
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{statusMessage.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 bg-neutral-950 hover:bg-neutral-800 text-white rounded-lg font-medium text-xs transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Vérification du token...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Valider & Enregistrer le Token</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Access Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-100"></div>
            </div>
            <div className="relative flex justify-center text-[11px]">
              <span className="bg-white px-2.5 text-neutral-400 font-medium">
                ou tester sans compte
              </span>
            </div>
          </div>

          {/* Demo Mode Button */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleActivateDemo}
              className="w-full p-3 bg-neutral-50 hover:bg-neutral-100/90 border border-neutral-200/90 hover:border-neutral-300 rounded-xl transition-all flex items-center gap-3 cursor-pointer group text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-orange-500 shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-neutral-900 flex items-center gap-1.5">
                  <span>Accéder au Mode Démo</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-orange-100 text-orange-800 font-medium">
                    Sans backend
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                  Explorez le catalogue d'habits et testez les stocks en 1 clic
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-colors shrink-0" />
            </button>

            {isMockMode && onResetMock && isModal && (
              <button
                type="button"
                onClick={onResetMock}
                className="w-full py-1.5 text-neutral-400 hover:text-neutral-700 text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Réinitialiser les articles du mock</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-neutral-50/80 border-t border-neutral-100 text-center">
          <p className="text-[11px] text-neutral-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Session sécurisée — Données stockées localement</span>
          </p>
        </div>
      </div>
    </div>
  );
}
