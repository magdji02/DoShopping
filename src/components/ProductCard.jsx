import { Link } from 'react-router-dom'
import { HeartIcon } from '@heroicons/react/24/solid'
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { useCart } from '../context/CartContext'
import { useFavorites } from '../context/FavoritesContext'
import { useToast } from './Toast'
import { formatCFA } from '../utils/currency'

export default function ProductCard({ product }){
  const { addItem } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { push } = useToast()
  
  const add = () => { 
    addItem(product, 1)
    push('success', 'Produit ajouté au panier.')
  }

  const handleFavorite = () => {
    toggleFavorite(product.id)
    push('success', isFavorite(product.id) ? 'Retiré des favoris' : 'Ajouté aux favoris')
  }

  return (
    <div className="card overflow-hidden group">
      <div className="aspect-square overflow-hidden relative">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy"/>
        <div className="absolute top-2 right-2 bg-gold text-softblack text-xs font-semibold px-2 py-1 rounded-full">⭐ {product.rating}</div>
        <button
          onClick={handleFavorite}
          className="absolute top-2 left-2 bg-white/90 hover:bg-white rounded-full p-2 transition-all transform hover:scale-110"
        >
          {isFavorite(product.id) ? (
            <HeartIcon className="w-5 h-5 text-red-500" />
          ) : (
            <HeartOutline className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-medium line-clamp-1 text-sm">{product.name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-royal font-bold text-lg">{formatCFA(product.price)}</p>
        </div>
        
        {/* Seller Info */}
        {product.seller && (
          <Link 
            to={`/vendor/${product.sellerId}`}
            className="flex items-center gap-2 text-xs text-royal hover:text-royal/80 transition-colors py-1 group/seller"
          >
            <UserCircleIcon className="w-4 h-4" />
            <span className="font-medium group-hover/seller:underline">{product.seller.name}</span>
          </Link>
        )}
        
        <p className="text-xs text-gray-500">{product.reviews} avis</p>
        <div className="flex gap-2 pt-2">
          <Link to={`/products/${product.id}`} className="btn-primary flex-1 text-xs">Voir</Link>
          <button onClick={add} className="btn-accent text-xs">Ajouter</button>
        </div>
      </div>
    </div>
  )
}
