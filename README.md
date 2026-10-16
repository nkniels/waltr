# Dashboard Boutique WhatsApp Commerce

Tableau de bord d'administration pour la gestion du catalogue d'articles de vêtements (Projet WhatsApp Commerce).

> **Mission :** Permettre au propriétaire de la boutique de gérer facilement son catalogue d'habits avec 1 liste et 3 actions principales : **Ajouter**, **Modifier**, **Supprimer**.

---

## 🚀 Fonctionnalités & Spécifications

- **Affichage Catalogue (Mobile First) :**
  - Cartes d'articles lisibles en 30 secondes.
  - Nom du vêtement, Prix formaté en **FCFA**, Quantité en Stock.
  - **Alerte Rupture :** Tout article avec un stock à 0 s'affiche automatiquement en rouge vif (**"Rupture de stock"**).
  - Emplacement réservé pour les futures photos d'habits.
- **Ajout d'un article :**
  - Bouton fixe accessible au pouce sur smartphone (et dans l'en-tête sur ordinateur).
  - Formulaire épuré avec 3 champs : Nom, Prix (FCFA), Quantité en stock.
  - Validation automatique : nom non vide, prix et stock entiers positifs.
- **Modification :**
  - Même formulaire pré-rempli avec les données existantes de l'article.
- **Suppression sécurisée :**
  - Boîte de confirmation explicite : *"Supprimer cet article ?"* pour éviter toute suppression involontaire.
- **Mode Mock Local & Connecteur API Parfait :**
  - Fonctionne immédiatement sans backend avec un mock local (`localStorage`).
  - Prêt pour l'API REST de Parfait via variable d'environnement ou saisie de token.
- **Écran de Connexion / Token :**
  - Saisie du token d'authentification (`Authorization: Token ...`).
  - Stockage sécurisé dans le navigateur.

---

## 🛠️ Stack Technique

- **Frontend :** React 19 + Vite 8 + Tailwind CSS v4
- **Typographie :** Plus Jakarta Sans
- **Icônes :** Lucide React
- **Appels API :** Service REST modulaire (`src/api.js`) avec gestion des erreurs et mode démo

---

## 📋 Contrat API (Référence Parfait)

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/articles/` | Liste tous les articles |
| `GET` | `/api/articles/?search=robe` | Recherche un article par son nom |
| `POST` | `/api/articles/` | Ajoute un article (`nom`, `prix`, `stock`) |
| `PUT` | `/api/articles/{id}/` | Modifie un article (`nom`, `prix`, `stock`) |
| `DELETE` | `/api/articles/{id}/` | Supprime un article |

**Champs d'un article :**
- `id` : identifiant numérique
- `nom` : texte
- `prix` : entier (en FCFA)
- `stock` : entier (0 = rupture de stock)

**Authentification :**
Header `Authorization: Token <token_propriétaire>`

---

## 💻 Démarrage Rapide

### 1. Installation des dépendances
```bash
npm install
```

### 2. Configuration d'environnement
Copiez `.env.example` en `.env` :
```env
VITE_API_URL=http://localhost:8000
```

### 3. Lancer le serveur de développement
```bash
npm run dev
```
Ouvrez [http://localhost:5173](http://localhost:5173) sur votre navigateur ou téléphone.

### 4. Build de production
```bash
npm run build
```

---

## 🌐 Déploiement (Vercel ou Netlify)

1. Connectez votre dépôt GitHub à **Vercel** ou **Netlify**.
2. Configurez la variable d'environnement dans le tableau de bord Vercel / Netlify :
   - `VITE_API_URL` = URL du backend de Parfait (ex: `https://api.maboutique.com`).
3. Déploiement automatique en 1 clic.
