import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrdersContext'
import { formatCFA } from '../utils/currency'
import { Download, Check, TrendingUp, Clock } from 'lucide-react'

export default function Invoice(){
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getUserOrders } = useOrders()
  const [selectedOrder, setSelectedOrder] = useState(null)
  
  const orders = getUserOrders()

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }

    // Si venant de "buy now", sélectionner la dernière commande
    if (location.state?.orderId) {
      const order = orders.find(o => o.id === location.state.orderId)
      if (order) setSelectedOrder(order)
    }
  }, [user, navigate, location.state])

  const handleDownloadInvoice = () => {
    if (!selectedOrder) return
    
    const invoiceContent = `
FACTURE
=========================================
Numéro: ${selectedOrder.id}
Date: ${new Date(selectedOrder.createdAt).toLocaleDateString('fr-FR')}
Cliente: ${selectedOrder.userName}
Email: ${selectedOrder.userEmail}
=========================================

ARTICLES
--------
${selectedOrder.items.map(item => `
${item.name}
  Prix unitaire: ${formatCFA(item.price)}
  Quantité: ${item.qty}
  Sous-total: ${formatCFA(item.price * item.qty)}
`).join('\n')}

--------
Sous-total: ${formatCFA(selectedOrder.subtotal)}
Taxe (5%): ${formatCFA(selectedOrder.tax)}
Frais de port: ${formatCFA(selectedOrder.shippingCost)}
TOTAL: ${formatCFA(selectedOrder.total)}

Adresse de livraison:
${selectedOrder.shippingAddress}

Statut: ${selectedOrder.status}
Livraison estimée: ${new Date(selectedOrder.estimatedDelivery).toLocaleDateString('fr-FR')}
`
    
    const blob = new Blob([invoiceContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `facture-${selectedOrder.id}.txt`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  if (!user) {
    return <div className="max-w-7xl mx-auto px-4 py-8">Veuillez vous connecter.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">📋 Mes Factures</h1>

        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          {/* Sidebar - Liste des commandes */}
          <div className="card p-4 h-fit">
            <h2 className="font-bold text-lg mb-4">Commandes ({orders.length})</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {orders.length === 0 ? (
                <p className="text-gray-500 text-sm">Aucune commande</p>
              ) : (
                orders.map(order => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedOrder?.id === order.id
                        ? 'bg-blue-100 border-l-4 border-blue-600'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <p className="font-semibold text-sm">{order.id}</p>
                    <p className="text-xs text-gray-600">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
                    <p className="text-sm font-bold text-blue-600 mt-1">{formatCFA(order.total)}</p>
                    <span className={`inline-block text-xs px-2 py-1 rounded mt-1 ${
                      order.status === 'Livré' ? 'bg-green-100 text-green-700' :
                      order.status === 'En cours' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Main - Facture détaillée */}
          {selectedOrder ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="card p-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-3xl font-bold">Facture</h2>
                  <button
                    onClick={handleDownloadInvoice}
                    className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all"
                  >
                    <Download size={20} /> Télécharger
                  </button>
                </div>
                <p className="text-blue-100">Numéro: <span className="font-bold text-lg">{selectedOrder.id}</span></p>
              </div>

              {/* Info client */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="card p-6">
                  <h3 className="font-bold mb-3 text-lg">👤 Informations client</h3>
                  <p className="text-gray-600">Nom</p>
                  <p className="font-semibold mb-3">{selectedOrder.userName}</p>
                  <p className="text-gray-600">Email</p>
                  <p className="font-semibold">{selectedOrder.userEmail}</p>
                </div>

                <div className="card p-6">
                  <h3 className="font-bold mb-3 text-lg">📦 Livraison</h3>
                  <p className="text-gray-600">Adresse</p>
                  <p className="font-semibold mb-3">{selectedOrder.shippingAddress}</p>
                  <p className="text-gray-600">Livraison estimée</p>
                  <p className="font-semibold">{new Date(selectedOrder.estimatedDelivery).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>

              {/* Articles */}
              <div className="card p-6">
                <h3 className="font-bold mb-4 text-lg">📋 Articles commandés</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-2 font-semibold">Produit</th>
                        <th className="text-center py-2 font-semibold">Prix unitaire</th>
                        <th className="text-center py-2 font-semibold">Quantité</th>
                        <th className="text-right py-2 font-semibold">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 font-medium">{item.name}</td>
                          <td className="text-center py-3">{formatCFA(item.price)}</td>
                          <td className="text-center py-3">{item.qty}</td>
                          <td className="text-right py-3 font-bold text-blue-600">{formatCFA(item.price * item.qty)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Résumé financier */}
              <div className="grid md:grid-cols-2 gap-6">
                <div></div>
                <div className="card p-6 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span>{formatCFA(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Taxe (5%)</span>
                    <span>{formatCFA(selectedOrder.tax)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Frais de port</span>
                    <span>{formatCFA(selectedOrder.shippingCost)}</span>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-3 flex justify-between text-2xl font-bold text-blue-600">
                    <span>TOTAL</span>
                    <span>{formatCFA(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Statut */}
              <div className={`card p-6 border-l-4 ${
                selectedOrder.status === 'Livré' ? 'bg-green-50 border-green-500' :
                selectedOrder.status === 'En cours' ? 'bg-blue-50 border-blue-500' :
                'bg-yellow-50 border-yellow-500'
              }`}>
                <div className="flex items-center gap-3">
                  {selectedOrder.status === 'Livré' && <Check size={24} className="text-green-600" />}
                  {selectedOrder.status === 'En cours' && <Clock size={24} className="text-blue-600" />}
                  {selectedOrder.status === 'En attente' && <TrendingUp size={24} className="text-yellow-600" />}
                  <div>
                    <p className="font-bold text-lg">Statut: {selectedOrder.status}</p>
                    <p className="text-sm text-gray-600">
                      {selectedOrder.status === 'Livré' && 'Votre commande a été livrée.'}
                      {selectedOrder.status === 'En cours' && 'Votre commande est en cours de traitement.'}
                      {selectedOrder.status === 'En attente' && 'Votre commande en attente de confirmation.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/products')}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition-all"
                >
                  ← Continuer les achats
                </button>
                <button
                  onClick={handleDownloadInvoice}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Download size={20} /> Télécharger facture
                </button>
              </div>
            </div>
          ) : (
            <div className="card p-12 text-center">
              <p className="text-gray-500 text-lg">Sélectionnez une commande pour voir la facture</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
