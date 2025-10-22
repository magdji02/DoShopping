import { Link } from 'react-router-dom';
import { StarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { SHOPS } from '../utils/shops';

export default function ShopsCarousel() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Boutiques vedettes</h2>
          <p className="text-xl text-gray-600">Découvrez nos meilleures boutiques et vendeurs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {SHOPS.map(shop => (
            <Link
              key={shop.id}
              to={`/shop/${shop.id}`}
              className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all transform hover:scale-105 overflow-hidden cursor-pointer"
            >
              {/* Shop Banner */}
              <div className="relative h-32 overflow-hidden bg-gray-200">
                <img
                  src={shop.banner}
                  alt={shop.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </div>

              {/* Logo */}
              <div className="px-4 -mt-8 relative z-10 flex justify-center">
                <img
                  src={shop.logo}
                  alt={shop.name}
                  className="w-20 h-20 rounded-xl object-cover border-4 border-white shadow-lg"
                />
              </div>

              {/* Info */}
              <div className="p-4 text-center space-y-2">
                <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{shop.name}</h3>
                <p className="text-xs text-blue-600 font-semibold line-clamp-1">{shop.tagline}</p>
                <p className="text-xs text-gray-500">{shop.category}</p>

                {/* Stats */}
                <div className="flex items-center justify-center gap-3 pt-2 border-t border-gray-200 mt-3">
                  <div className="flex items-center gap-1">
                    <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-xs font-bold">{shop.rating}</span>
                  </div>
                  <div className="text-xs text-gray-600">{shop.reviews} avis</div>
                </div>

                {/* Followers */}
                <div className="flex items-center justify-center gap-1 text-xs text-gray-600">
                  <UserGroupIcon className="w-3 h-3" />
                  <span>{(shop.followers / 1000).toFixed(1)}k followers</span>
                </div>

                {/* Products Count */}
                <div className="pt-2 border-t border-gray-200 mt-2">
                  <p className="text-xs text-blue-600 font-semibold">{shop.products.length} produits</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* All Shops Link */}
        <div className="text-center mt-12">
          <Link
            to="/shops"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
          >
            Voir toutes les boutiques →
          </Link>
        </div>
      </div>
    </section>
  );
}
