import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, UserGroupIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { SHOPS } from '../utils/shops';

export default function Shops() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  // Extraire toutes les catégories uniques
  const categories = useMemo(() => {
    return ['', ...new Set(SHOPS.map(s => s.category))];
  }, []);

  // Filtrer et trier les boutiques
  const filteredShops = useMemo(() => {
    let filtered = SHOPS.filter(shop => {
      const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           shop.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || shop.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Tri
    if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'followers') {
      filtered.sort((a, b) => b.followers - a.followers);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [searchTerm, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-3">Boutiques</h1>
          <p className="text-blue-100 text-lg">Explorez nos boutiques partenaires et trouvez vos favoris</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une boutique..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Catégorie</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.slice(1).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Trier par</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
                >
                  <option value="rating">Meilleures évaluations ⭐</option>
                  <option value="followers">Plus d'abonnés</option>
                  <option value="name">Nom (A-Z)</option>
                </select>
              </div>

              {/* Results Count */}
              <div className="flex items-end">
                <p className="text-gray-600 font-semibold">
                  {filteredShops.length} boutique{filteredShops.length > 1 ? 's' : ''} trouvée{filteredShops.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shops Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {filteredShops.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-2xl font-bold text-gray-900 mb-3">Aucune boutique trouvée</p>
            <p className="text-gray-600 mb-6">Essayez de modifier votre recherche ou vos filtres</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredShops.map(shop => (
              <Link
                key={shop.id}
                to={`/shop/${shop.id}`}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all transform hover:scale-105 overflow-hidden"
              >
                {/* Shop Banner */}
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <img
                    src={shop.banner}
                    alt={shop.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>

                {/* Logo */}
                <div className="px-6 -mt-12 relative z-10 flex justify-center mb-4">
                  <img
                    src={shop.logo}
                    alt={shop.name}
                    className="w-24 h-24 rounded-xl object-cover border-4 border-white shadow-lg"
                  />
                </div>

                {/* Info */}
                <div className="px-6 pb-6 space-y-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{shop.name}</h3>
                    <p className="text-sm text-blue-600 font-semibold">{shop.tagline}</p>
                    <p className="text-xs text-gray-500 mt-1">{shop.category}</p>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2">{shop.description}</p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-200">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-bold">{shop.rating}</span>
                      </div>
                      <p className="text-xs text-gray-600">{shop.reviews} avis</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <UserGroupIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="text-xs text-gray-600 font-semibold">{(shop.followers / 1000).toFixed(1)}k</p>
                    </div>
                    <div className="text-center">
                      <div className="font-bold mb-1">{shop.products.length}</div>
                      <p className="text-xs text-gray-600">produits</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105">
                    Visiter la boutique →
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Vous voulez vendre sur Do Shopping?</h2>
          <p className="text-xl text-blue-100 mb-8">Rejoignez nos boutiques partenaires et commencez à générer des revenus dès maintenant.</p>
          <Link
            to="/create-shop"
            className="inline-block bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
          >
            Créer ma boutique 📦
          </Link>
        </div>
      </div>
    </div>
  );
}
