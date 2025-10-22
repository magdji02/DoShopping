import { useParams, Link } from 'react-router-dom';
import { ShoppingCartIcon, StarIcon, UserGroupIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { SHOPS } from '../utils/shops';
import { formatCFA } from '../utils/currency';

export default function ShopDetail() {
  const { id } = useParams();
  const shop = SHOPS.find(s => s.id === parseInt(id));

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Boutique non trouvée</h1>
          <Link to="/" className="text-blue-600 hover:underline">Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={shop.banner}
          alt={shop.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      {/* Shop Info */}
      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10 mb-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          {/* Logo */}
          <div className="md:col-span-1 flex justify-center md:justify-start">
            <img
              src={shop.logo}
              alt={shop.name}
              className="w-32 h-32 rounded-2xl object-cover shadow-lg border-4 border-blue-600"
            />
          </div>

          {/* Info */}
          <div className="md:col-span-3 space-y-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{shop.name}</h1>
              <p className="text-xl text-blue-600 font-semibold mt-1">{shop.tagline}</p>
              <p className="text-gray-600 text-sm mt-2">{shop.category}</p>
            </div>

            <p className="text-gray-700 leading-relaxed">{shop.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-bold text-lg">{shop.rating}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{shop.reviews} avis</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{shop.followers.toLocaleString('fr-FR')}</div>
                <p className="text-xs text-gray-600 mt-1">Abonnés</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{shop.products.length}</div>
                <p className="text-xs text-gray-600 mt-1">Produits</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                <UserGroupIcon className="w-5 h-5" />
                S'abonner
              </button>
              <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 px-4 rounded-lg transition-all">
                <ChatBubbleLeftIcon className="w-5 h-5 mx-auto" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Produits de {shop.name}</h2>
          <p className="text-gray-600">Découvrez notre sélection de {shop.products.length} produits</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shop.products.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 overflow-hidden">
              {/* Product Image */}
              <div className="relative h-48 overflow-hidden bg-gray-200">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.stock < 10 && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Stock faible
                  </div>
                )}
                {product.rating && (
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                    <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-bold">{product.rating}</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">{product.name}</h3>

                {/* Price */}
                <div className="mb-3">
                  <p className="text-2xl font-bold text-blue-600">{formatCFA(product.price)}</p>
                  <p className="text-xs text-gray-500 mt-1">{product.stock} en stock</p>
                </div>

                {/* Reviews */}
                {product.reviews && (
                  <p className="text-xs text-gray-600 mb-3">({product.reviews} avis)</p>
                )}

                {/* Add to Cart */}
                <button
                  disabled={product.stock === 0}
                  className={`w-full py-2 px-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    product.stock === 0
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 transform'
                  }`}
                >
                  <ShoppingCartIcon className="w-4 h-4" />
                  Ajouter au panier
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
