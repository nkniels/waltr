/**
 * waltr — Service API REST & Client WhatsApp Commerce
 * 
 * Supporte :
 * 1. Authentification par Identifiants (Username & Password) via endpoints Django REST
 * 2. Authentification directe par Token Propriétaire (Authorization: Token <token>)
 * 3. Mode Démo / Sandbox local autonome avec persistance localStorage
 */

const DEFAULT_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Données initiales réalistes pour la boutique WhatsApp de vêtements
const INITIAL_MOCK_ARTICLES = [
  {
    id: 1,
    nom: "Robe Wax Moderne Africaine",
    prix: 18500,
    stock: 8,
    category: "Femme",
    color: "Multi"
  },
  {
    id: 2,
    nom: "Chemise Lin Homme Col Mao",
    prix: 12000,
    stock: 4,
    category: "Homme",
    color: "Blanc"
  },
  {
    id: 3,
    nom: "Ensemble Bazin Riche Brodé",
    prix: 45000,
    stock: 0, // Rupture de stock
    category: "Traditionnel",
    color: "Bleu nuit"
  },
  {
    id: 4,
    nom: "T-shirt Coton Bio Basique",
    prix: 5000,
    stock: 15,
    category: "Unisex",
    color: "Noir"
  },
  {
    id: 5,
    nom: "Jupe Plissée Wax Colorée",
    prix: 9500,
    stock: 2, // Stock faible
    category: "Femme",
    color: "Jaune / Motif"
  },
  {
    id: 6,
    nom: "Pantalon Chino Ajusté",
    prix: 14000,
    stock: 0, // Rupture de stock
    category: "Homme",
    color: "Beige"
  }
];

function getLocalMockArticles() {
  const saved = localStorage.getItem('whatsapp_shop_mock_articles');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Erreur lecture mock articles:', e);
    }
  }
  localStorage.setItem('whatsapp_shop_mock_articles', JSON.stringify(INITIAL_MOCK_ARTICLES));
  return INITIAL_MOCK_ARTICLES;
}

function saveLocalMockArticles(articles) {
  localStorage.setItem('whatsapp_shop_mock_articles', JSON.stringify(articles));
}

export class ApiService {
  constructor() {
    this.baseUrl = localStorage.getItem('whatsapp_shop_api_url') || DEFAULT_API_URL;
    this.token = localStorage.getItem('whatsapp_shop_token') || '';
    this.currentUser = localStorage.getItem('whatsapp_shop_user') || '';
    this.isMockMode = localStorage.getItem('whatsapp_shop_mock_mode') === 'true';
    this.sessionActive = localStorage.getItem('whatsapp_shop_session_active') === 'true';

    // Si un token valide est déjà stocké, la session est active en mode API
    if (this.token) {
      this.isMockMode = false;
      this.sessionActive = true;
    }
  }

  /**
   * Vérifie si l'utilisateur est actuellement connecté (soit via API réelle, soit en Mode Démo)
   */
  isAuthenticated() {
    return Boolean(this.sessionActive && (this.token || this.isMockMode));
  }

  /**
   * Connexion avec Nom d'utilisateur & Mot de passe
   * Tente automatiquement les endpoints Django REST Framework standards :
   * 1. /api-token-auth/
   * 2. /api/auth/token/
   * 3. /api/token/
   * 4. /api/login/
   */
  async loginWithCredentials(username, password, customUrl = null) {
    const cleanUrl = (customUrl || this.baseUrl || DEFAULT_API_URL).trim().replace(/\/+$/, '');
    const endpoints = [
      '/api-token-auth/',
      '/api/auth/token/',
      '/api/token/',
      '/api/login/'
    ];

    let lastError = null;

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
          const token = data.token || data.key || data.access || data.auth_token;

          if (token) {
            this.setCredentials(token, cleanUrl, false);
            this.currentUser = username.trim();
            localStorage.setItem('whatsapp_shop_user', this.currentUser);
            this.sessionActive = true;
            localStorage.setItem('whatsapp_shop_session_active', 'true');
            return {
              success: true,
              token,
              user: this.currentUser,
              endpoint: ep,
            };
          }
        } else if (res.status === 400 || res.status === 401 || res.status === 403) {
          const errData = await res.json().catch(() => ({}));
          const errMsg = errData.non_field_errors?.[0] || 
                         errData.detail || 
                         errData.message || 
                         "Identifiants invalides. Vérifiez votre nom d'utilisateur et mot de passe.";
          throw new Error(errMsg);
        }
      } catch (err) {
        lastError = err;
        // Si c'est une erreur d'identifiants 400/401/403, on arrête de boucler
        if (err.message && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError')) {
          throw err;
        }
      }
    }

    throw new Error(
      lastError?.message || 
      `Impossible de joindre le serveur (${cleanUrl}). Vérifiez que l'API est démarrée ou utilisez le Mode Démo.`
    );
  }

  /**
   * Connexion directe avec un Token API
   */
  async loginWithToken(token, customUrl = null) {
    const cleanToken = token.trim();
    if (!cleanToken) {
      throw new Error("Veuillez saisir un token d'authentification valide.");
    }

    const cleanUrl = (customUrl || this.baseUrl || DEFAULT_API_URL).trim().replace(/\/+$/, '');

    // Teste la validité du token
    try {
      const res = await fetch(`${cleanUrl}/api/articles/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${cleanToken}`,
        },
      });

      if (res.ok) {
        this.setCredentials(cleanToken, cleanUrl, false);
        this.currentUser = 'Propriétaire';
        localStorage.setItem('whatsapp_shop_user', this.currentUser);
        this.sessionActive = true;
        localStorage.setItem('whatsapp_shop_session_active', 'true');
        return { success: true, token: cleanToken };
      } else if (res.status === 401 || res.status === 403) {
        throw new Error("Token d'authentification invalide ou expiré (401/403).");
      } else {
        // Le serveur a répondu, autorisons l'enregistrement
        this.setCredentials(cleanToken, cleanUrl, false);
        this.currentUser = 'Propriétaire';
        localStorage.setItem('whatsapp_shop_user', this.currentUser);
        this.sessionActive = true;
        localStorage.setItem('whatsapp_shop_session_active', 'true');
        return { success: true, token: cleanToken, warning: `Serveur a répondu avec statut ${res.status}` };
      }
    } catch (err) {
      if (err.message && err.message.includes('401')) {
        throw err;
      }
      // Si serveur injoignable, enregistrer quand même avec avertissement
      this.setCredentials(cleanToken, cleanUrl, false);
      this.currentUser = 'Propriétaire';
      localStorage.setItem('whatsapp_shop_user', this.currentUser);
      this.sessionActive = true;
      localStorage.setItem('whatsapp_shop_session_active', 'true');
      return { 
        success: true, 
        token: cleanToken, 
        warning: `Serveur non joignable (${err.message}). Configuration enregistrée.` 
      };
    }
  }

  /**
   * Connexion instantanée en Mode Démo
   */
  loginAsDemo() {
    this.token = '';
    this.isMockMode = true;
    this.currentUser = 'Propriétaire (Mode Démo)';
    this.sessionActive = true;
    localStorage.removeItem('whatsapp_shop_token');
    localStorage.setItem('whatsapp_shop_user', this.currentUser);
    localStorage.setItem('whatsapp_shop_mock_mode', 'true');
    localStorage.setItem('whatsapp_shop_session_active', 'true');
    return { success: true, isDemo: true };
  }

  /**
   * Déconnexion complète : supprime les identifiants et termine la session
   */
  logout() {
    this.token = '';
    this.currentUser = '';
    this.sessionActive = false;
    this.isMockMode = true;
    localStorage.removeItem('whatsapp_shop_token');
    localStorage.removeItem('whatsapp_shop_user');
    localStorage.setItem('whatsapp_shop_session_active', 'false');
    localStorage.setItem('whatsapp_shop_mock_mode', 'true');
  }

  setCredentials(token, baseUrl = null, useMock = false) {
    this.token = token ? token.trim() : '';
    if (baseUrl) {
      this.baseUrl = baseUrl.trim().replace(/\/+$/, '');
      localStorage.setItem('whatsapp_shop_api_url', this.baseUrl);
    }
    this.isMockMode = Boolean(useMock || !this.token);

    if (this.token) {
      localStorage.setItem('whatsapp_shop_token', this.token);
    } else {
      localStorage.removeItem('whatsapp_shop_token');
    }
    localStorage.setItem('whatsapp_shop_mock_mode', String(this.isMockMode));
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  getToken() {
    return this.token;
  }

  getCurrentUser() {
    return this.currentUser || (this.isMockMode ? 'Mode Démo' : 'Propriétaire');
  }

  isInMockMode() {
    return this.isMockMode;
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Token ${this.token}`;
    }
    return headers;
  }

  /**
   * GET /api/articles/ ou /api/articles/?search=...
   */
  async getArticles(searchQuery = '') {
    if (this.isMockMode) {
      // Petite latence pour une interaction naturelle
      await new Promise(r => setTimeout(r, 180));
      let items = getLocalMockArticles();
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        items = items.filter(a => a.nom.toLowerCase().includes(q));
      }
      return items;
    }

    const endpoint = searchQuery 
      ? `${this.baseUrl}/api/articles/?search=${encodeURIComponent(searchQuery)}`
      : `${this.baseUrl}/api/articles/`;

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Session expirée ou token invalide (401/403). Veuillez vous reconnecter.");
        }
        throw new Error(`Erreur serveur (${response.status}): Impossible de récupérer les articles.`);
      }

      const data = await response.json();
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.results)) return data.results;
      return [];
    } catch (err) {
      console.warn("Échec requête articles:", err.message);
      throw err;
    }
  }

  /**
   * POST /api/articles/
   */
  async createArticle({ nom, prix, stock }) {
    const payload = {
      nom: nom.trim(),
      prix: parseInt(prix, 10),
      stock: parseInt(stock, 10),
    };

    if (this.isMockMode) {
      await new Promise(r => setTimeout(r, 200));
      const items = getLocalMockArticles();
      const newArticle = {
        id: Date.now(),
        ...payload,
      };
      const updated = [newArticle, ...items];
      saveLocalMockArticles(updated);
      return newArticle;
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/articles/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur lors de l'ajout (${response.status}): ${errorText || 'Vérifiez les données saisis.'}`);
      }

      return await response.json();
    } catch (err) {
      console.error("Erreur création article:", err);
      throw err;
    }
  }

  /**
   * PUT /api/articles/{id}/
   */
  async updateArticle(id, { nom, prix, stock }) {
    const payload = {
      nom: nom.trim(),
      prix: parseInt(prix, 10),
      stock: parseInt(stock, 10),
    };

    if (this.isMockMode) {
      await new Promise(r => setTimeout(r, 200));
      const items = getLocalMockArticles();
      const index = items.findIndex(a => a.id === id);
      if (index === -1) {
        throw new Error("Article introuvable dans le catalogue local.");
      }
      const updatedArticle = { ...items[index], ...payload };
      items[index] = updatedArticle;
      saveLocalMockArticles(items);
      return updatedArticle;
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/articles/${id}/`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur lors de la mise à jour (${response.status}): ${errorText || 'Erreur API'}`);
      }

      return await response.json();
    } catch (err) {
      console.error("Erreur mise à jour article:", err);
      throw err;
    }
  }

  /**
   * DELETE /api/articles/{id}/
   */
  async deleteArticle(id) {
    if (this.isMockMode) {
      await new Promise(r => setTimeout(r, 150));
      const items = getLocalMockArticles();
      const filtered = items.filter(a => a.id !== id);
      saveLocalMockArticles(filtered);
      return { success: true, id };
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/articles/${id}/`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la suppression (${response.status}).`);
      }

      return { success: true, id };
    } catch (err) {
      console.error("Erreur suppression article:", err);
      throw err;
    }
  }

  /**
   * Réinitialise les articles de démo
   */
  resetMockData() {
    localStorage.removeItem('whatsapp_shop_mock_articles');
    return INITIAL_MOCK_ARTICLES;
  }
}

export const api = new ApiService();
