import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, X, Camera } from 'lucide-react';
import WaltrMascot from './WaltrMascot';

const ONBOARDING_STEPS_FR = [
  {
    id: 'welcome',
    image: '/illustrations/waltr-welcome.jpg',
    fallbackVariant: 'welcome',
    badge: 'Bienvenue',
    title: 'Rencontrez waltr',
    subtitle: 'Votre copilote intelligent WhatsApp Commerce',
    description:
      'waltr est votre pote intelligent qui vous aide à organiser et gérer votre boutique WhatsApp au quotidien.',
    bullets: [
      'Gestion simple pensée pour le commerce en Afrique',
      'Votre boutique est au centre, waltr est là pour vous épauler',
    ],
  },
  {
    id: 'catalog',
    image: '/illustrations/waltr-catalog.jpg',
    fallbackVariant: 'catalog',
    badge: 'Snap First',
    title: 'Photographiez l\'habit d\'abord',
    subtitle: 'Photo → Nom → Prix FCFA → Stock',
    description:
      'Prenez en photo votre article directement en rayon. Renseignez son nom, son prix en FCFA et sa quantité en quelques secondes.',
    bullets: [
      '1. Photo nette avec votre appareil ou galerie',
      'Filtres en 1 clic : Tous, En stock, Rupture',
    ],
  },
  {
    id: 'whatsapp',
    image: '/illustrations/waltr-whatsapp.jpg',
    fallbackVariant: 'whatsapp',
    badge: 'Automatisation',
    title: 'Connecté à vos conversations',
    subtitle: 'Vos clients commandent sans friction',
    description:
      'Les articles de votre catalogue sont disponibles pour vos clients WhatsApp 24h/24. Fini les pertes de temps à envoyer les mêmes photos.',
    bullets: [
      'Zéro friction dans le parcours client',
      'Mise à jour en temps réel des disponibilités',
    ],
  },
  {
    id: 'launch',
    image: '/illustrations/waltr-launch.jpg',
    fallbackVariant: 'launch',
    badge: 'Prêt à vendre',
    title: 'Votre boutique est prête !',
    subtitle: 'Photographiez votre premier article dès maintenant',
    description:
      'Votre catalogue est propre. Prenez en photo votre tout premier vêtement pour démarrer.',
    bullets: [
      'Modifier ou supprimer vos articles à tout moment',
      'Accès rapide à ce guide depuis le menu en-tête',
    ],
  },
];

const ONBOARDING_STEPS_EN = [
  {
    id: 'welcome',
    image: '/illustrations/waltr-welcome.jpg',
    fallbackVariant: 'welcome',
    badge: 'Welcome',
    title: 'Meet waltr',
    subtitle: 'Your intelligent WhatsApp Commerce buddy',
    description:
      'waltr is your smart pal helping you organize and manage your WhatsApp boutique on a daily basis.',
    bullets: [
      'Simple management built for modern African retail',
      'Your boutique comes first, waltr is here as your companion',
    ],
  },
  {
    id: 'catalog',
    image: '/illustrations/waltr-catalog.jpg',
    fallbackVariant: 'catalog',
    badge: 'Snap First',
    title: 'Snap the garment first',
    subtitle: 'Photo → Name → FCFA Price → Stock',
    description:
      'Snap a photo of your item directly on the rack. Enter its name, selling price in FCFA, and stock in seconds.',
    bullets: [
      '1. Clear photo with your phone camera or gallery',
      '1-click filters: All, In stock, Out of stock',
    ],
  },
  {
    id: 'whatsapp',
    image: '/illustrations/waltr-whatsapp.jpg',
    fallbackVariant: 'whatsapp',
    badge: 'Automation',
    title: 'Connected to WhatsApp',
    subtitle: 'Your customers order with zero friction',
    description:
      'Your catalog items are available for your WhatsApp customers 24/7 without sending repeated photos manually.',
    bullets: [
      'Zero friction in the customer journey',
      'Real-time inventory availability sync',
    ],
  },
  {
    id: 'launch',
    image: '/illustrations/waltr-launch.jpg',
    fallbackVariant: 'launch',
    badge: 'Ready to sell',
    title: 'Your store is ready!',
    subtitle: 'Snap your first garment right now',
    description:
      'Your catalog is clean. Take a photo of your very first clothing piece to get started.',
    bullets: [
      'Edit or delete your items at any time',
      'Quick access to this guide anytime from the top bar',
    ],
  },
];

export default function OnboardingModal({
  isOpen,
  onClose,
  onOpenAddModal,
  lang = 'fr'
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [imgError, setImgError] = useState(false);
  const steps = lang === 'en' ? ONBOARDING_STEPS_EN : ONBOARDING_STEPS_FR;

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setImgError(false);
    }
  }, [isOpen]);

  useEffect(() => {
    setImgError(false);
  }, [currentStep]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        handleComplete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep]);

  if (!isOpen) return null;

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      handleComplete();
    } else {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleComplete = () => {
    try {
      localStorage.setItem('waltr_onboarding_completed', 'true');
    } catch (e) {
      // ignore localstorage errors
    }
    onClose();
  };

  const handleStartWithAdd = () => {
    handleComplete();
    if (onOpenAddModal) {
      setTimeout(() => {
        onOpenAddModal();
      }, 150);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-4 bg-neutral-900/40 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={handleComplete} />

      {/* Modal Card */}
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl border border-neutral-200/90 shadow-2xl overflow-hidden z-10 animate-slide-up sm:animate-fade-in">
        {/* Top bar with Step Counter and Close */}
        <div className="px-5 pt-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentStep 
                    ? 'w-7 bg-neutral-950' 
                    : idx < currentStep 
                    ? 'w-3 bg-neutral-400' 
                    : 'w-3 bg-neutral-200'
                }`}
                title={`Étape ${idx + 1}`}
              />
            ))}
            <span className="text-[11px] font-mono text-neutral-400 ml-2">
              {currentStep + 1}/{steps.length}
            </span>
          </div>

          <button
            onClick={handleComplete}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            title="Passer l'introduction"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mascot High-Res Illustration Area */}
        <div className="pt-2 pb-1 px-6 flex justify-center items-center bg-white">
          <div className="relative w-full max-w-[260px] sm:max-w-[290px] aspect-[4/3] rounded-2xl overflow-hidden flex items-center justify-center">
            {!imgError ? (
              <img
                src={step.image}
                alt={step.title}
                onError={() => setImgError(true)}
                className="w-full h-full object-contain select-none"
              />
            ) : (
              <WaltrMascot variant={step.fallbackVariant} size={110} />
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="px-6 py-3 text-center sm:text-left">
          <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-tight bg-neutral-100 text-neutral-700 border border-neutral-200/70 mb-2">
            {step.badge}
          </div>

          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-950">
            {step.title}
          </h2>

          <p className="text-xs font-medium text-neutral-500 mt-0.5">
            {step.subtitle}
          </p>

          <p className="mt-2 text-xs text-neutral-600 leading-relaxed max-w-md mx-auto sm:mx-0">
            {step.description}
          </p>

          {/* Minimalist Feature Bullet list */}
          <div className="mt-3.5 space-y-1.5 bg-neutral-50 border border-neutral-200/60 rounded-xl p-3 text-left">
            {step.bullets.map((b, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-neutral-700">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span>
                <span className="font-medium">{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-3.5 bg-white border-t border-neutral-100 flex items-center justify-between gap-3">
          {/* Skip / Back button */}
          {currentStep > 0 ? (
            <button
              onClick={handlePrev}
              className="px-3 py-2 text-xs font-medium text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Back' : 'Précédent'}</span>
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="px-3 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
            >
              {lang === 'en' ? 'Skip intro' : "Passer l'intro"}
            </button>
          )}

          {/* Next / Complete button */}
          {isLast ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleComplete}
                className="px-3.5 py-2 text-xs font-medium text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              >
                {lang === 'en' ? 'Explore' : 'Explorer'}
              </button>
              <button
                onClick={handleStartWithAdd}
                className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-medium rounded-lg transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-orange-400" />
                <span>{lang === 'en' ? 'Snap first garment' : 'Photographier un habit'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-medium rounded-lg transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>{lang === 'en' ? 'Continue' : 'Continuer'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
