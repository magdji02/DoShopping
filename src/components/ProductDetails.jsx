import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrdersContext'
import { useToast } from './Toast'
import { formatCFA } from '../utils/api'
import { SELLERS } from '../utils/constants'

export default function ProductDetails({ product }){
  const [qty, setQty] = useState(1)
  const { addItem, clear, items, subtotal } = useCart()
  const { user } = useAuth()
  const { createOrder } = useOrders()
  const { push } = useToast()
  const navigate = useNavigate()
  const seller = SELLERS.find(s => s.id === product.sellerId)

  const addToCart = () => {
    addItem(product, qty)
    push('success', `${qty} article(s) ajouté(s) au panier.`)
    setQty(1)
  }

  const buyNow = () => {
    if (!user) {
      push('error', 'Veuillez vous connecter pour passer une commande.')
      navigate('/auth')
      return
    }

    // Ajouter le produit au panier
    addItem(product, qty)
    
    // Créer une commande immédiatement
    try {
      const newItems = [...items, { ...product, qty }]
      const totalAmount = newItems.reduce((sum, item) => sum + item.price * item.qty, 0)
      
      const order = createOrder(newItems, totalAmount, 'Adresse à confirmer')
      push('success', 'Commande créée avec succès!')
      
      // Rediriger vers la facture
      navigate('/invoice', { state: { orderId: order.id } })
      
      // Vider le panier
      clear()
    } catch (error) {
      push('error', error.message)
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Galerie */}
      <div className="space-y-4">
        <div className="card overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full aspect-square object-cover"/>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[product.image, product.image, product.image, product.image].map((img, i) => (
            <button key={i} className="card p-1 hover:border-2 hover:border-royal">
              <img src={img} alt="" className="w-full aspect-square object-cover rounded"/>
            </button>
          ))}
        </div>
      </div>

      {/* Détails */}
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold mb-2">{product.name}</h1>
          <p className="text-lg text-royal font-semibold">{formatCFA(product.price)}</p>
          <p className="text-sm text-gray-600 mt-1">Stock: {product.stock} articles</p>
        </div>

        <div className="card p-4">
          <h3 className="font-semibold mb-2">Vendeur</h3>
          <div className="flex items-center gap-2">
            <img src={seller?.avatar} alt={seller?.name} className="w-10 h-10 rounded-full"/>
            <div>
              <p className="font-medium">{seller?.name}</p>
              <p className="text-xs text-gray-500">⭐ {seller?.rating}</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-gray-700 mb-4">{product.description}</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <span className="font-medium">Quantité:</span>
            <div className="flex items-center gap-2 border rounded-lg">
              <button className="px-3 py-2 hover:bg-gray-100" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span className="px-4">{qty}</span>
              <button className="px-3 py-2 hover:bg-gray-100" onClick={() => setQty(qty + 1)}>+</button>
            </div>
          </div>
          <button onClick={addToCart} className="btn-accent w-full">Ajouter au panier</button>
          <button onClick={buyNow} className={`btn-primary w-full border ${user ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' : 'bg-gray-300 text-gray-600 border-gray-300 cursor-not-allowed'}`}>
            {user ? '🛒 Acheter maintenant' : '🔒 Connectez-vous pour acheter'}
          </button>
        </div>

        <div className="card p-4 bg-mint/10 border-l-4 border-mint">
          <p className="text-sm"><strong>✓ Livraison gratuite</strong> pour cette commande</p>
          <p className="text-sm text-gray-600 mt-1">Paiement sécurisé · Produit authentique</p>
        </div>

        <button className="w-full py-2 px-4 rounded-xl border border-gray-200 hover:bg-gray-50">Contacter le vendeur</button>
      </div>
    </div>
  )
}
