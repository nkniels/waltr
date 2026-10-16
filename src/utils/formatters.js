/**
 * Utilitaires de formatage et de validation
 */

export function formatFCFA(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '0 FCFA';
  }
  const rounded = Math.round(Number(amount));
  // Formatage avec espace comme séparateur de milliers
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return formatted + ' FCFA';
}

export function validateArticleForm({ nom, prix, stock }) {
  const errors = {};

  if (!nom || !nom.trim()) {
    errors.nom = "Le nom de l'article est obligatoire.";
  } else if (nom.trim().length < 2) {
    errors.nom = "Le nom doit comporter au moins 2 caractères.";
  }

  const numPrix = Number(prix);
  if (prix === '' || prix === null || prix === undefined || isNaN(numPrix)) {
    errors.prix = "Veuillez indiquer un prix en FCFA.";
  } else if (!Number.isInteger(numPrix) || numPrix <= 0) {
    errors.prix = "Le prix doit être un nombre entier positif (ex: 5000).";
  }

  const numStock = Number(stock);
  if (stock === '' || stock === null || stock === undefined || isNaN(numStock)) {
    errors.stock = "Veuillez indiquer la quantité en stock.";
  } else if (!Number.isInteger(numStock) || numStock < 0) {
    errors.stock = "Le stock doit être un nombre entier positif ou zéro (ex: 0, 5, 20).";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
