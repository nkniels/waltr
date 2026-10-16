import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, X, Sparkles, Check } from 'lucide-react';
import WaltrMascot from './WaltrMascot';

const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    variant: 'welcome',
    badge: 'Bienvenue',
    title: 'Rencontrez waltr',
    subtitle: 'Votre copilote intelligent WhatsApp Commerce',
    description:
      'waltr transforme votre boutique WhatsApp en machine de vente fluide. Gérez vos articles, suivez vos stocks et servez vos clients plus vite.',
    bullets: [
      'Gestion simple pensée pour le commerce en Afrique',
      'Fonctionne immédiatement en Mode Démo ou avec votre API',
    ],
  },
  {
    id: 'catalog',
    variant: 'catalog',
    badge: 'Catalogue & Stocks',
    title: 'Gestion ultra-simple des articles',
    subtitle: 'Prix en FCFA & alertes de rupture automatiques',
    description:
      'Remplissez simplement le nom, le prix en FCFA et la quantité en stock. Dès qu\'un vêtement est épuisé, waltr l\'affiche immédiatement en rupture.',
    bullets: [
      'Formatage monétaire FCFA instantané',
      'Filtres en 1 clic : Tous, En stock, Rupture',
    ],
  },
  {
    id: 'whatsapp',
    variant: 'whatsapp',
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
    variant: 'launch',
    badge: 'Prêt à vendre',
    title: 'Vous avez le contrôle !',
    subtitle: 'Lancez votre premier article dès maintenant',
    description:
      'Ajoutez vos premiers vêtements ou explorez les données de démonstration pour tester toutes les fonctionnalités de la boutique.',
    bullets: [
      'Modifier ou supprimer vos articles à tout moment',
      'Accès rapide à ce guide depuis le menu en-tête',
    ],
  },
];

export default function OnboardingModal({
  isOpen,
  onClose,
  onOpenAddModal
}) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

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

  const step = ONBOARDING_STEPS[currentStep];
  const isLast = currentStep === ONBOARDING_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      handleComplete();
    } else {
      setCurrentStep(prev => Math.min(prev + 1, ONBOARDING_STEPS.length - 1));
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
            {ONBOARDING_STEPS.map((_, idx) => (
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
              {currentStep + 1}/{ONBOARDING_STEPS.length}
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

        {/* Mascot Illustration Area */}
        <div className="pt-2 pb-1 flex justify-center items-center bg-gradient-to-b from-neutral-50/50 to-white">
          <div className="transition-all duration-200 transform scale-100">
            <WaltrMascot variant={step.variant} size={110} />
          </div>
        </div>

        {/* Content Area */}
        <div className="px-6 py-4 text-center sm:text-left">
          <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-tight bg-neutral-100 text-neutral-600 border border-neutral-200/70 mb-2">
            {step.badge}
          </div>

          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-950">
            {step.title}
          </h2>

          <p className="text-xs font-medium text-neutral-500 mt-0.5">
            {step.subtitle}
          </p>

          <p className="mt-2.5 text-xs text-neutral-600 leading-relaxed max-w-md mx-auto sm:mx-0">
            {step.description}
          </p>

          {/* Minimalist Feature Bullet list */}
          <div className="mt-4 space-y-1.5 bg-neutral-50 border border-neutral-200/60 rounded-xl p-3 text-left">
            {step.bullets.map((b, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-neutral-700">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span>
                <span className="font-medium">{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 bg-white border-t border-neutral-100 flex items-center justify-between gap-3">
          {/* Skip / Back button */}
          {currentStep > 0 ? (
            <button
              onClick={handlePrev}
              className="px-3 py-2 text-xs font-medium text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Précédent</span>
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="px-3 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
            >
              Passer l'intro
            </button>
          )}

          {/* Next / Complete button */}
          {isLast ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleComplete}
                className="px-3.5 py-2 text-xs font-medium text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              >
                Explorer
              </button>
              <button
                onClick={handleStartWithAdd}
                className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-medium rounded-lg transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Ajouter un article</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-medium rounded-lg transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Continuer</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
