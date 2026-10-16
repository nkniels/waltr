import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle, ShoppingBag, Shirt } from 'lucide-react';
import { formatFCFA, validateArticleForm } from '../utils/formatters';

export default function ArticleFormModal({
  isOpen,
  onClose,
  onSubmit,
  articleToEdit = null,
  isSubmitting = false
}) {
  const isEditing = Boolean(articleToEdit);

  const [formData, setFormData] = useState({
    nom: '',
    prix: '',
    stock: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (articleToEdit) {
      setFormData({
        nom: articleToEdit.nom || '',
        prix: articleToEdit.prix !== undefined ? String(articleToEdit.prix) : '',
        stock: articleToEdit.stock !== undefined ? String(articleToEdit.stock) : '',
      });
      setErrors({});
      setTouched({});
    } else {
      setFormData({
        nom: '',
        prix: '',
        stock: '',
      });
      setErrors({});
      setTouched({});
    }
  }, [articleToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    if (touched[field]) {
      const validation = validateArticleForm(updated);
      setErrors(validation.errors);
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const validation = validateArticleForm(formData);
    setErrors(validation.errors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ nom: true, prix: true, stock: true });

    const validation = validateArticleForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit({
      nom: formData.nom,
      prix: parseInt(formData.prix, 10),
      stock: parseInt(formData.stock, 10),
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Backdrop */}
      <div 
        className="fixed inset-0" 
        onClick={!isSubmitting ? onClose : undefined}
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 animate-slide-up sm:animate-fade-in">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${
              isEditing ? 'bg-indigo-600' : 'bg-emerald-600'
            }`}>
              <Shirt className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isEditing ? "Modifier l'article" : "Ajouter un habit / article"}
              </h2>
              <p className="text-[11px] text-slate-500">
                {isEditing ? "Mettez à jour les informations du vêtement" : "Remplissez les 3 champs simples ci-dessous"}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Field 1: Nom de l'article */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nom du vêtement / article <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={formData.nom}
              onChange={(e) => handleChange('nom', e.target.value)}
              onBlur={() => handleBlur('nom')}
              placeholder="ex: Chemise Blanche Manches Courtes"
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white outline-hidden transition-all ${
                errors.nom && touched.nom
                  ? 'border-rose-300 focus:border-rose-500 ring-2 ring-rose-100'
                  : 'border-slate-200 focus:border-emerald-500 ring-2 ring-transparent focus:ring-emerald-100'
              }`}
            />
            {errors.nom && touched.nom && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.nom}
              </p>
            )}
          </div>

          {/* Field 2: Prix en FCFA */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Prix (en FCFA) <span className="text-rose-500">*</span>
              </label>
              {formData.prix && !isNaN(Number(formData.prix)) && (
                <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Aperçu : {formatFCFA(formData.prix)}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="number"
                min="1"
                step="1"
                required
                value={formData.prix}
                onChange={(e) => handleChange('prix', e.target.value)}
                onBlur={() => handleBlur('prix')}
                placeholder="ex: 12000"
                className={`w-full px-3.5 py-2.5 pr-14 text-sm rounded-xl border bg-slate-50/50 focus:bg-white outline-hidden transition-all ${
                  errors.prix && touched.prix
                    ? 'border-rose-300 focus:border-rose-500 ring-2 ring-rose-100'
                    : 'border-slate-200 focus:border-emerald-500 ring-2 ring-transparent focus:ring-emerald-100'
                }`}
              />
              <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-bold text-slate-400 pointer-events-none">
                FCFA
              </span>
            </div>
            {errors.prix && touched.prix ? (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.prix}
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-slate-400">
                Entrez un nombre entier sans virgule (ex: 8500)
              </p>
            )}
          </div>

          {/* Field 3: Stock */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Quantité en stock <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="1"
              required
              value={formData.stock}
              onChange={(e) => handleChange('stock', e.target.value)}
              onBlur={() => handleBlur('stock')}
              placeholder="ex: 10 (ou 0 pour rupture)"
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white outline-hidden transition-all ${
                errors.stock && touched.stock
                  ? 'border-rose-300 focus:border-rose-500 ring-2 ring-rose-100'
                  : 'border-slate-200 focus:border-emerald-500 ring-2 ring-transparent focus:ring-emerald-100'
              }`}
            />
            {errors.stock && touched.stock ? (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.stock}
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-slate-400">
                0 affichera automatiquement l'article en "Rupture de stock" (rouge)
              </p>
            )}
          </div>

          {/* Buttons: Annuler & Valider */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-2.5 px-4 rounded-xl text-white font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                isEditing
                  ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isEditing ? "Enregistrer les modifications" : "Ajouter au catalogue"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
