import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EnvelopeIcon, LockClosedIcon, UserIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function Auth() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { push } = useToast();

  const [mode, setMode] = useState('login'); // 'login' | 'signup-client' | 'signup-vendor'
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email requis';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Min 6 caractères';
    }

    if (mode !== 'login') {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Nom requis';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }

      if (!formData.agreeTerms) {
        newErrors.agreeTerms = 'Accepter les conditions est obligatoire';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    // Simulation API
    setTimeout(() => {
      login({
        email: formData.email,
        name: formData.fullName || formData.email.split('@')[0],
        role: 'customer',
      });
      push('success', `Bienvenue, ${formData.email}! 🎉`);
      navigate('/');
      setLoading(false);
    }, 1000);
  };

  const handleSignupClient = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    // Simulation API
    setTimeout(() => {
      login({
        email: formData.email,
        name: formData.fullName,
        role: 'customer',
      });
      push('success', `Compte créé! Bienvenue ${formData.fullName}! 🎉`);
      navigate('/');
      setLoading(false);
    }, 1000);
  };

  const handleSignupVendor = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    // Simulation API
    setTimeout(() => {
      login({
        email: formData.email,
        name: formData.fullName,
        role: 'vendor',
        shopId: `shop_${Date.now()}`,
      });
      push('success', `Bienvenue vendeur ${formData.fullName}! 🚀`);
      navigate('/create-shop');
      setLoading(false);
    }, 1000);
  };

  const handleAdminAccess = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login({
        email: 'admin@doshop.com',
        name: 'Admin SuperUser',
        role: 'admin',
      });
      push('success', 'Connexion Admin réussie! 📊');
      navigate('/dashboard/admin');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Do Shopping</h1>
          <p className="text-gray-600">
            {mode === 'login'
              ? 'Se connecter'
              : mode === 'signup-client'
              ? 'Créer un compte client'
              : 'Créer un compte vendeur'}
          </p>
        </div>

        {/* Mode Selection Tabs */}
        {mode !== 'login' && (
          <button
            onClick={() => {
              setMode('login');
              setFormData({ email: '', password: '', confirmPassword: '', fullName: '', agreeTerms: false });
              setErrors({});
            }}
            className="w-full text-center text-blue-600 hover:text-blue-700 font-semibold mb-6 pb-4 border-b-2 border-blue-200"
          >
            ← Retour à la connexion
          </button>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Mode Buttons (visible only on login page) */}
          {mode === 'login' && (
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => {
                  setMode('signup-client');
                  setFormData({ email: '', password: '', confirmPassword: '', fullName: '', agreeTerms: false });
                  setErrors({});
                }}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <UserIcon className="w-8 h-8 text-blue-600" />
                <span className="text-sm font-semibold text-gray-900">Acheteur</span>
                <span className="text-xs text-gray-500">Créer un compte</span>
              </button>

              <button
                onClick={() => {
                  setMode('signup-vendor');
                  setFormData({ email: '', password: '', confirmPassword: '', fullName: '', agreeTerms: false });
                  setErrors({});
                }}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all"
              >
                <ShoppingBagIcon className="w-8 h-8 text-green-600" />
                <span className="text-sm font-semibold text-gray-900">Vendeur</span>
                <span className="text-xs text-gray-500">Vendre aussi</span>
              </button>
            </div>
          )}

          {/* Admin Quick Access (demo only) */}
          {mode === 'login' && (
            <button
              onClick={handleAdminAccess}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 font-semibold transition-all mb-6"
            >
              <span>📊</span> Accès Admin (Démo)
            </button>
          )}

          {/* Existing Users */}
          {mode === 'login' && (
            <button
              onClick={() => {
                setFormData({
                  email: 'user@example.com',
                  password: '123456',
                  confirmPassword: '',
                  fullName: '',
                  agreeTerms: false,
                });
                setErrors({});
              }}
              className="w-full text-center text-xs text-gray-500 hover:text-gray-700 transition-all"
            >
              👤 Demo: user@example.com / 123456
            </button>
          )}

          {/* Forms */}
          {(mode === 'login' || mode === 'signup-client' || mode === 'signup-vendor') && (
            <form
              onSubmit={
                mode === 'login'
                  ? handleLogin
                  : mode === 'signup-client'
                  ? handleSignupClient
                  : handleSignupVendor
              }
              className="space-y-4"
            >
              {/* Full Name (signup only) */}
              {mode !== 'login' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Nom complet
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Jean Dupont"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:outline-none transition-all ${
                        errors.fullName
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Adresse email
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="vous@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:outline-none transition-all ${
                      errors.email
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 focus:border-blue-500'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Mot de passe
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:outline-none transition-all ${
                      errors.password
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 focus:border-blue-500'
                    }`}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password (signup only) */}
              {mode !== 'login' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:outline-none transition-all ${
                        errors.confirmPassword
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Remember Me (login only) */}
              {mode === 'login' && (
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" className="rounded" />
                  Se souvenir de moi
                </label>
              )}

              {/* Terms (signup only) */}
              {mode !== 'login' && (
                <label className="flex items-start gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="rounded mt-1"
                  />
                  <span>
                    J'accepte les{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                      conditions d'utilisation
                    </a>{' '}
                    et la{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                      politique de confidentialité
                    </a>
                  </span>
                </label>
              )}
              {errors.agreeTerms && (
                <p className="text-red-500 text-sm">{errors.agreeTerms}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-bold transition-all transform hover:scale-105 ${
                  mode === 'login'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : mode === 'signup-client'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Chargement...
                  </span>
                ) : mode === 'login' ? (
                  'Se connecter'
                ) : mode === 'signup-client' ? (
                  'Créer un compte client'
                ) : (
                  'Devenir vendeur'
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-600">ou</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-2 px-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
              <span className="text-xl">f</span>
              <span className="text-sm font-semibold">Facebook</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-2 px-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
              <span className="text-xl">G</span>
              <span className="text-sm font-semibold">Google</span>
            </button>
          </div>

          {/* Footer Links */}
          <div className="text-center space-y-2 text-sm text-gray-600">
            {mode === 'login' ? (
              <>
                <p>
                  Pas encore de compte?{' '}
                  <button
                    onClick={() => {
                      setMode('signup-client');
                      setFormData({ email: '', password: '', confirmPassword: '', fullName: '', agreeTerms: false });
                      setErrors({});
                    }}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    S'inscrire
                  </button>
                </p>
                <a href="#" className="block text-blue-600 hover:underline">
                  Mot de passe oublié?
                </a>
              </>
            ) : (
              <p>
                Vous avez déjà un compte?{' '}
                <button
                  onClick={() => {
                    setMode('login');
                    setFormData({ email: '', password: '', confirmPassword: '', fullName: '', agreeTerms: false });
                    setErrors({});
                  }}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Se connecter
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4">
          <h3 className="font-bold text-gray-900 mb-2">💡 Info utile</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>✓ Achetez auprès de nos 5+ boutiques</li>
            <li>✓ Créez votre propre boutique en 5 min</li>
            <li>✓ Paiement sécurisé avec CFA</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
