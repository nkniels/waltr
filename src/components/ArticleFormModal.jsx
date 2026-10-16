import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-4 bg-neutral-900/30 backdrop-blur-xs transition-opacity animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={!isSubmitting ? onClose : undefined}
      />

      <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border border-neutral-200/80 shadow-xl overflow-hidden z-10 animate-slide-up sm:animate-fade-in">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-neutral-950 tracking-tight">
              {isEditing ? "Modifier l'article" : "Nouvel article"}
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              {isEditing ? "Mettez à jour les champs du catalogue" : "Ajoutez un vêtement au catalogue WhatsApp"}
            </p>
          </div>
          
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Field: Nom */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
              Nom de l'article <span className="text-neutral-400">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={formData.nom}
              onChange={(e) => handleChange('nom', e.target.value)}
              onBlur={() => handleBlur('nom')}
              placeholder="ex: Chemise en lin blanc"
              className={"w-full px-3 py-2 text-sm rounded-lg border bg-white outline-hidden transition-colors " + (
                errors.nom && touched.nom
                  ? 'border-rose-300 focus:border-rose-500'
                  : 'border-neutral-200 focus:border-neutral-950'
              )}
            />
            {errors.nom && touched.nom && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.nom}
              </p>
            )}
          </div>

          {/* Field: Prix */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-neutral-700">
                Prix (FCFA) <span className="text-neutral-400">*</span>
              </label>
              {formData.prix && !isNaN(Number(formData.prix)) && (
                <span className="text-xs font-mono font-medium text-neutral-500">
                  {formatFCFA(formData.prix)}
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
                placeholder="15000"
                className={"w-full px-3 py-2 pr-12 text-sm rounded-lg border bg-white outline-hidden font-mono transition-colors " + (
                  errors.prix && touched.prix
                    ? 'border-rose-300 focus:border-rose-500'
                    : 'border-neutral-200 focus:border-neutral-950'
                )}
              />
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-mono text-neutral-400 pointer-events-none">
                FCFA
              </span>
            </div>
            {errors.prix && touched.prix && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.prix}
              </p>
            )}
          </div>

          {/* Field: Stock */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
              Quantité en stock <span className="text-neutral-400">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="1"
              required
              value={formData.stock}
              onChange={(e) => handleChange('stock', e.target.value)}
              onBlur={() => handleBlur('stock')}
              placeholder="10 (0 = Épuisé)"
              className={"w-full px-3 py-2 text-sm rounded-lg border bg-white outline-hidden font-mono transition-colors " + (
                errors.stock && touched.stock
                  ? 'border-rose-300 focus:border-rose-500'
                  : 'border-neutral-200 focus:border-neutral-950'
              )}
            />
            {errors.stock && touched.stock ? (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.stock}
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-neutral-400">
                Définir 0 marquera l'article comme Épuisé.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3.5 py-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-medium transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{isEditing ? "Enregistrer" : "Ajouter"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
