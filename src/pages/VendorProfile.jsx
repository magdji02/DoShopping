import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSubscriptions } from '../context/SubscriptionsContext'
import { useStats } from '../context/StatsContext'
import { useToast } from '../components/Toast'
import { Heart, MapPin, Mail, Users, ShoppingBag, Star, Bell } from 'lucide-react'

// Données simulées des vendeurs
const vendorsData = {
  s1: {
    id: 's1',
    name: 'Fashion Store',
    owner: 'Ahmed Ali',
    email: 'ahmed@store.com',
    phone: '+212 6XX XXX XXX',
    location: 'Casablanca, Maroc',
    description: 'Boutique de vêtements modernes et tendances. Qualité garantie avec livraison rapide.',
    joinDate: 'Janvier 2024',
    avatar: '👔',
    rating: 4.8,
    reviewCount: 245,
    products: 25,
    subscribers: 1250,
    verified: true,
    badges: ['Fiable', 'Livraison rapide', 'Qualité garantie']
  },
  s2: {
    id: 's2',
    name: 'Tech World',
    owner: 'Mariam Ben',
    email: 'mariam@tech.com',
    phone: '+212 6XX XXX XXX',
    location: 'Rabat, Maroc',
    description: 'Électronique et gadgets dernière génération. Produits originaux avec garantie.',
    joinDate: 'Février 2024',
    avatar: '💻',
    rating: 4.9,
    reviewCount: 189,
    products: 15,
    subscribers: 890,
    verified: true,
    badges: ['Expert', 'Prix compétitifs', 'SAV excellent']
  },
  s3: {
    id: 's3',
    name: 'Home Decor',
    owner: 'Karim Sidi',
    email: 'karim@home.com',
    phone: '+212 6XX XXX XXX',
    location: 'Fès, Maroc',
    description: 'Décoration intérieure de qualité premium. Créez votre maison idéale avec nos collections.',
    joinDate: 'Janvier 2024',
    avatar: '🏠',
    rating: 4.7,
    reviewCount: 156,
    products: 30,
    subscribers: 756,
    verified: true,
    badges: ['Créatif', 'Large sélection', 'Conseils personnalisés']
  }
}

// Produits simulés par vendeur
const vendorProducts = {
  s1: [
    { id: '1', name: 'T-shirt Premium', price: 299, image: '👕', rating: 4.8 },
    { id: '2', name: 'Jeans Classe', price: 599, image: '👖', rating: 4.9 },
    { id: '3', name: 'Chemise Élégante', price: 449, image: '👔', rating: 4.7 },
    { id: '4', name: 'Veste Tendance', price: 799, image: '🧥', rating: 4.8 }
  ],
  s2: [
    { id: '1', name: 'Écouteurs Sans fil', price: 599, image: '🎧', rating: 4.9 },
    { id: '2', name: 'Montre Connectée', price: 1299, image: '⌚', rating: 4.8 },
    { id: '3', name: 'Chargeur Rapide', price: 199, image: '🔌', rating: 4.7 },
    { id: '4', name: 'Câble USB-C', price: 79, image: '🔗', rating: 4.9 }
  ],
  s3: [
    { id: '1', name: 'Lampe Moderne', price: 399, image: '💡', rating: 4.8 },
    { id: '2', name: 'Miroir Doré', price: 599, image: '🪞', rating: 4.7 },
    { id: '3', name: 'Tapis Persan', price: 1299, image: '🧵', rating: 4.9 },
    { id: '4', name: 'Plantes Artificielles', price: 149, image: '🌿', rating: 4.8 }
  ]
}

export default function VendorProfile() {
  const { id } = useParams()
  const { user } = useAuth()
  const { subscribe, unsubscribe, isSubscribed } = useSubscriptions()
  const { recordShopVisit, getShopVisitCount } = useStats()
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState('products')

  // Track visit when component mounts
  useEffect(() => {
    recordShopVisit(id)
  }, [id, recordShopVisit])

  const vendor = vendorsData[id]
  const products = vendorProducts[id] || []
  const isUserSubscribed = user ? isSubscribed(user.id, id) : false
  const visitCount = getShopVisitCount(id)

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-dark mb-4">404</h1>
          <p className="text-gray-600 mb-6">Boutique non trouvée</p>
          <Link to="/shops" className="px-6 py-2 bg-royal text-white rounded-lg hover:bg-royal/90">
            Retour aux boutiques
          </Link>
        </div>
      </div>
    )
  }

  const handleSubscribe = () => {
    if (!user) {
      addToast('⚠️ Veuillez vous connecter d\'abord', 'warning')
      return
    }

    if (isUserSubscribed) {
      unsubscribe(user.id, id)
      addToast(`✅ Vous êtes désabonné de ${vendor.name}`, 'info')
    } else {
      subscribe(user.id, id)
      addToast(`🔔 Vous êtes abonné à ${vendor.name}!`, 'success')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec bannière */}
      <div className="bg-gradient-to-r from-royal to-royal/80 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-6 mb-6">
            <div className="text-6xl">{vendor.avatar}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-4xl font-bold">{vendor.name}</h1>
                {vendor.verified && <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-semibold">✓ Vérifié</span>}
              </div>
              <p className="text-royal-light mb-2">par {vendor.owner}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star size={18} className="fill-current" />
                  <span className="font-semibold">{vendor.rating}</span>
                  <span className="text-royal-light">({vendor.reviewCount} avis)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={18} />
                  <span>{vendor.subscribers.toLocaleString('fr-FR')} abonnés</span>
                </div>
                <div className="flex items-center gap-1 text-gold">
                  <span>👁️</span>
                  <span>{visitCount.toLocaleString('fr-FR')} visites</span>
                </div>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex gap-2 flex-wrap mb-6">
            {vendor.badges.map(badge => (
              <span key={badge} className="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-semibold">
                {badge}
              </span>
            ))}
          </div>

          {/* Bouton d'abonnement */}
          <div className="flex gap-2">
            <button
              onClick={handleSubscribe}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                isUserSubscribed
                  ? 'bg-white text-royal hover:bg-gray-100'
                  : 'bg-gold text-dark hover:bg-gold/90'
              }`}
            >
              <Bell size={20} />
              {isUserSubscribed ? 'Vous êtes abonné' : 'S\'abonner'}
            </button>
            <Link
              to={`/shop/${id}`}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-white/20 text-white hover:bg-white/30 transition"
            >
              <ShoppingBag size={20} />
              Voir la boutique
            </Link>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Panneau d'information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold text-dark mb-6">À propos</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Description</p>
                  <p className="text-gray-700">{vendor.description}</p>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-gray-700 mb-3">
                    <MapPin size={18} className="text-royal" />
                    <span>{vendor.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 mb-3">
                    <Mail size={18} className="text-royal" />
                    <span>{vendor.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="text-lg">📞</span>
                    <span>{vendor.phone}</span>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Produits</span>
                    <span className="font-bold text-royal">{vendor.products}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Membre depuis</span>
                    <span className="font-semibold">{vendor.joinDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Abonnés</span>
                    <span className="font-bold text-royal">{vendor.subscribers.toLocaleString('fr-FR')}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-700">
                      ℹ️ Soyez notifié des nouveaux produits en vous abonnant à cette boutique.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Produits */}
          <div className="lg:col-span-2">
            {/* Onglets */}
            <div className="flex gap-4 mb-8 border-b">
              {[
                { id: 'products', label: '🛍️ Produits', count: products.length },
                { id: 'reviews', label: '⭐ Avis', count: vendor.reviewCount }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 font-semibold transition border-b-2 ${
                    activeTab === tab.id
                      ? 'border-royal text-royal'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 text-sm text-gray-500">({tab.count})</span>
                </button>
              ))}
            </div>

            {activeTab === 'products' && (
              <div>
                <div className="grid md:grid-cols-2 gap-6">
                  {products.map(product => (
                    <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                      <div className="text-6xl bg-gray-100 h-40 flex items-center justify-center">
                        {product.image}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-dark mb-2">{product.name}</h3>
                        <div className="flex items-center justify-between">
                          <p className="text-xl font-bold text-royal">{product.price} CFA</p>
                          <div className="flex items-center gap-1">
                            <Star size={16} className="fill-gold text-gold" />
                            <span className="text-sm font-semibold">{product.rating}</span>
                          </div>
                        </div>
                        <button className="w-full mt-3 px-4 py-2 bg-royal text-white rounded-lg hover:bg-royal/90 font-semibold transition">
                          Voir le produit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="bg-white rounded-lg shadow p-8">
                <div className="text-center">
                  <Star size={48} className="mx-auto mb-4 text-gold fill-gold" />
                  <h3 className="text-xl font-bold text-dark mb-2">Moyenne: {vendor.rating}/5</h3>
                  <p className="text-gray-600">Basée sur {vendor.reviewCount} avis clients</p>
                  
                  <div className="mt-8 space-y-3 text-left">
                    {[
                      { stars: 5, percent: 65 },
                      { stars: 4, percent: 25 },
                      { stars: 3, percent: 8 },
                      { stars: 2, percent: 1 },
                      { stars: 1, percent: 1 }
                    ].map(rating => (
                      <div key={rating.stars} className="flex items-center gap-3">
                        <span className="text-sm font-semibold w-8">{rating.stars}⭐</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gold" style={{ width: `${rating.percent}%` }} />
                        </div>
                        <span className="text-sm text-gray-600 w-8">{rating.percent}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
