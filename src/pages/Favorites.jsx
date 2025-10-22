import { Link } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/solid';
import { useFavorites } from '../context/FavoritesContext';
import { PRODUCTS } from '../utils/constants';
import { SHOPS } from '../utils/shops';
import ProductCard from '../components/ProductCard';

export default function Favorites() {
  const { favorites } = useFavorites();

  // Récupérer les produits favoris
  const favoriteProducts = PRODUCTS.filter(p => favorites.includes(p.id));

  // Récupérer les produits des boutiques favorites
  const allShopProducts = SHOPS.flatMap(shop =>
    shop.products.map(p => ({ ...p, shopId: shop.id, shopName: shop.name }))
  );
  const favoriteShopProducts = allShopProducts.filter(p => favorites.includes(`shop-${p.id}`));

  const totalFavorites = favoriteProducts.length + favoriteShopProducts.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-3">
            <HeartIcon className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Mes favoris</h1>
          </div>
          <p className="text-red-100 text-lg">{totalFavorites} produit{totalFavorites !== 1 ? 's' : ''} en attente</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {totalFavorites === 0 ? (
          <div className="text-center py-16">
            <HeartIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Aucun favori pour le moment</h2>
            <p className="text-gray-600 mb-8">Ajoutez des produits à vos favoris en cliquant sur le cœur!</p>
            <Link
              to="/products"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all"
            >
              Continuer vos achats →
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Produits du catalogue */}
            {favoriteProducts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Produits ({favoriteProducts.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {favoriteProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}

            {/* Produits des boutiques */}
            {favoriteShopProducts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Produits de boutiques ({favoriteShopProducts.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {favoriteShopProducts.map(product => (
                    <div key={`${product.shopId}-${product.id}`} className="card overflow-hidden group">
                      <div className="aspect-square overflow-hidden relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-2 right-2 bg-gold text-softblack text-xs font-semibold px-2 py-1 rounded-full">
                          ⭐ {product.rating}
                        </div>
                        <Link
                          to={`/shop/${product.shopId}`}
                          className="absolute bottom-2 left-2 bg-white/90 hover:bg-white px-3 py-1 rounded-full text-xs font-semibold text-blue-600 transition-all"
                        >
                          {product.shopName}
                        </Link>
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="font-medium line-clamp-1 text-sm">{product.name}</h3>
                        <p className="text-blue-600 font-bold text-lg">
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'XOF',
                            maximumFractionDigits: 0,
                          }).format(product.price)}
                        </p>
                        <p className="text-xs text-gray-500">{product.reviews} avis</p>
                        <div className="flex gap-2 pt-2">
                          <Link
                            to={`/shop/${product.shopId}`}
                            className="btn-primary flex-1 text-xs"
                          >
                            Voir la boutique
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CTA */}
      {totalFavorites > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-t border-red-200 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Prêt à acheter?</h3>
            <Link
              to="/products"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
            >
              Continuer vos achats 🛍️
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
