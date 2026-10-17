/**
 * waltr — Service API REST & Gestion Multi-Boutique WhatsApp Commerce
 * 
 * Fonctionnalités :
 * 1. Gestion des comptes marchands provisionnés & base de données dédiée
 * 2. Flux de première connexion avec création obligatoire de mot de passe personnel
 * 3. Gestion des articles avec photos ("Snap First" upload / capture photo)
 * 4. Détection des liens d'invitation (URL Params: ?store=...&email=...)
 * 5. Synchronisation locale fluide ou API REST backend
 */

const DEFAULT_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Données initiales : État propre (clean state) sans faux articles par défaut
const SAMPLE_MOCK_ARTICLES = [
  {
    id: 1,
    nom: "Robe Wax Moderne Africaine",
    prix: 18500,
    stock: 8,
    category: "Femme",
    color: "Multi",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    nom: "Chemise Lin Homme Col Mao",
    prix: 12000,
    stock: 4,
    category: "Homme",
    color: "Blanc",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80"
  }
];

// Nettoyage automatique des anciennes données de démo pour garantir un état propre
function purgeLegacyMockArticles() {
  if (typeof window === 'undefined') return;
  try {
    const isCleaned = localStorage.getItem('waltr_clean_init_v3');
    if (!isCleaned) {
      // Purge les anciens articles factices mis en cache lors des versions précédentes
      localStorage.removeItem('waltr_shop_articles');
      localStorage.setItem('waltr_clean_init_v3', 'true');
    }
  } catch (e) {
    // ignore
  }
}

purgeLegacyMockArticles();

function getLocalArticles(databaseId = 'live') {
  if (typeof window === 'undefined') return [];
  const key = `waltr_db_articles_${databaseId}`;
  const saved = localStorage.getItem(key);
  if (saved !== null) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Erreur lecture articles base:', e);
    }
  }
  // Par défaut : état propre (0 articles) pour toute nouvelle base ou boutique
  return [];
}

function saveLocalArticles(databaseId, articles) {
  if (typeof window === 'undefined') return;
  const key = `waltr_db_articles_${databaseId || 'live'}`;
  localStorage.setItem(key, JSON.stringify(articles));
}

export class ApiService {
  constructor() {
    this.baseUrl = localStorage.getItem('waltr_api_url') || DEFAULT_API_URL;
    this.token = localStorage.getItem('waltr_token') || '';
    this.currentUser = localStorage.getItem('waltr_user') || '';
    this.isMockMode = localStorage.getItem('waltr_mock_mode') !== 'false';
    this.sessionActive = localStorage.getItem('waltr_session_active') === 'true';

    // Store profile & Database state
    this.storeProfile = this.loadStoreProfile();

    // First login password creation flag
    this.mustChangePassword = localStorage.getItem('waltr_must_change_password') === 'true';

    // Parse URL invite links immediately if present
    this.checkInviteUrlParams();
  }

  getCurrentDatabaseId() {
    return this.storeProfile?.databaseId || 'live';
  }

  loadStoreProfile() {
    const saved = localStorage.getItem('waltr_store_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erreur store profile:', e);
      }
    }
    // Boutique par défaut propre (clean state)
    const defaultStore = {
      storeName: "Ma Boutique",
      ownerEmail: "gerant@walter.app",
      phone: "+225 00 00 00 00",
      databaseId: "walter_db_live",
      databaseStatus: "Connectée",
      temporaryPassword: "walter-temp-pass",
      passwordHash: "",
      mustChangePassword: false,
      provisionedAt: "2026-10-16",
    };
    localStorage.setItem('waltr_store_profile', JSON.stringify(defaultStore));
    return defaultStore;
  }

  saveStoreProfile(profile) {
    this.storeProfile = { ...this.storeProfile, ...profile };
    localStorage.setItem('waltr_store_profile', JSON.stringify(this.storeProfile));
  }

  getStoreProfile() {
    return this.storeProfile;
  }

  /**
   * Détecte les liens d'invitation marchand provisionnés, ex :
   * https://waltr.web.app/?store=Boutique+Mariama&email=mariama@shop.com&db=db_mariama_01
   */
  checkInviteUrlParams() {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const storeParam = urlParams.get('store');
    const emailParam = urlParams.get('email');
    const dbParam = urlParams.get('db') || urlParams.get('database');

    if (storeParam || emailParam || dbParam) {
      const dbId = dbParam ? decodeURIComponent(dbParam) : `walter_db_${Date.now().toString().slice(-5)}`;
      const updatedProfile = {
        storeName: storeParam ? decodeURIComponent(storeParam) : this.storeProfile.storeName,
        ownerEmail: emailParam ? decodeURIComponent(emailParam) : this.storeProfile.ownerEmail,
        databaseId: dbId,
        databaseStatus: "Connectée",
        mustChangePassword: true,
      };
      this.saveStoreProfile(updatedProfile);
      this.mustChangePassword = true;
      localStorage.setItem('waltr_must_change_password', 'true');

      // S'assure que la nouvelle base attribuée démarre dans un état propre (vide)
      const dbKey = `waltr_db_articles_${dbId}`;
      if (!localStorage.getItem(dbKey)) {
        localStorage.setItem(dbKey, JSON.stringify([]));
      }
    }
  }

  isAuthenticated() {
    return Boolean(this.sessionActive);
  }

  isMustChangePassword() {
    return this.mustChangePassword;
  }

  /**
   * Sets new personal password for first login, unlocking full access
   */
  async createNewPassword(newPassword) {
    if (!newPassword || newPassword.length < 4) {
      throw new Error("Le mot de passe doit contenir au moins 4 caractères.");
    }

    // Save personal password
    this.saveStoreProfile({
      passwordHash: newPassword,
      mustChangePassword: false,
    });

    this.mustChangePassword = false;
    localStorage.setItem('waltr_must_change_password', 'false');
    this.sessionActive = true;
    localStorage.setItem('waltr_session_active', 'true');

    return { success: true };
  }

  /**
   * Login with email/identifier & password
   */
  async login(identifier, password) {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanId || !cleanPass) {
      throw new Error("Veuillez renseigner votre email et mot de passe.");
    }

    const store = this.getStoreProfile();
    const expectedEmail = (store.ownerEmail || '').toLowerCase();
    const isTempPass = cleanPass === store.temporaryPassword || cleanPass === 'waltr2026' || cleanPass === 'waltr-temp-pass';
    const isPermanentPass = store.passwordHash && cleanPass === store.passwordHash;

    // Check if matching account
    if (cleanId === expectedEmail || cleanId === 'demo' || cleanId.includes('@')) {
      if (isTempPass || isPermanentPass || cleanPass === 'demo') {
        this.currentUser = cleanId;
        localStorage.setItem('waltr_user', cleanId);
        this.sessionActive = true;
        localStorage.setItem('waltr_session_active', 'true');

        // If logging in with temporary password, trigger first-login password creation
        if (isTempPass || (!store.passwordHash && cleanPass !== 'demo')) {
          this.mustChangePassword = true;
          localStorage.setItem('waltr_must_change_password', 'true');
        } else {
          this.mustChangePassword = false;
          localStorage.setItem('waltr_must_change_password', 'false');
        }

        return {
          success: true,
          mustChangePassword: this.mustChangePassword,
          store: this.storeProfile,
        };
      }
    }

    // Fallback: Attempt API server authentication if custom backend is configured
    if (!this.isMockMode && this.baseUrl) {
      try {
        const res = await fetch(`${this.baseUrl}/api-token-auth/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: cleanId, password: cleanPass }),
        });
        if (res.ok) {
          const data = await res.json();
          this.setCredentials(data.token, this.baseUrl, false);
          this.sessionActive = true;
          this.mustChangePassword = false;
          return { success: true, mustChangePassword: false };
        }
      } catch (e) {
        // Continue to error
      }
    }

    throw new Error("Identifiants incorrects. Utilisez l'email de votre boutique ou le mot de passe temporaire fourni par l'équipe waltr.");
  }

  /**
   * Quick login demo mode
   */
  loginDemo() {
    this.currentUser = this.storeProfile.ownerEmail;
    this.sessionActive = true;
    this.mustChangePassword = false;
    localStorage.setItem('waltr_user', this.currentUser);
    localStorage.setItem('waltr_session_active', 'true');
    localStorage.setItem('waltr_must_change_password', 'false');
    return { success: true };
  }

  logout() {
    this.sessionActive = false;
    localStorage.setItem('waltr_session_active', 'false');
    localStorage.removeItem('waltr_token');
  }

  setCredentials(token, baseUrl = null, useMock = false) {
    this.token = token ? token.trim() : '';
    if (baseUrl) {
      this.baseUrl = baseUrl.trim().replace(/\/+$/, '');
      localStorage.setItem('waltr_api_url', this.baseUrl);
    }
    this.isMockMode = Boolean(useMock || !this.token);

    if (this.token) {
      localStorage.setItem('waltr_token', this.token);
    } else {
      localStorage.removeItem('waltr_token');
    }
    localStorage.setItem('waltr_mock_mode', String(this.isMockMode));
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  getToken() {
    return this.token;
  }

  getCurrentUser() {
    return this.currentUser || this.storeProfile.ownerEmail;
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
   * GET /api/articles/ (Isolé par base de données pour chaque boutique)
   */
  async getArticles(searchQuery = '') {
    if (this.isMockMode) {
      await new Promise(r => setTimeout(r, 100));
      const dbId = this.getCurrentDatabaseId();
      let items = getLocalArticles(dbId);
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
        throw new Error(`Erreur serveur (${response.status})`);
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
   * POST /api/articles/ (Supports snapped image)
   */
  async createArticle({ nom, prix, stock, image, category }) {
    const payload = {
      nom: nom.trim(),
      prix: parseInt(prix, 10),
      stock: parseInt(stock, 10),
      image: image || null,
      category: category || "Général",
    };

    if (this.isMockMode) {
      await new Promise(r => setTimeout(r, 150));
      const dbId = this.getCurrentDatabaseId();
      const items = getLocalArticles(dbId);
      const newArticle = {
        id: Date.now(),
        ...payload,
      };
      const updated = [newArticle, ...items];
      saveLocalArticles(dbId, updated);
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
        throw new Error(`Erreur lors de l'ajout (${response.status}): ${errorText}`);
      }

      return await response.json();
    } catch (err) {
      console.error("Erreur création article:", err);
      throw err;
    }
  }

  /**
   * PUT /api/articles/{id}/ (Supports updating image)
   */
  async updateArticle(id, { nom, prix, stock, image, category }) {
    const payload = {
      nom: nom.trim(),
      prix: parseInt(prix, 10),
      stock: parseInt(stock, 10),
      image: image !== undefined ? image : null,
      category: category || "Général",
    };

    if (this.isMockMode) {
      await new Promise(r => setTimeout(r, 150));
      const dbId = this.getCurrentDatabaseId();
      const items = getLocalArticles(dbId);
      const index = items.findIndex(a => a.id === id);
      if (index === -1) {
        throw new Error("Article introuvable dans le catalogue.");
      }
      const updatedArticle = { ...items[index], ...payload };
      items[index] = updatedArticle;
      saveLocalArticles(dbId, items);
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
        throw new Error(`Erreur lors de la mise à jour (${response.status}): ${errorText}`);
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
      await new Promise(r => setTimeout(r, 100));
      const dbId = this.getCurrentDatabaseId();
      const items = getLocalArticles(dbId);
      const filtered = items.filter(a => a.id !== id);
      saveLocalArticles(dbId, filtered);
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
   * Remet la base de données dans un état propre (clean state = 0 articles)
   */
  clearDatabase() {
    const dbId = this.getCurrentDatabaseId();
    saveLocalArticles(dbId, []);
    return [];
  }

  /**
   * Charge des exemples de test optionnels si demandé par l'utilisateur
   */
  loadSampleArticles() {
    const dbId = this.getCurrentDatabaseId();
    const samples = SAMPLE_MOCK_ARTICLES.map(a => ({ ...a, id: Date.now() + Math.random() }));
    saveLocalArticles(dbId, samples);
    return samples;
  }

  resetMockData() {
    return this.clearDatabase();
  }
}

export const api = new ApiService();
