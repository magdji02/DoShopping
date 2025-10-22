import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useShops } from '../context/ShopsContext'
import { useToast } from '../components/Toast'
import { 
  CheckCircle, XCircle, Lock, Unlock, AlertTriangle, Send, LogOut,
  Eye, Shield, AlertCircle
} from 'lucide-react'

export default function DashboardAdmin() {
  const { user, logout } = useAuth()
  const { validateShop, blockShop, unblockShop, banShop, warnVendor, getPendingShops, getBlockedShops, getBannedShops, getShopWarnings } = useShops()
  const { addToast } = useToast()
  
  const [activeTab, setActiveTab] = useState('pending')
  const [warningForm, setWarningForm] = useState({ shopId: '', message: '', severity: 'warning' })
  const [showWarningModal, setShowWarningModal] = useState(false)

  // Simuler les données des boutiques (dans une vrai app, ça viendrait d'une API)
  const shops = {
    s1: { id: 's1', name: 'Fashion Store', owner: 'Ahmed Ali', email: 'ahmed@store.com', productsCount: 25, joiningDate: '2024-01-15' },
    s2: { id: 's2', name: 'Tech World', owner: 'Mariam Ben', email: 'mariam@tech.com', productsCount: 15, joiningDate: '2024-02-20' },
    s3: { id: 's3', name: 'Home Decor', owner: 'Karim Sidi', email: 'karim@home.com', productsCount: 30, joiningDate: '2024-01-10' },
  }

  const pendingShops = getPendingShops()
  const blockedShops = getBlockedShops()
  const bannedShops = getBannedShops()

  const handleValidate = (shopId) => {
    validateShop(shopId)
    addToast(`✅ Boutique validée avec succès`, 'success')
  }

  const handleBlock = (shopId) => {
    blockShop(shopId, 'Contenu inapproprié détecté')
    addToast(`🚫 Boutique bloquée`, 'warning')
  }

  const handleUnblock = (shopId) => {
    unblockShop(shopId)
    addToast(`✅ Boutique débloquée`, 'success')
  }

  const handleBan = (shopId) => {
    banShop(shopId, 'Violation grave des conditions d\'utilisation')
    addToast(`⛔ Boutique bannie définitivement`, 'error')
  }

  const handleWarn = (shopId) => {
    setWarningForm({ ...warningForm, shopId })
    setShowWarningModal(true)
  }

  const submitWarning = () => {
    if (!warningForm.message.trim()) {
      addToast('⚠️ Veuillez entrer un message', 'warning')
      return
    }
    
    const shop = shops[warningForm.shopId]
    warnVendor(warningForm.shopId, shop?.email, warningForm.message, warningForm.severity)
    addToast(`📨 Avertissement envoyé à ${shop?.owner}`, 'info')
    setShowWarningModal(false)
    setWarningForm({ shopId: '', message: '', severity: 'warning' })
  }

  const renderShopCard = (shopId, status) => {
    const shop = shops[shopId]
    if (!shop) return null

    const warnings = getShopWarnings(shopId)
    const warningCount = warnings.length

    return (
      <div key={shopId} className="bg-white rounded-lg shadow p-6 border-l-4 border-royal">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-dark">{shop.name}</h3>
            <p className="text-sm text-gray-600">Propriétaire: {shop.owner}</p>
            <p className="text-sm text-gray-500">{shop.email}</p>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gold/20 text-gold">
              {shop.productsCount} produits
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm mb-4 pb-4 border-b">
          <p><span className="font-semibold">Adhésion:</span> {shop.joiningDate}</p>
          <p><span className="font-semibold">Status:</span>
            <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${
              status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              status === 'validated' ? 'bg-green-100 text-green-800' :
              status === 'blocked' ? 'bg-orange-100 text-orange-800' :
              'bg-red-100 text-red-800'
            }`}>
              {status === 'pending' ? '⏳ En attente' :
               status === 'validated' ? '✅ Validée' :
               status === 'blocked' ? '🚫 Bloquée' :
               '⛔ Bannie'}
            </span>
          </p>
        </div>

        {warningCount > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-xs text-red-700 font-semibold">
              ⚠️ {warningCount} avertissement{warningCount > 1 ? 's' : ''} envoyé{warningCount > 1 ? 's' : ''}
            </p>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          {status === 'pending' && (
            <>
              <button onClick={() => handleValidate(shopId)} className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-xs font-semibold">
                <CheckCircle size={16} /> Valider
              </button>
              <button onClick={() => handleBlock(shopId)} className="flex items-center gap-1 px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-xs font-semibold">
                <Lock size={16} /> Bloquer
              </button>
            </>
          )}

          {status === 'validated' && (
            <>
              <button onClick={() => handleBlock(shopId)} className="flex items-center gap-1 px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-xs font-semibold">
                <Lock size={16} /> Bloquer
              </button>
              <button onClick={() => handleBan(shopId)} className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-semibold">
                <AlertTriangle size={16} /> Bannir
              </button>
            </>
          )}

          {status === 'blocked' && (
            <>
              <button onClick={() => handleUnblock(shopId)} className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs font-semibold">
                <Unlock size={16} /> Débloquer
              </button>
              <button onClick={() => handleBan(shopId)} className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-semibold">
                <AlertTriangle size={16} /> Bannir
              </button>
            </>
          )}

          <button onClick={() => handleWarn(shopId)} className="flex items-center gap-1 px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-xs font-semibold">
            <Send size={16} /> Avertir
          </button>

          <button className="flex items-center gap-1 px-3 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-xs font-semibold">
            <Eye size={16} /> Détails
          </button>
        </div>
      </div>
    )
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield size={64} className="mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold text-dark mb-2">Accès Refusé</h1>
          <p className="text-gray-600">Vous n'avez pas les permissions d'accéder à cette page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-royal to-royal/80 text-white rounded-lg p-8 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">📊 Panneau d'Administration</h1>
            <p className="text-royal-light">Bienvenue, {user?.name}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-gray-100 font-semibold transition"
          >
            <LogOut size={20} /> Déconnexion
          </button>
        </div>

        {/* Onglets de navigation */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {[
            { id: 'pending', label: '⏳ En attente', count: pendingShops.length },
            { id: 'validated', label: '✅ Validées', count: 2 },
            { id: 'blocked', label: '🚫 Bloquées', count: blockedShops.length },
            { id: 'banned', label: '⛔ Bannies', count: bannedShops.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-royal text-white'
                  : 'bg-white text-dark hover:bg-gray-100'
              }`}
            >
              {tab.label}
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Contenu des onglets */}
        <div>
          {activeTab === 'pending' && (
            <div>
              <h2 className="text-2xl font-bold text-dark mb-6">Boutiques en attente de validation</h2>
              <div className="grid gap-6">
                {pendingShops.length > 0 ? (
                  pendingShops.map(shopId => renderShopCard(shopId, 'pending'))
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg">
                    <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
                    <p className="text-gray-600 text-lg">Aucune boutique en attente ✓</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'validated' && (
            <div>
              <h2 className="text-2xl font-bold text-dark mb-6">Boutiques validées</h2>
              <div className="grid gap-6">
                {['s1', 's3'].map(shopId => renderShopCard(shopId, 'validated'))}
              </div>
            </div>
          )}

          {activeTab === 'blocked' && (
            <div>
              <h2 className="text-2xl font-bold text-dark mb-6">Boutiques bloquées</h2>
              <div className="grid gap-6">
                {blockedShops.length > 0 ? (
                  blockedShops.map(shopId => renderShopCard(shopId, 'blocked'))
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg">
                    <Lock size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 text-lg">Aucune boutique bloquée</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'banned' && (
            <div>
              <h2 className="text-2xl font-bold text-dark mb-6">Boutiques bannies</h2>
              <div className="grid gap-6">
                {bannedShops.length > 0 ? (
                  bannedShops.map(shopId => renderShopCard(shopId, 'banned'))
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg">
                    <AlertCircle size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 text-lg">Aucune boutique bannie</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal d'avertissement */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
              <AlertTriangle size={24} className="text-orange-500" /> Envoyer un avertissement
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold text-dark mb-2">Sévérité</label>
              <select
                value={warningForm.severity}
                onChange={(e) => setWarningForm({ ...warningForm, severity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-royal"
              >
                <option value="warning">⚠️ Avertissement</option>
                <option value="caution">🔴 Mise en garde</option>
                <option value="critical">🚨 Critique</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-dark mb-2">Message</label>
              <textarea
                value={warningForm.message}
                onChange={(e) => setWarningForm({ ...warningForm, message: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-royal"
                rows="4"
                placeholder="Décrivez la raison de l'avertissement..."
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={submitWarning}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold transition"
              >
                Envoyer
              </button>
              <button
                onClick={() => setShowWarningModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
