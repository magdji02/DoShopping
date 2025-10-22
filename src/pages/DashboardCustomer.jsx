import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Heart, Settings, Bell, HelpCircle, LogOut, FileText, Edit } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrdersContext'
import { formatCFA } from '../utils/currency'

export default function DashboardCustomer(){
  const { user, logout } = useAuth()
  const { getUserOrders } = useOrders()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('orders')
  const orders = getUserOrders()

  if (!user) {
    return <div className="max-w-7xl mx-auto px-4 py-8">Veuillez vous connecter.</div>
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Tableau de bord client</h1>
          <p className="text-blue-100">Bienvenue, {user.name} 👋</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[240px_1fr] gap-6">
          {/* Sidebar Navigation */}
          <aside className="card p-4 h-fit sticky top-24">
            <nav className="grid gap-2 text-sm">
              <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${activeTab === 'orders' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'}`}>
                <ShoppingBag size={16} /> Mes commandes
              </button>
              <button onClick={() => setActiveTab('invoices')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${activeTab === 'invoices' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'}`}>
                <FileText size={16} /> Factures
              </button>
              <button onClick={() => setActiveTab('wishlist')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${activeTab === 'wishlist' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'}`}>
                <Heart size={16} /> Souhaits
              </button>
              <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${activeTab === 'settings' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'}`}>
                <Settings size={16} /> Paramètres
              </button>
              <button onClick={() => setActiveTab('notifications')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${activeTab === 'notifications' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'}`}>
                <Bell size={16} /> Notifications
              </button>
              <button onClick={() => setActiveTab('support')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${activeTab === 'support' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'}`}>
                <HelpCircle size={16} /> Support
              </button>
              <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all text-red-600 hover:bg-red-50 mt-4">
                <LogOut size={16} /> Déconnexion
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <section className="space-y-6">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="card p-6">
                <h2 className="text-2xl font-bold mb-6">📦 Mes commandes ({orders.length})</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 mb-4">Vous n'avez pas encore de commande</p>
                    <Link to="/products" className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all">
                      Commencer à acheter
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map(order => (
                      <div key={order.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer" onClick={() => { setActiveTab('invoices') }}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-bold text-lg text-gray-900">{order.id}</p>
                            <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString('fr-FR')} • {order.items.length} article(s)</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-xl text-blue-600">{formatCFA(order.total)}</p>
                            <span className={`inline-block text-xs px-3 py-1 rounded-full font-semibold ${
                              order.status === 'Livré' ? 'bg-green-100 text-green-700' :
                              order.status === 'En cours' ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Invoices Tab */}
            {activeTab === 'invoices' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">📋 Factures</h2>
                  <Link to="/invoice" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all">
                    Voir toutes les factures
                  </Link>
                </div>
                <div className="card p-6">
                  {orders.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Aucune facture disponible</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-gray-200">
                            <th className="text-left py-2 font-semibold">N° Facture</th>
                            <th className="text-left py-2 font-semibold">Date</th>
                            <th className="text-center py-2 font-semibold">Articles</th>
                            <th className="text-right py-2 font-semibold">Montant</th>
                            <th className="text-center py-2 font-semibold">Statut</th>
                            <th className="text-center py-2 font-semibold">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map(order => (
                            <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 font-semibold text-blue-600">{order.id}</td>
                              <td className="py-3">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</td>
                              <td className="py-3 text-center">{order.items.length}</td>
                              <td className="py-3 text-right font-bold">{formatCFA(order.total)}</td>
                              <td className="py-3 text-center">
                                <span className={`inline-block text-xs px-3 py-1 rounded-full font-semibold ${
                                  order.status === 'Livré' ? 'bg-green-100 text-green-700' :
                                  order.status === 'En cours' ? 'bg-blue-100 text-blue-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="py-3 text-center">
                                <Link to="/invoice" state={{ orderId: order.id }} className="text-blue-600 hover:underline font-semibold">
                                  Voir
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="card p-6">
                <h2 className="text-2xl font-bold mb-6">❤️ Ma liste de souhaits</h2>
                <p className="text-gray-500 text-center py-12">Aucun produit dans votre liste de souhaits</p>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="card p-6">
                <h2 className="text-2xl font-bold mb-6">⚙️ Paramètres du compte</h2>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nom complet</label>
                      <input type="text" defaultValue={user.name} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <input type="email" defaultValue={user.email} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Téléphone</label>
                    <input type="tel" placeholder="+221 76 123 45 67" className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Adresse de livraison</label>
                    <input type="text" placeholder="Votre adresse" className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ville/Région</label>
                    <input type="text" placeholder="Dakar" className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                  <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all">
                    <Edit size={16} className="inline mr-2" /> Enregistrer les modifications
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="card p-6">
                <h2 className="text-2xl font-bold mb-6">🔔 Notifications</h2>
                <p className="text-gray-500 text-center py-12">Aucune notification</p>
              </div>
            )}

            {/* Support Tab */}
            {activeTab === 'support' && (
              <div className="card p-6">
                <h2 className="text-2xl font-bold mb-6">❓ Support</h2>
                <div className="space-y-4">
                  <p className="text-gray-600 mb-4">Besoin d'aide? Contactez notre équipe de support</p>
                  <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all">
                    Contacter le support
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
