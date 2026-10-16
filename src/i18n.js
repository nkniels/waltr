/**
 * waltr — Internationalisation (FR / EN)
 * Système bilingue français / anglais
 */

export const TRANSLATIONS = {
  fr: {
    // Header & Brand
    storeDefaultName: "Ma Boutique",
    organizedWith: "avec",
    searchPlaceholder: "Rechercher un habit (nom, couleur)...",
    all: "Tous",
    inStock: "En stock",
    outOfStock: "Rupture",
    totalArticles: "Total articles",
    snapClothing: "Photographier un habit",
    snapFirstBtn: "Photographier",
    add: "+ Ajouter",
    guide: "Guide",
    refresh: "Actualiser",
    account: "Compte & Base",

    // Catalog Section
    catalogTitle: "Articles du catalogue",
    searchTitle: "Recherche",
    database: "Base",
    emptyCatalogTitle: "Votre catalogue est vide",
    emptyCatalogDesc: "Prenez en photo votre premier vêtement pour l'ajouter à votre boutique WhatsApp.",
    snapFirstItem: "Photographier mon premier article",
    noResultsTitle: "Aucun vêtement ne correspond à",
    noResultsDesc: "Modifiez votre recherche ou réinitialisez le filtre.",
    clearSearch: "Effacer la recherche",
    step1: "1. Photo",
    step2: "2. Nom",
    step3: "3. Prix FCFA",
    step4: "4. Stock",

    // Article Form (Snap First)
    newArticleTitle: "Nouvel article WhatsApp",
    editArticleTitle: "Modifier l'article",
    stepPhotoTitle: "Photographiez l'habit d'abord",
    stepPhotoSub: "Prenez une photo nette du vêtement avec votre caméra ou choisissez dans la galerie.",
    takePhoto: "Prendre une photo",
    chooseGallery: "Choisir depuis la galerie",
    photoCaptured: "Photo capturée",
    retakePhoto: "Changer la photo",
    continue: "Continuer",
    skipPhoto: "Continuer sans photo",
    stepNameTitle: "Nom de l'habit",
    stepNameSub: "Comment s'appelle ce vêtement pour vos clients WhatsApp ?",
    stepNamePlaceholder: "ex. Robe Wax Étoile, Chemise Lin Col Mao...",
    stepPriceTitle: "Prix de vente (FCFA)",
    stepPriceSub: "Fixez le prix en Francs CFA pour vos clients WhatsApp.",
    stepStockTitle: "Quantité en stock",
    stepStockSub: "Combien d'exemplaires avez-vous prêts à être livrés ?",
    pieces: "pièces",
    saveToStore: "Enregistrer dans la boutique",
    saving: "Enregistrement...",
    updating: "Mise à jour...",
    back: "Retour",
    fillNameError: "Veuillez renseigner un nom pour l'habit.",
    fillPriceError: "Veuillez renseigner un prix valide.",

    // First Login Modal
    firstLoginBadge: "Première connexion",
    setPasswordTitle: "Définissez votre mot de passe",
    setPasswordDesc: "Votre compte boutique a été configuré par l'équipe waltr. Choisissez votre mot de passe personnel pour débloquer votre accès.",
    boutiqueLabel: "Boutique :",
    databaseLabel: "Base de données :",
    managerAccountLabel: "Compte gérant :",
    newPasswordLabel: "Nouveau mot de passe personnel",
    newPasswordPlaceholder: "Votre mot de passe secret",
    confirmPasswordLabel: "Confirmez le mot de passe",
    confirmPasswordPlaceholder: "Répétez le mot de passe",
    activateAccountBtn: "Activer mon compte & Accéder",
    activatingBtn: "Activation du compte...",
    passwordLengthError: "Le mot de passe doit comporter au moins 4 caractères.",
    passwordMismatchError: "Les deux mots de passe ne correspondent pas.",

    // Auth & Database Management
    authModalTitle: "Gestion du Compte & Boutique",
    authModalSub: "Compte marchand & base de données connectée",
    activeStoreLabel: "Boutique active :",
    databaseStatusLabel: "Base de données :",
    managerEmailLabel: "Gérant provisionné :",
    inviteLinkTitle: "Lien d'accès marchand",
    inviteLinkDesc: "Envoyez ce lien direct au marchand. En l'ouvrant, sa base de données sera automatiquement rattachée et il sera guidé pour créer son mot de passe personnel.",
    copyLinkBtn: "Copier le lien",
    copiedLinkBtn: "Lien copié !",
    databaseMgmtTitle: "Gestion de la Base",
    databaseMgmtDesc: "Conservez votre catalogue dans un état propre pour photographier et ajouter vos articles réels.",
    clearDatabaseBtn: "Vider la base (État propre)",
    loadSamplesBtn: "Exemples",
    emailPlaceholder: "gérant@boutique.com",
    passwordPlaceholder: "Mot de passe fourni ou personnel",
    signInBtn: "Se connecter à cette boutique",
    signingInBtn: "Connexion en cours...",
    demoAccessBtn: "Accès rapide Démo",
    logoutBtn: "Déconnexion",

    // Article Card & Badges
    soldOut: "Épuisé",
    unitsLeft: "restant",
    unitsLeftPlural: "restants",
    inStockCount: "en stock",
    edit: "Modifier",
    delete: "Supprimer",
    retry: "Réessayer",

    // Delete Modal
    deleteTitle: "Supprimer cet article ?",
    deleteDesc: "Cette action supprimera définitivement le vêtement de la base de données WhatsApp de votre boutique.",
    cancelBtn: "Annuler",
    deleteBtn: "Supprimer",
    deletingBtn: "Suppression...",

    // Onboarding
    onboardingSlide1Title: "Bienvenue sur waltr !",
    onboardingSlide1Desc: "Votre compagnon intelligent qui vous aide à organiser et gérer votre boutique WhatsApp au quotidien.",
    onboardingSlide2Title: "Photographiez l'habit d'abord",
    onboardingSlide2Desc: "Prenez une photo de vos vêtements directement en rayon. Donnez ensuite le nom, le prix en FCFA et le stock en quelques secondes.",
    onboardingSlide3Title: "Base de données connectée",
    onboardingSlide3Desc: "Vos produits sont synchronisés instantanément avec le bot WhatsApp pour répondre automatiquement à vos clients.",
    onboardingSlide4Title: "Prêt à démarrer ?",
    onboardingSlide4Desc: "Votre catalogue est propre et prêt. Photographiez dès maintenant votre tout premier habit !",
    nextSlide: "Suivant",
    startSnapping: "Photographier mon premier habit",

    // Toasts
    articleAdded: 'Article "{nom}" ajouté au catalogue !',
    articleUpdated: 'Article "{nom}" mis à jour avec photo.',
    articleDeleted: "Article supprimé de la base de données.",
    passwordCreatedSuccess: "Mot de passe créé avec succès ! Bienvenue sur votre tableau de bord waltr.",
    databaseCleared: "Base de données réinitialisée. Votre catalogue est maintenant propre et vide.",
    samplesLoaded: "Exemples de test chargés dans votre base.",
    linkCopiedToast: "Lien d'accès copié dans le presse-papier !",
    firstLoginDetected: "Première connexion détectée. Définissez votre mot de passe personnel.",
    connectedTo: "Connecté à {store}",
    logoutSuccess: "Déconnexion réussie.",
    demoActivated: "Session démo activée.",
  },

  en: {
    // Header & Brand
    storeDefaultName: "My Store",
    organizedWith: "with",
    searchPlaceholder: "Search clothing (name, color)...",
    all: "All",
    inStock: "In stock",
    outOfStock: "Out of stock",
    totalArticles: "Total items",
    snapClothing: "Snap clothing",
    snapFirstBtn: "Snap Photo",
    add: "+ Add",
    guide: "Guide",
    refresh: "Refresh",
    account: "Account & DB",

    // Catalog Section
    catalogTitle: "Catalog items",
    searchTitle: "Search",
    database: "Database",
    emptyCatalogTitle: "Your catalog is empty",
    emptyCatalogDesc: "Snap a photo of your first garment to make it available immediately on WhatsApp.",
    snapFirstItem: "Snap my first item",
    noResultsTitle: "No clothing matches",
    noResultsDesc: "Change your search query or reset the filter.",
    clearSearch: "Clear search",
    step1: "1. Photo",
    step2: "2. Name",
    step3: "3. Price FCFA",
    step4: "4. Stock",

    // Article Form (Snap First)
    newArticleTitle: "New WhatsApp Item",
    editArticleTitle: "Edit Item",
    stepPhotoTitle: "Snap the item first",
    stepPhotoSub: "Take a clear photo of the garment with your camera or select from your gallery.",
    takePhoto: "Take a photo",
    chooseGallery: "Choose from gallery",
    photoCaptured: "Photo captured",
    retakePhoto: "Change photo",
    continue: "Continue",
    skipPhoto: "Continue without photo",
    stepNameTitle: "Garment name",
    stepNameSub: "What is this clothing item called for your WhatsApp customers?",
    stepNamePlaceholder: "e.g. Linen Mandarin Collar Shirt, Star Wax Dress...",
    stepPriceTitle: "Selling price (FCFA)",
    stepPriceSub: "Set the price in CFA Francs (XOF/XAF) for your customers.",
    stepStockTitle: "Stock quantity",
    stepStockSub: "How many units do you have ready to deliver?",
    pieces: "units",
    saveToStore: "Save to store",
    saving: "Saving...",
    updating: "Updating...",
    back: "Back",
    fillNameError: "Please enter a name for the garment.",
    fillPriceError: "Please enter a valid price.",

    // First Login Modal
    firstLoginBadge: "First sign-in",
    setPasswordTitle: "Set your password",
    setPasswordDesc: "Your store account has been configured by the waltr team. Choose your personal password to unlock your dashboard access.",
    boutiqueLabel: "Store:",
    databaseLabel: "Database:",
    managerAccountLabel: "Manager account:",
    newPasswordLabel: "New personal password",
    newPasswordPlaceholder: "Your secret password",
    confirmPasswordLabel: "Confirm password",
    confirmPasswordPlaceholder: "Repeat password",
    activateAccountBtn: "Activate account & Enter",
    activatingBtn: "Activating account...",
    passwordLengthError: "Password must be at least 4 characters long.",
    passwordMismatchError: "Both passwords do not match.",

    // Auth & Database Management
    authModalTitle: "Account & Store Management",
    authModalSub: "Merchant account & connected database",
    activeStoreLabel: "Active store:",
    databaseStatusLabel: "Database:",
    managerEmailLabel: "Configured manager:",
    inviteLinkTitle: "Merchant Access Link",
    inviteLinkDesc: "Send this direct link to the merchant. Upon opening, their database will be automatically attached and they will be guided to create their personal password.",
    copyLinkBtn: "Copy link",
    copiedLinkBtn: "Link copied!",
    databaseMgmtTitle: "Database Management",
    databaseMgmtDesc: "Keep your catalog in a clean state to photograph and add your real inventory.",
    clearDatabaseBtn: "Empty database (Clean state)",
    loadSamplesBtn: "Samples",
    emailPlaceholder: "owner@store.com",
    passwordPlaceholder: "Provided temporary or personal password",
    signInBtn: "Sign in to this store",
    signingInBtn: "Signing in...",
    demoAccessBtn: "Quick Demo Access",
    logoutBtn: "Sign out",

    // Article Card & Badges
    soldOut: "Sold out",
    unitsLeft: "left",
    unitsLeftPlural: "left",
    inStockCount: "in stock",
    edit: "Edit",
    delete: "Delete",
    retry: "Retry",

    // Delete Modal
    deleteTitle: "Delete this item?",
    deleteDesc: "This action will permanently remove the clothing item from your store's WhatsApp database.",
    cancelBtn: "Cancel",
    deleteBtn: "Delete",
    deletingBtn: "Deleting...",

    // Onboarding
    onboardingSlide1Title: "Welcome to waltr!",
    onboardingSlide1Desc: "Your intelligent buddy helping you organize and run your WhatsApp boutique every single day.",
    onboardingSlide2Title: "Snap the photo first",
    onboardingSlide2Desc: "Photograph your clothes right on the rack in 1 second. Then set the name, FCFA price, and stock in seconds.",
    onboardingSlide3Title: "Connected live database",
    onboardingSlide3Desc: "Your items sync instantly with the WhatsApp bot to respond automatically to your shoppers.",
    onboardingSlide4Title: "Ready to get started?",
    onboardingSlide4Desc: "Your catalog is clean and ready. Snap your very first garment right now!",
    nextSlide: "Next",
    startSnapping: "Snap my first item",

    // Toasts
    articleAdded: 'Item "{nom}" added to catalog!',
    articleUpdated: 'Item "{nom}" updated with photo.',
    articleDeleted: "Item deleted from database.",
    passwordCreatedSuccess: "Password created successfully! Welcome to your waltr dashboard.",
    databaseCleared: "Database reset. Your catalog is now clean and empty.",
    samplesLoaded: "Sample test items loaded into your database.",
    linkCopiedToast: "Access link copied to clipboard!",
    firstLoginDetected: "First login detected. Set your personal password.",
    connectedTo: "Connected to {store}",
    logoutSuccess: "Logged out successfully.",
    demoActivated: "Demo session activated.",
  }
};

export function getInitialLanguage() {
  if (typeof window === 'undefined') return 'fr';
  const saved = localStorage.getItem('waltr_lang');
  if (saved === 'en' || saved === 'fr') return saved;
  const browserLang = navigator.language || navigator.userLanguage || '';
  return browserLang.startsWith('en') ? 'en' : 'fr';
}

export function saveLanguage(lang) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('waltr_lang', lang);
}
