/**
 * API Service for WhatsApp Commerce Admin Dashboard
 * Following Parfait's REST API contract:
 * - GET    /api/articles/           : List all items
 * - GET    /api/articles/?search=   : Search items by name
 * - POST   /api/articles/           : Add an item ({ nom, prix, stock })
 * - PUT    /api/articles/{id}/      : Edit an item ({ nom, prix, stock })
 * - DELETE /api/articles/{id}/      : Delete an item
 * 
 * Header: Authorization: Token <token>
 * Base URL: import.meta.env.VITE_API_URL or custom configured
 */

const DEFAULT_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Default initial mock data for immediate testing if no backend is running
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
    stock: 0, // Out of stock example
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
    stock: 2, // Low stock example
    category: "Femme",
    color: "Jaune / Motif"
  },
  {
    id: 6,
    nom: "Pantalon Chino Ajusté",
    prix: 14000,
    stock: 0, // Out of stock example
    category: "Homme",
    color: "Beige"
  }
];

// Helper to manage local mock storage in localStorage
function getLocalMockArticles() {
  const saved = localStorage.getItem('whatsapp_shop_mock_articles');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing mock articles', e);
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
    this.isMockMode = localStorage.getItem('whatsapp_shop_mock_mode') === 'true' || !this.token;
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

  logout() {
    this.token = '';
    this.isMockMode = true;
    localStorage.removeItem('whatsapp_shop_token');
    localStorage.setItem('whatsapp_shop_mock_mode', 'true');
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  getToken() {
    return this.token;
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
   * GET /api/articles/ or /api/articles/?search=...
   */
  async getArticles(searchQuery = '') {
    if (this.isMockMode) {
      // Simulate slight network delay for natural feel
      await new Promise(r => setTimeout(r, 200));
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
          throw new Error("Token d'authentification invalide ou expiré (401/403).");
        }
        throw new Error(`Erreur serveur (${response.status}): Impossible de récupérer les articles.`);
      }

      const data = await response.json();
      // Handle either direct array or paginated response { results: [...] }
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.results)) return data.results;
      return [];
    } catch (err) {
      console.warn("API request failed:", err.message);
      throw err;
    }
  }

  /**
   * POST /api/articles/
   * Data contract: { nom: string, prix: integer, stock: integer }
   */
  async createArticle({ nom, prix, stock }) {
    const payload = {
      nom: nom.trim(),
      prix: parseInt(prix, 10),
      stock: parseInt(stock, 10),
    };

    if (this.isMockMode) {
      await new Promise(r => setTimeout(r, 250));
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
        throw new Error(`Erreur lors de l'ajout (${response.status}): ${errorText || 'Vérifiez les données.'}`);
      }

      return await response.json();
    } catch (err) {
      console.error("Create article failed:", err);
      throw err;
    }
  }

  /**
   * PUT /api/articles/{id}/
   * Data contract: { nom: string, prix: integer, stock: integer }
   */
  async updateArticle(id, { nom, prix, stock }) {
    const payload = {
      nom: nom.trim(),
      prix: parseInt(prix, 10),
      stock: parseInt(stock, 10),
    };

    if (this.isMockMode) {
      await new Promise(r => setTimeout(r, 250));
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
      console.error("Update article failed:", err);
      throw err;
    }
  }

  /**
   * DELETE /api/articles/{id}/
   */
  async deleteArticle(id) {
    if (this.isMockMode) {
      await new Promise(r => setTimeout(r, 200));
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
      console.error("Delete article failed:", err);
      throw err;
    }
  }

  /**
   * Reset mock data to original default set
   */
  resetMockData() {
    localStorage.removeItem('whatsapp_shop_mock_articles');
    return INITIAL_MOCK_ARTICLES;
  }
}

export const api = new ApiService();
