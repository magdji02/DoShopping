# 💡 Exemples d'Utilisation - Do Shopping Role System

## 🔐 Authentification

### Login Client
```javascript
import { useAuth } from './context/AuthContext'

export function LoginExample() {
  const { login, logout } = useAuth()

  const handleClientLogin = () => {
    login({
      email: 'client@example.com',
      name: 'Jean Dupont',
      role: 'customer'
    })
    // ✅ Utilisateur connecté comme client
    // Permissions: view_products, add_to_cart, create_order, etc.
  }

  const handleLogout = () => {
    logout()
    // ✅ Utilisateur déconnecté
  }

  return (
    <>
      <button onClick={handleClientLogin}>Login Client</button>
      <button onClick={handleLogout}>Logout</button>
    </>
  )
}
```

### Login Vendeur
```javascript
const handleVendorLogin = () => {
  login({
    email: 'vendor@example.com',
    name: 'Ahmed Ali',
    role: 'vendor',
    shopId: 'shop_123'
  })
  // ✅ Vendeur connecté
  // Permissions: create_product, edit_own_products, view_own_orders, etc.
}
```

### Login Admin
```javascript
const handleAdminLogin = () => {
  login({
    email: 'admin@doshop.com',
    name: 'Admin SuperUser',
    role: 'admin'
  })
  // ✅ Admin connecté
  // Permissions: validate_shop, block_shop, ban_shop, warn_vendor, etc.
}
```

---

## 🛒 Gestion des Boutiques (ShopsContext)

### Récupérer le statut d'une boutique
```javascript
import { useShops } from './context/ShopsContext'

export function ShopStatusExample() {
  const { getShopStatus } = useShops()

  const shopStatus = getShopStatus('shop_123')
  // ✅ Retourne: 'pending' | 'validated' | 'blocked' | 'banned'
}
```

### Valider une boutique (Admin)
```javascript
export function ValidateShopExample() {
  const { validateShop } = useShops()
  const { addToast } = useToast()

  const handleValidate = (shopId) => {
    validateShop(shopId)
    addToast('✅ Boutique validée avec succès', 'success')
  }

  return <button onClick={() => handleValidate('shop_123')}>Valider</button>
}
```

### Bloquer une boutique (Admin)
```javascript
export function BlockShopExample() {
  const { blockShop } = useShops()

  const handleBlock = (shopId) => {
    blockShop(shopId, 'Produits contrefaits détectés')
    // ✅ Boutique bloquée temporairement
    // Status: 'blocked'
  }

  return <button onClick={() => handleBlock('shop_123')}>Bloquer</button>
}
```

### Bannir une boutique (Admin)
```javascript
export function BanShopExample() {
  const { banShop } = useShops()

  const handleBan = (shopId) => {
    banShop(shopId, 'Violation grave - fraude détectée')
    // ✅ Boutique bannie définitivement
    // Status: 'banned'
  }

  return <button onClick={() => handleBan('shop_123')}>Bannir</button>
}
```

### Envoyer un avertissement au vendeur (Admin)
```javascript
export function WarnVendorExample() {
  const { warnVendor } = useShops()
  const { addToast } = useToast()

  const handleWarn = (shopId) => {
    const warningId = warnVendor(
      shopId,
      'vendor@shop.com',
      'Vos images produits ne respectent pas les conditions d\'utilisation. Corrigez dans 48h.',
      'caution' // 'warning' | 'caution' | 'critical'
    )
    addToast('📨 Avertissement envoyé', 'info')
    return warningId
  }

  return <button onClick={() => handleWarn('shop_123')}>Avertir</button>
}
```

### Récupérer les avertissements d'une boutique
```javascript
export function GetWarningsExample() {
  const { getShopWarnings } = useShops()

  const warnings = getShopWarnings('shop_123')
  // ✅ Retourne:
  // [
  //   {
  //     id: 'warn_123',
  //     vendor: 'ahmed@shop.com',
  //     message: 'Images non conformes',
  //     severity: 'caution',
  //     createdAt: '2024-01-15T10:00:00Z',
  //     read: false
  //   }
  // ]

  return (
    <ul>
      {warnings.map(w => (
        <li key={w.id}>
          {w.severity}: {w.message}
        </li>
      ))}
    </ul>
  )
}
```

### Filtrer les boutiques par statut
```javascript
export function FilterShopsExample() {
  const { getPendingShops, getValidatedShops, getBlockedShops, getBannedShops } = useShops()

  const pending = getPendingShops() // ['shop_1', 'shop_2', ...]
  const validated = getValidatedShops()
  const blocked = getBlockedShops()
  const banned = getBannedShops()

  return (
    <div>
      <p>En attente: {pending.length}</p>
      <p>Validées: {validated.length}</p>
      <p>Bloquées: {blocked.length}</p>
      <p>Bannies: {banned.length}</p>
    </div>
  )
}
```

---

## 🔔 Abonnements aux Boutiques (SubscriptionsContext)

### S'abonner à une boutique (Client)
```javascript
import { useSubscriptions } from './context/SubscriptionsContext'
import { useAuth } from './context/AuthContext'

export function SubscribeExample() {
  const { user } = useAuth()
  const { subscribe } = useSubscriptions()
  const { addToast } = useToast()

  const handleSubscribe = () => {
    subscribe(user.id, 'shop_123')
    addToast('🔔 Vous êtes abonné!', 'success')
  }

  return <button onClick={handleSubscribe}>S'abonner</button>
}
```

### Se désabonner d'une boutique
```javascript
export function UnsubscribeExample() {
  const { user } = useAuth()
  const { unsubscribe } = useSubscriptions()

  const handleUnsubscribe = () => {
    unsubscribe(user.id, 'shop_123')
  }

  return <button onClick={handleUnsubscribe}>Se désabonner</button>
}
```

### Vérifier si abonné
```javascript
export function CheckSubscriptionExample() {
  const { user } = useAuth()
  const { isSubscribed } = useSubscriptions()

  const subscribed = isSubscribed(user.id, 'shop_123')

  return (
    <button disabled={subscribed}>
      {subscribed ? '✓ Abonné' : 'S\'abonner'}
    </button>
  )
}
```

### Obtenir les abonnements d'un utilisateur
```javascript
export function GetUserSubscriptionsExample() {
  const { user } = useAuth()
  const { getUserSubscriptions } = useSubscriptions()

  const shopIds = getUserSubscriptions(user.id)
  // ✅ Retourne: ['shop_1', 'shop_3', 'shop_5']

  return (
    <div>
      {shopIds.length > 0 ? (
        <p>Vous êtes abonné à {shopIds.length} boutiques</p>
      ) : (
        <p>Vous n'êtes abonné à aucune boutique</p>
      )}
    </div>
  )
}
```

### Obtenir les abonnés d'une boutique (Admin/Vendor)
```javascript
export function GetSubscribersExample() {
  const { getShopSubscribers, getSubscriberCount } = useSubscriptions()

  const subscribers = getShopSubscribers('shop_123')
  // ✅ ['user_1', 'user_2', 'user_3']

  const count = getSubscriberCount('shop_123')
  // ✅ 3

  return <p>{count} clients abonnés</p>
}
```

---

## 🔐 Vérification de Permissions (AuthContext)

### Vérifier une permission
```javascript
import { usePermission } from './context/AuthContext'

export function PermissionCheckExample() {
  const canCreateShop = usePermission('validate_shop')

  return (
    <div>
      {canCreateShop ? (
        <button>Valider une boutique</button>
      ) : (
        <p>⛔ Permission refusée</p>
      )}
    </div>
  )
}
```

### Vérifier le rôle
```javascript
import { useRole } from './context/AuthContext'

export function RoleCheckExample() {
  const isAdmin = useRole('admin')
  const isVendor = useRole('vendor')

  return (
    <div>
      {isAdmin && <AdminPanel />}
      {isVendor && <SellerDashboard />}
    </div>
  )
}
```

### Vérifier les permissions disponibles
```javascript
export function ListPermissionsExample() {
  const { user } = useAuth()

  return (
    <ul>
      {user?.permissions?.map(p => (
        <li key={p}>{p}</li>
      ))}
    </ul>
  )
}
```

---

## 🛡️ Protéger les Routes

### Utiliser ProtectedRoute
```javascript
import { ProtectedRoute } from './components/ProtectedRoute'
import DashboardAdmin from './pages/DashboardAdmin'

// Dans App.jsx
<Route 
  path="/dashboard/admin" 
  element={
    <ProtectedRoute requiredRole="admin">
      <DashboardAdmin />
    </ProtectedRoute>
  } 
/>
```

### Accès : Nécessite authentification
```javascript
<ProtectedRoute>
  <PageProtegee />
</ProtectedRoute>
// Redirige à /auth si pas authentifié
```

### Accès : Nécessite rôle admin uniquement
```javascript
<ProtectedRoute requiredRole="admin">
  <AdminDashboard />
</ProtectedRoute>
// Redirige à / si rôle != admin
```

---

## 📊 Dashboard Admin - Cas d'Utilisation

### Afficher les boutiques en attente
```javascript
export function AdminPendingShops() {
  const { getPendingShops, validateShop, blockShop } = useShops()
  const shops = getPendingShops()

  return (
    <div>
      <h2>Boutiques en attente ({shops.length})</h2>
      {shops.map(shopId => (
        <div key={shopId}>
          <p>{shopId}</p>
          <button onClick={() => validateShop(shopId)}>
            ✅ Valider
          </button>
          <button onClick={() => blockShop(shopId)}>
            🚫 Bloquer
          </button>
        </div>
      ))}
    </div>
  )
}
```

### Formulaire d'avertissement
```javascript
export function WarningForm() {
  const { warnVendor } = useShops()
  const [severity, setSeverity] = useState('warning')
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    warnVendor('shop_123', 'vendor@shop.com', message, severity)
    setMessage('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <select value={severity} onChange={e => setSeverity(e.target.value)}>
        <option value="warning">⚠️ Avertissement</option>
        <option value="caution">🔴 Mise en garde</option>
        <option value="critical">🚨 Critique</option>
      </select>
      <textarea 
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Message..."
      />
      <button type="submit">Envoyer</button>
    </form>
  )
}
```

---

## 👨‍💼 Profil Vendeur Public

### Afficher info vendeur
```javascript
export function VendorProfilePage({ vendorId }) {
  const { user } = useAuth()
  const { subscribe, unsubscribe, isSubscribed } = useSubscriptions()
  
  const vendor = getVendorData(vendorId)
  const subscribed = user ? isSubscribed(user.id, vendorId) : false

  const handleSubscribe = () => {
    if (!user) {
      // Redirect to login
      navigate('/auth')
      return
    }
    
    if (subscribed) {
      unsubscribe(user.id, vendorId)
    } else {
      subscribe(user.id, vendorId)
    }
  }

  return (
    <div>
      <h1>{vendor.name}</h1>
      <p>⭐ {vendor.rating}/5 ({vendor.reviewCount} avis)</p>
      <button onClick={handleSubscribe}>
        {subscribed ? 'Vous êtes abonné' : 'S\'abonner'}
      </button>
    </div>
  )
}
```

---

## 💾 Accès localStorage

```javascript
// Tous les contextes utilisent localStorage automatiquement

// Auth
JSON.parse(localStorage.getItem('auth-user'))
// { id, email, name, role, permissions, ... }

// Shops
JSON.parse(localStorage.getItem('shops-status'))
// { 'shop_1': { status, reason, updatedAt } }

JSON.parse(localStorage.getItem('shop-warnings'))
// { 'shop_1': [ { id, vendor, message, severity, ... } ] }

// Subscriptions
JSON.parse(localStorage.getItem('shop-subscriptions'))
// { 'user_1': ['shop_1', 'shop_3'] }

// Orders
JSON.parse(localStorage.getItem('orders'))
// [ { id, userId, items, total, tax, status, ... } ]

// Cart & Favorites
JSON.parse(localStorage.getItem('cart-items'))
JSON.parse(localStorage.getItem('favorites'))
```

---

## 🧪 Scénario de Test Complet

```javascript
// 1. Client Login
login({
  email: 'client@test.com',
  name: 'Client Test',
  role: 'customer'
})
// ✅ role: 'customer', permissions: [...customer permissions]

// 2. Client voit une boutique
const vendor = getVendorData('shop_1')
// ✅ Boutique avec status 'validated'

// 3. Client s'abonne
subscribe('user_1', 'shop_1')
// ✅ Abonnement créé

// 4. Client logout et Admin login
logout()
login({
  email: 'admin@doshop.com',
  name: 'Admin',
  role: 'admin'
})
// ✅ role: 'admin', permissions: [...admin permissions]

// 5. Admin voit boutique en attente
const pending = getPendingShops()
// ✅ ['shop_2'] (nouvelle boutique)

// 6. Admin valide
validateShop('shop_2')
// ✅ Status: 'validated'

// 7. Admin envoie avertissement
warnVendor('shop_1', 'vendor@shop.com', 'Images non conformes', 'warning')
// ✅ Avertissement créé

// 8. Retour à Client
logout()
login({ email: 'client@test.com', ... })
// ✅ Client peut voir boutique 'shop_2' maintenant
```

---

**Version:** Phase 8 - Role-Based System
**Last Updated:** 2024
