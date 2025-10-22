import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Package, BarChart3, MessageSquare, Settings, Plus, Share2, Trash2, ExternalLink, Copy, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useStats } from '../context/StatsContext'

export default function DashboardSeller(){
  const { user } = useAuth()
  const { getShopVisitCount } = useStats()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [products, setProducts] = useState([
    { id: 1, name: 'Téléphone XYZ', price: 150000, image: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=300&fit=crop', stock: 12, sales: 45, status: 'active' },
    { id: 2, name: 'Écouteurs Premium', price: 35000, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&fit=crop', stock: 28, sales: 123, status: 'active' },
    { id: 3, name: 'Chargeur rapide', price: 15000, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&fit=crop', stock: 5, sales: 89, status: 'active' },
  ])
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', image: '' })
  const [copyied, setCopyied] = useState(null)

  // Get visit count for current vendor
  const shopId = user?.shopId || 's1' // Default to s1 for demo
  const visitCount = getShopVisitCount(shopId)

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopyied(id)
    setTimeout(() => setCopyied(null), 2000)
  }

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) return
    const product = {
      id: Math.max(...products.map(p => p.id), 0) + 1,
      ...newProduct,
      price: parseInt(newProduct.price),
      stock: parseInt(newProduct.stock),
      sales: 0,
      status: 'active',
      image: newProduct.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&fit=crop'
    }
    setProducts([...products, product])
    setNewProduct({ name: '', price: '', stock: '', image: '' })
    setShowAddProduct(false)
  }

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Tableau de bord vendeur</h1>
          <p className="text-blue-100">Bienvenue, {user?.name || 'Vendeur'} 👋</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[240px_1fr] gap-6">
          {/* Sidebar Navigation */}
          <aside className="card p-4 h-fit sticky top-24">
            <nav className="grid gap-2 text-sm">
              <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${activeTab === 'dashboard' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'}`}>
                <BarChart3 size={16} /> Tableau de bord
              </button>
              <button onClick={() => setActiveTab('products')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${activeTab === 'products' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'}`}>
                <Package size={16} /> Mes produits
              </button>
              <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${activeTab === 'orders' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'}`}>
                <ShoppingBag size={16} /> Commandes
              </button>
              <button onClick={() => setActiveTab('messages')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${activeTab === 'messages' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'}`}>
                <MessageSquare size={16} /> Messages
              </button>
              <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${activeTab === 'settings' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'}`}>
                <Settings size={16} /> Paramètres
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <section className="space-y-6">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="card p-6 border-l-4 border-blue-500">
                    <p className="text-sm text-gray-500 mb-2">Ventes ce mois</p>
                    <p className="text-3xl font-bold text-gray-900">1,245</p>
                    <p className="text-xs text-green-600 mt-2">+12% par rapport au mois dernier</p>
                  </div>
                  <div className="card p-6 border-l-4 border-green-500">
                    <p className="text-sm text-gray-500 mb-2">Visiteurs uniques</p>
                    <p className="text-3xl font-bold text-gray-900">8,902</p>
                    <p className="text-xs text-green-600 mt-2">+8% par rapport au mois dernier</p>
                  </div>
                  <div className="card p-6 border-l-4 border-gold">
                    <p className="text-sm text-gray-500 mb-2">Visites de boutique 👁️</p>
                    <p className="text-3xl font-bold text-gray-900">{visitCount.toLocaleString('fr-FR')}</p>
                    <p className="text-xs text-gold mt-2">Depuis le lancement</p>
                  </div>
                  <div className="card p-6 border-l-4 border-purple-500">
                    <p className="text-sm text-gray-500 mb-2">Produits actifs</p>
                    <p className="text-3xl font-bold text-gray-900">{products.length}</p>
                    <p className="text-xs text-green-600 mt-2">{products.filter(p => p.stock > 0).length} en stock</p>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="card p-6">
                  <h2 className="font-bold text-lg mb-4">Commandes récentes</h2>
                  <div className="space-y-3">
                    {[
                      { id: '#1001', customer: 'Aminata Sow', amount: 45000, status: 'En attente', date: 'Aujourd\'hui' },
                      { id: '#1000', customer: 'Mohamed Ali', amount: 125000, status: 'En cours', date: 'Hier' },
                      { id: '#999', customer: 'Fatou Diallo', amount: 78000, status: 'Livré', date: 'Il y a 2 jours' },
                    ].map(order => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-900">{order.customer}</p>
                          <p className="text-xs text-gray-500">{order.id} • {order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{order.amount.toLocaleString()} XOF</p>
                          <p className={`text-xs font-semibold ${order.status === 'Livré' ? 'text-green-600' : order.status === 'En cours' ? 'text-blue-600' : 'text-yellow-600'}`}>{order.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Mes produits ({products.length})</h2>
                  <button onClick={() => setShowAddProduct(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all">
                    <Plus size={20} /> Ajouter un produit
                  </button>
                </div>

                {/* Add Product Modal */}
                {showAddProduct && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-2xl w-full animate-fadeIn">
                      <h3 className="text-2xl font-bold mb-6">Ajouter un nouveau produit</h3>
                      <div className="space-y-4">
                        <input type="text" placeholder="Nom du produit" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                        <input type="number" placeholder="Prix (XOF)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                        <input type="number" placeholder="Stock" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                        <input type="text" placeholder="URL image (optionnel)" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                      </div>
                      <div className="flex gap-3 mt-6">
                        <button onClick={() => setShowAddProduct(false)} className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all">Annuler</button>
                        <button onClick={handleAddProduct} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all">Ajouter</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Products Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map(product => (
                    <div key={product.id} className="card overflow-hidden hover:shadow-xl transition-all">
                      <div className="relative overflow-hidden bg-gray-100 h-40">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                        <span className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-bold text-white ${product.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}>
                          {product.status === 'active' ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                          <div className="bg-blue-50 p-2 rounded-lg">
                            <p className="text-gray-600">Prix</p>
                            <p className="font-bold text-blue-600">{product.price.toLocaleString()} XOF</p>
                          </div>
                          <div className="bg-purple-50 p-2 rounded-lg">
                            <p className="text-gray-600">Stock</p>
                            <p className="font-bold text-purple-600">{product.stock} unités</p>
                          </div>
                          <div className="bg-green-50 p-2 rounded-lg col-span-2">
                            <p className="text-gray-600">Ventes</p>
                            <p className="font-bold text-green-600">{product.sales} vendus</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Link to={`/products/${product.id}`} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-semibold text-sm transition-all">
                            <ExternalLink size={16} /> Voir
                          </Link>
                          <button onClick={() => copyToClipboard(`https://doshopping.com/products/${product.id}`, product.id)} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm transition-all">
                            {copyied === product.id ? <><Check size={16} /> Copié!</> : <><Copy size={16} /> Partager</>}
                          </button>
                          <div className="flex gap-2">
                            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-semibold text-sm transition-all">
                              <Share2 size={16} /> WA
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-semibold text-sm transition-all">
                              <Share2 size={16} /> FB
                            </button>
                            <button onClick={() => deleteProduct(product.id)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-semibold text-sm transition-all">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="card p-6">
                <h2 className="text-2xl font-bold mb-6">Vos commandes</h2>
                <div className="space-y-3">
                  {[
                    { id: '#1001', customer: 'Aminata Sow', items: 2, total: 45000, status: 'En attente', date: 'Aujourd\'hui' },
                    { id: '#1000', customer: 'Mohamed Ali', items: 1, total: 125000, status: 'En cours', date: 'Hier' },
                    { id: '#999', customer: 'Fatou Diallo', items: 3, total: 78000, status: 'Livré', date: 'Il y a 2 jours' },
                  ].map(order => (
                    <div key={order.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{order.customer}</p>
                          <p className="text-sm text-gray-600">{order.id} • {order.items} article(s) • {order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{order.total.toLocaleString()} XOF</p>
                          <p className={`text-sm font-semibold ${order.status === 'Livré' ? 'text-green-600' : order.status === 'En cours' ? 'text-blue-600' : 'text-yellow-600'}`}>{order.status}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="card p-6">
                <h2 className="text-2xl font-bold mb-6">Messages</h2>
                <p className="text-gray-600 text-center py-12">Aucun message pour le moment</p>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="card p-6">
                <h2 className="text-2xl font-bold mb-6">Paramètres de la boutique</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nom de la boutique</label>
                    <input type="text" defaultValue="Ma Super Boutique" className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email de contact</label>
                    <input type="email" defaultValue="contact@boutique.com" className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Téléphone</label>
                    <input type="tel" defaultValue="+221 76 123 45 67" className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                  <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all">Enregistrer les modifications</button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
