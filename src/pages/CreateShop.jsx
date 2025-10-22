import { useState, useRef } from 'react';
import { ChevronRight, ChevronLeft, Upload, AlertCircle, CheckCircle, Info } from 'lucide-react';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { useShopsData } from '../context/ShopsDataContext';
import { useNavigate } from 'react-router-dom';

export default function CreateShop() {
  const fileLogoRef = useRef(null);
  const fileBannerRef = useRef(null);
  const { user, updateUser } = useAuth();
  const { createShop } = useShopsData();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    shopName: '',
    shopSlug: '',
    tagline: '',
    category: [],
    description: '',
    address: '',
    phone: '',
    email: '',
    facebook: '',
    instagram: '',
    tiktok: '',
    website: '',
    logo: null,
    logoPreview: null,
    banner: null,
    bannerPreview: null,
  });

  // Générer slug automatique
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'shopName') {
      newValue = value;
      setFormData({
        ...formData,
        [name]: newValue,
        shopSlug: generateSlug(newValue),
      });
    } else {
      setFormData({ ...formData, [name]: newValue });
    }

    // Effacer l'erreur du champ si corrigé
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleCategoryToggle = (cat) => {
    setFormData({
      ...formData,
      category: formData.category.includes(cat)
        ? formData.category.filter(c => c !== cat)
        : [...formData.category, cat],
    });
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const maxSize = 2 * 1024 * 1024; // 2MB
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (file.size > maxSize) {
      setToast({ type: 'error', message: 'Fichier trop volumineux (max 2MB)' });
      return;
    }

    if (!validTypes.includes(file.type)) {
      setToast({ type: 'error', message: 'Format non accepté (JPG, PNG, WebP seulement)' });
      return;
    }

    // Créer aperçu
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'logo') {
        setFormData({
          ...formData,
          logo: file,
          logoPreview: reader.result,
        });
      } else if (type === 'banner') {
        setFormData({
          ...formData,
          banner: file,
          bannerPreview: reader.result,
        });
      }
      setToast({ type: 'success', message: `${type === 'logo' ? 'Logo' : 'Bannière'} téléchargé(e)` });
    };
    reader.readAsDataURL(file);
  };

  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.shopName.trim()) newErrors.shopName = 'Nom obligatoire';
      else if (formData.shopName.trim().length < 3) newErrors.shopName = 'Min 3 caractères';

      if (!formData.description.trim()) newErrors.description = 'Description obligatoire';
      else if (formData.description.trim().length < 50) newErrors.description = 'Min 50 caractères';

      if (!formData.email.trim()) newErrors.email = 'Email obligatoire';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email invalide';

      if (!formData.phone.trim()) newErrors.phone = 'Téléphone obligatoire';
      else if (!/^[\d\s+().-]{7,}$/.test(formData.phone)) newErrors.phone = 'Téléphone invalide';

      if (formData.category.length === 0) newErrors.category = 'Sélectionnez au moins 1 catégorie';

      if (!formData.address.trim()) newErrors.address = 'Adresse obligatoire';
    }

    if (step === 2) {
      if (!formData.logoPreview) newErrors.logo = 'Logo obligatoire';
      if (!formData.bannerPreview) newErrors.banner = 'Bannière obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    } else {
      setToast({ type: 'error', message: 'Veuillez corriger les erreurs' });
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) {
      setToast({ type: 'error', message: 'Veuillez corriger les erreurs' });
      return;
    }

    setLoading(true);
    // Simulation API
    setTimeout(() => {
      // Sauvegarder la boutique dans localStorage
      const shopId = createShop(user.id, formData);
      
      // Mettre à jour le user avec le shopId réel
      updateUser({ shopId });
      
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md text-center animate-fadeIn">
          <div className="mb-6 flex justify-center">
            <CheckCircle size={80} className="text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Félicitations 🎉</h1>
          <p className="text-gray-600 mb-8">
            Votre boutique <span className="font-bold text-blue-600">"{formData.shopName}"</span> est en ligne !
            Vous pouvez maintenant ajouter vos produits et commencer à vendre.
          </p>
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">URL de votre boutique :</span>
              <br />
              doshopping.com/boutique/<span className="text-blue-600">{formData.shopSlug}</span>
            </p>
          </div>
          <button
            onClick={() => navigate(`/vendor/${user.id}`)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Aller à ma boutique →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-3">Créez votre boutique</h1>
          <p className="text-blue-100 text-lg">Rejoignez notre communauté de vendeurs et atteignez plus de clients</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                  s <= step
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-20 h-1 mx-2 transition-all ${
                    s < step ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm font-semibold text-gray-600">
          <span>Infos générales</span>
          <span>Apparence</span>
          <span>Confirmation</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-3xl blur-2xl opacity-30"></div>
              <img
                src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=500&h=600&fit=crop"
                alt="Créer une boutique"
                className="relative w-full max-w-sm rounded-3xl shadow-2xl"
              />
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
            {step === 1 && <StepOne formData={formData} errors={errors} handleInputChange={handleInputChange} handleCategoryToggle={handleCategoryToggle} />}
            {step === 2 && <StepTwo formData={formData} errors={errors} fileLogoRef={fileLogoRef} fileBannerRef={fileBannerRef} handleFileUpload={handleFileUpload} />}
            {step === 3 && <StepThree formData={formData} />}

            {/* Navigation */}
            <div className="flex gap-4 mt-12">
              {step > 1 && (
                <button
                  onClick={handlePrevious}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                >
                  <ChevronLeft size={20} />
                  Retour
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg"
                >
                  Suivant
                  <ChevronRight size={20} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Création en cours...' : 'Créer ma boutique 🚀'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className={`rounded-lg shadow-lg p-4 flex items-center gap-3 ${
            toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Composant Étape 1
function StepOne({ formData, errors, handleInputChange, handleCategoryToggle }) {
  const categories = ['Mode africaine', 'Électronique', 'Beauté & Soins', 'Maison & Décor', 'Alimentation', 'Artisanat local', 'Bijoux', 'Livres & Médias'];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Informations générales</h2>

      {/* Nom Boutique */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Nom de la boutique *</label>
        <input
          type="text"
          name="shopName"
          placeholder="Ex: TechZone, Bijoux Fatou..."
          value={formData.shopName}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
            errors.shopName ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-500'
          }`}
        />
        {errors.shopName && <p className="text-red-500 text-sm mt-1">{errors.shopName}</p>}
      </div>

      {/* URL Slug */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">URL personnalisée</label>
        <div className="flex items-center">
          <span className="text-gray-600 px-4 py-3 bg-gray-100 rounded-l-xl">doshopping.com/boutique/</span>
          <input
            type="text"
            value={formData.shopSlug}
            readOnly
            className="flex-1 px-4 py-3 border-2 border-gray-200 border-l-0 rounded-r-xl bg-gray-50 text-gray-600"
          />
        </div>
      </div>

      {/* Slogan */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Slogan / Phrase d'accroche</label>
        <input
          type="text"
          name="tagline"
          placeholder="Ex: La qualité à petit prix..."
          value={formData.tagline}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
        />
      </div>

      {/* Catégories */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Catégories principales *</label>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryToggle(cat)}
              className={`px-4 py-3 rounded-lg border-2 font-medium transition-all text-sm ${
                formData.category.includes(cat)
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Description de la boutique *</label>
        <textarea
          name="description"
          placeholder="Décrivez votre boutique, vos produits, votre vision..."
          value={formData.description}
          onChange={handleInputChange}
          rows="4"
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all resize-none ${
            errors.description ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-500'
          }`}
        />
        <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500 caractères</p>
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      {/* Adresse */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Adresse professionnelle *</label>
        <input
          type="text"
          name="address"
          placeholder="Ex: Rue de la Paix, Dakar"
          value={formData.address}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
            errors.address ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-500'
          }`}
        />
        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Téléphone / WhatsApp *</label>
        <input
          type="tel"
          name="phone"
          placeholder="+221 76 123 45 67"
          value={formData.phone}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
            errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-500'
          }`}
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Email professionnel *</label>
        <input
          type="email"
          name="email"
          placeholder="boutique@example.com"
          value={formData.email}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
            errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-500'
          }`}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>
    </div>
  );
}

// Composant Étape 2
function StepTwo({ formData, errors, fileLogoRef, fileBannerRef, handleFileUpload }) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Apparence de votre boutique</h2>

      {/* Logo */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
          Logo *
          <Info size={16} className="text-blue-500 cursor-help" title="Visible sur votre page boutique et vos produits" />
        </label>
        <div className="flex gap-6 flex-col lg:flex-row">
          <div
            onClick={() => fileLogoRef.current?.click()}
            className={`flex-1 border-3 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              errors.logo ? 'border-red-500 bg-red-50' : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50'
            }`}
          >
            <Upload className="w-12 h-12 mx-auto text-blue-500 mb-3" />
            <p className="font-semibold text-gray-800">Cliquez pour télécharger</p>
            <p className="text-xs text-gray-500">JPG, PNG ou WebP (max 2MB)</p>
            <input
              ref={fileLogoRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleFileUpload(e, 'logo')}
              hidden
            />
          </div>
          {formData.logoPreview && (
            <div className="flex-1 flex items-center justify-center">
              <img src={formData.logoPreview} alt="Logo preview" className="w-40 h-40 rounded-xl object-cover shadow-lg" />
            </div>
          )}
        </div>
        {errors.logo && <p className="text-red-500 text-sm mt-2">{errors.logo}</p>}
      </div>

      {/* Bannière */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
          Bannière de boutique *
          <Info size={16} className="text-blue-500 cursor-help" title="Image d'en-tête (1200x400)" />
        </label>
        <div className="space-y-4">
          <div
            onClick={() => fileBannerRef.current?.click()}
            className={`border-3 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              errors.banner ? 'border-red-500 bg-red-50' : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50'
            }`}
          >
            <Upload className="w-12 h-12 mx-auto text-blue-500 mb-3" />
            <p className="font-semibold text-gray-800">Cliquez pour télécharger</p>
            <p className="text-xs text-gray-500">JPG, PNG ou WebP (max 2MB, 1200x400 recommandé)</p>
            <input
              ref={fileBannerRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleFileUpload(e, 'banner')}
              hidden
            />
          </div>
          {formData.bannerPreview && (
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img src={formData.bannerPreview} alt="Banner preview" className="w-full h-48 object-cover" />
            </div>
          )}
        </div>
        {errors.banner && <p className="text-red-500 text-sm mt-2">{errors.banner}</p>}
      </div>

      {/* Réseaux sociaux */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-4">Réseaux sociaux (optionnels)</label>
        <div className="space-y-3">
          <input type="text" placeholder="Facebook" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all" />
          <input type="text" placeholder="Instagram" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all" />
          <input type="text" placeholder="TikTok" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all" />
          <input type="text" placeholder="Site web" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all" />
        </div>
      </div>
    </div>
  );
}

// Composant Étape 3
function StepThree({ formData }) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Récapitulatif</h2>

      <div className="space-y-6">
        {/* Logo + Bannière */}
        <div className="space-y-4">
          {formData.logoPreview && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Logo</p>
              <img src={formData.logoPreview} alt="Logo" className="w-24 h-24 rounded-lg object-cover" />
            </div>
          )}
          {formData.bannerPreview && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Bannière</p>
              <img src={formData.bannerPreview} alt="Banner" className="w-full h-32 rounded-lg object-cover" />
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-3">
          <p><span className="font-semibold text-gray-700">Nom :</span> {formData.shopName}</p>
          <p><span className="font-semibold text-gray-700">URL :</span> doshopping.com/boutique/{formData.shopSlug}</p>
          {formData.tagline && <p><span className="font-semibold text-gray-700">Slogan :</span> {formData.tagline}</p>}
          <p><span className="font-semibold text-gray-700">Catégories :</span> {formData.category.join(', ')}</p>
          <p><span className="font-semibold text-gray-700">Description :</span> {formData.description}</p>
          <p><span className="font-semibold text-gray-700">Adresse :</span> {formData.address}</p>
          <p><span className="font-semibold text-gray-700">Téléphone :</span> {formData.phone}</p>
          <p><span className="font-semibold text-gray-700">Email :</span> {formData.email}</p>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-600 rounded p-4">
          <p className="text-sm text-gray-700">
            ✓ En cliquant sur "Créer ma boutique", vous acceptez nos conditions et vous pourrez commencer à vendre immédiatement.
          </p>
        </div>
      </div>
    </div>
  );
}
