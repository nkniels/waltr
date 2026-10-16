import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Check, 
  AlertCircle, 
  Camera, 
  Upload, 
  RefreshCw, 
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';
import { formatFCFA, validateArticleForm } from '../utils/formatters';
import { compressImageFile } from '../utils/imageCompressor';
import { TRANSLATIONS } from '../i18n';

export default function ArticleFormModal({
  isOpen,
  onClose,
  onSubmit,
  articleToEdit = null,
  isSubmitting = false,
  lang = 'fr'
}) {
  const t = (key) => TRANSLATIONS[lang]?.[key] || TRANSLATIONS['fr']?.[key] || key;
  const isEditing = Boolean(articleToEdit);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [formData, setFormData] = useState({
    nom: '',
    prix: '',
    stock: '',
    image: null,
  });

  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (articleToEdit) {
      setFormData({
        nom: articleToEdit.nom || '',
        prix: articleToEdit.prix !== undefined ? String(articleToEdit.prix) : '',
        stock: articleToEdit.stock !== undefined ? String(articleToEdit.stock) : '',
        image: articleToEdit.image || null,
      });
      setErrors({});
      setTouched({});
      setPhotoError(null);
    } else {
      setFormData({
        nom: '',
        prix: '',
        stock: '',
        image: null,
      });
      setErrors({});
      setTouched({});
      setPhotoError(null);
    }
  }, [articleToEdit, isOpen]);

  if (!isOpen) return null;

  const handlePhotoCapture = async (file) => {
    if (!file) return;
    setIsProcessingPhoto(true);
    setPhotoError(null);

    try {
      const compressedDataUrl = await compressImageFile(file);
      setFormData(prev => ({ ...prev, image: compressedDataUrl }));
    } catch (err) {
      console.error('Erreur compression image:', err);
      setPhotoError("Impossible de traiter cette photo. Essayez un autre format d'image.");
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({ ...prev, image: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

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
      image: formData.image,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-4 bg-neutral-900/40 backdrop-blur-xs transition-opacity animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={!isSubmitting ? onClose : undefined}
      />

      <div className="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border border-neutral-200/90 shadow-2xl overflow-hidden z-10 animate-slide-up sm:animate-fade-in max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-semibold text-neutral-950 tracking-tight">
              {isEditing ? t('editArticleTitle') : t('newArticleTitle')}
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              {t('step1')} → {t('step2')} → {t('step3')} → {t('step4')}
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

        {/* Form Body (Scrollable if needed on mobile) */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* STEP 1: SNAP THE ITEM (Photo first!) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-neutral-900 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-neutral-950 text-white text-[10px] flex items-center justify-center font-mono">1</span>
                <span>{t('stepPhotoTitle')}</span>
              </label>
              <span className="text-[11px] text-neutral-400">
                {formData.image ? t('photoCaptured') : "WhatsApp"}
              </span>
            </div>

            {/* Hidden file inputs for direct camera capture and gallery upload */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handlePhotoCapture(e.target.files[0])}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handlePhotoCapture(e.target.files[0])}
            />

            {/* Photo Preview or Snap Button */}
            {formData.image ? (
              <div className="relative group rounded-xl overflow-hidden border border-neutral-200 bg-neutral-50 aspect-[4/3] flex items-center justify-center">
                <img
                  src={formData.image}
                  alt="Aperçu vêtement"
                  className="w-full h-full object-cover"
                />
                
                {/* Floating change / remove actions */}
                <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white text-neutral-900 text-xs font-medium rounded-lg shadow-sm hover:bg-neutral-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{t('retakePhoto')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-3 py-1.5 bg-rose-600 text-white text-xs font-medium rounded-lg shadow-sm hover:bg-rose-700 transition-colors cursor-pointer"
                  >
                    {t('cancelBtn')}
                  </button>
                </div>

                <div className="absolute bottom-2 right-2 bg-neutral-950/70 text-white text-[10px] px-2 py-0.5 rounded-md backdrop-blur-xs font-mono">
                  {t('photoCaptured')}
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-neutral-200 hover:border-neutral-400 rounded-xl p-4 sm:p-5 text-center transition-colors bg-neutral-50/50">
                {isProcessingPhoto ? (
                  <div className="py-4 flex flex-col items-center justify-center gap-2 text-neutral-500 text-xs">
                    <RefreshCw className="w-5 h-5 animate-spin text-neutral-900" />
                    <span>{t('saving')}</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-center gap-3 mb-3">
                      {/* Direct Snap with camera button */}
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="px-4 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-medium flex items-center gap-2 shadow-2xs transition-all active:scale-95 cursor-pointer"
                      >
                        <Camera className="w-4 h-4 text-orange-400" />
                        <span>{t('takePhoto')}</span>
                      </button>

                      {/* Pick from gallery */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-2.5 bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Importer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span className="hidden xs:inline">{t('chooseGallery')}</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-neutral-400">
                      {t('stepPhotoSub')}
                    </p>
                  </div>
                )}
              </div>
            )}

            {photoError && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {photoError}
              </p>
            )}
          </div>

          {/* STEP 2: NOM DE L'ARTICLE */}
          <div>
            <label className="block text-xs font-semibold text-neutral-900 mb-1.5 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-neutral-950 text-white text-[10px] flex items-center justify-center font-mono">2</span>
              <span>{t('stepNameTitle')} <span className="text-neutral-400">*</span></span>
            </label>
            <input
              type="text"
              required
              value={formData.nom}
              onChange={(e) => handleChange('nom', e.target.value)}
              onBlur={() => handleBlur('nom')}
              placeholder={t('stepNamePlaceholder')}
              className={`w-full px-3 py-2 text-sm rounded-lg border bg-white outline-hidden transition-colors ${
                errors.nom && touched.nom
                  ? 'border-rose-300 focus:border-rose-500'
                  : 'border-neutral-200 focus:border-neutral-950'
              }`}
            />
            {errors.nom && touched.nom && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.nom}
              </p>
            )}
          </div>

          {/* STEP 3: PRIX EN FCFA */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-neutral-900 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-neutral-950 text-white text-[10px] flex items-center justify-center font-mono">3</span>
                <span>{t('stepPriceTitle')} <span className="text-neutral-400">*</span></span>
              </label>
              {formData.prix && !isNaN(Number(formData.prix)) && (
                <span className="text-xs font-mono font-medium text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
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
                placeholder="ex: 15000"
                className={`w-full px-3 py-2 pr-12 text-sm rounded-lg border bg-white outline-hidden font-mono transition-colors ${
                  errors.prix && touched.prix
                    ? 'border-rose-300 focus:border-rose-500'
                    : 'border-neutral-200 focus:border-neutral-950'
                }`}
              />
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-mono text-neutral-400 pointer-events-none">
                FCFA
              </span>
            </div>
            {errors.prix && touched.prix && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.prix}
              </p>
            )}
          </div>

          {/* STEP 4: QUANTITÉ EN STOCK */}
          <div>
            <label className="block text-xs font-semibold text-neutral-900 mb-1.5 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-neutral-950 text-white text-[10px] flex items-center justify-center font-mono">4</span>
              <span>{t('stepStockTitle')} <span className="text-neutral-400">*</span></span>
            </label>
            <input
              type="number"
              min="0"
              step="1"
              required
              value={formData.stock}
              onChange={(e) => handleChange('stock', e.target.value)}
              onBlur={() => handleBlur('stock')}
              placeholder="ex: 8"
              className={`w-full px-3 py-2 text-sm rounded-lg border bg-white outline-hidden font-mono transition-colors ${
                errors.stock && touched.stock
                  ? 'border-rose-300 focus:border-rose-500'
                  : 'border-neutral-200 focus:border-neutral-950'
              }`}
            />
            {errors.stock && touched.stock ? (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.stock}
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-neutral-400">
                {t('stepStockSub')}
              </p>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3.5 py-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              {t('cancelBtn')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-medium transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isEditing ? t('updating') : t('saving')}</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{isEditing ? t('saveToStore') : t('saveToStore')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
