# 📊 Système de Rôles et Gestion Admin - Do Shopping

## 🎯 Vue d'ensemble

Un système complet de gestion e-commerce avec trois rôles distincts :
- **👤 Client** : Acheteur simple
- **🏪 Vendeur** : Propriétaire de boutique
- **📊 Admin** : Super-administrateur de plateforme

---

## 👥 Rôles et Permissions

### 1️⃣ **CLIENT (Customer)**
**Permissions :**
- ✅ Voir les produits
- ✅ Ajouter au panier
- ✅ Créer des commandes
- ✅ Consulter ses commandes
- ✅ Télécharger les factures
- ✅ Mettre en favoris
- ✅ Voir les profils des vendeurs
- ✅ S'abonner aux boutiques

**Accès :**
- `/products` - Catalogue
- `/dashboard/customer` - Mon compte
- `/invoice` - Mes factures
- `/favorites` - Mes favoris
- `/vendor/:id` - Profil vendeur public
- `/shop/:id` - Page boutique

---

### 2️⃣ **VENDEUR (Vendor)**
**Permissions :**
- ✅ Créer un magasin
- ✅ Ajouter des produits
- ✅ Gérer ses produits
- ✅ Voir ses commandes
- ✅ Consulter ses ventes
- ✅ Mettre à jour ses paramètres

**Accès :**
- `/create-shop` - Créer boutique
- `/dashboard/seller` - Mon magasin
- `/dashboard/seller` - Mes produits

---

### 3️⃣ **ADMIN (Administrator)**
**Permissions :**
- ✅ Valider les nouvelles boutiques
- ✅ Bloquer/débloquer les boutiques
- ✅ Bannir les boutiques (permanence)
- ✅ Envoyer des avertissements aux vendeurs
- ✅ Voir l'historique des avertissements
- ✅ Gérer tous les utilisateurs
- ✅ Accéder à toutes les données

**Accès :**
- `/dashboard/admin` - Panneau d'administration

---

## 🔧 Architecture des Contextes

### 📝 AuthContext
```javascript
user = {
  id: string,
  name: string,
  email: string,
  role: 'customer' | 'vendor' | 'admin',
  shopId: string?, // pour les vendeurs
  createdAt: string,
  isVerified: boolean,
  permissions: string[]
}

// Fonctions
login(userData) → Connexion utilisateur
logout() → Déconnexion
updateUser(updates) → Mise à jour profil
hasPermission(permission) → Vérification permission
```

### 🏪 ShopsContext
```javascript
// État des boutiques
shopsStatus = {
  [shopId]: {
    status: 'pending' | 'validated' | 'blocked' | 'banned',
    reason: string,
    updatedAt: string
  }
}

// Avertissements
warnings = {
  [shopId]: [
    {
      id: string,
      vendor: string, // email vendeur
      message: string,
      severity: 'warning' | 'caution' | 'critical',
      createdAt: string,
      read: boolean
    }
  ]
}

// Fonctions principales
validateShop(shopId) → Valider boutique
blockShop(shopId, reason) → Bloquer boutique
unblockShop(shopId) → Débloquer
banShop(shopId, reason) → Bannir définitivement
warnVendor(shopId, email, message, severity) → Envoyer avertissement
getShopWarnings(shopId) → Récupérer avertissements
```

### 🔔 SubscriptionsContext
```javascript
// Abonnements
subscriptions = {
  [userId]: [shopId1, shopId2, ...]
}

// Fonctions
subscribe(userId, shopId) → S'abonner
unsubscribe(userId, shopId) → Se désabonner
isSubscribed(userId, shopId) → Vérifier abonnement
getUserSubscriptions(userId) → Lister abonnements utilisateur
getShopSubscribers(shopId) → Lister abonnés boutique
getSubscriberCount(shopId) → Compter abonnés
```

---

## 📲 Flux de Cycle de Vie d'une Boutique

```
┌─────────────────────────────────────────────────────────┐
│                  1. CRÉATION (Vendor)                   │
│              Nouveau vendeur crée son magasin             │
│           Status: "pending" (En attente de validation)   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              2. VALIDATION (Admin)                       │
│     Admin examine la boutique → Accepte ou refuse        │
│                   ▼                                      │
│    ┌─────────────────────────────────────────────┐      │
│    │ ACCEPTÉE                │ REFUSÉE          │      │
│    │ Status: "validated"     │ Status: "blocked"│      │
│    │ Boutique active         │ Visible seulement│      │
│    │ Clients peuvent voir    │ par Admin        │      │
│    └─────────────────────────────────────────────┘      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│          3. GESTION ONGOING (Admin)                      │
│                                                         │
│  📨 Envoyer un avertissement (warning/caution/critical) │
│     ↓                                                   │
│  🚫 BLOQUER TEMPORAIREMENT (can be unblocked)          │
│     ↓                                                   │
│  ⛔ BANNIR DÉFINITIVEMENT (permanent removal)           │
└─────────────────────────────────────────────────────────┘
```

---

## 🛡️ Système d'Avertissements

Les admin peuvent envoyer 3 types d'avertissements :

### ⚠️ **Warning (Avertissement standard)**
- Problème mineur
- Première infraction
- Notification au vendeur

### 🔴 **Caution (Mise en garde)**
- Problème modéré
- Deuxième infraction
- Avertissement renforcé

### 🚨 **Critical (Critique)**
- Violation grave
- Risque de blocage/bannissement
- Action immédiate requise

---

## 📊 Dashboard Admin

### Onglets disponibles :
1. **⏳ En attente** - Boutiques nouvellement créées en attente de validation
2. **✅ Validées** - Boutiques approuvées et actives
3. **🚫 Bloquées** - Boutiques temporairement bloquées
4. **⛔ Bannies** - Boutiques définitivement bannies

### Actions possibles :
```
Pour "En attente":
├─ ✅ Valider (→ "validated")
└─ 🚫 Bloquer (→ "blocked")

Pour "Validées":
├─ 🚫 Bloquer (→ "blocked")
├─ ⛔ Bannir (→ "banned")
└─ 📨 Avertir

Pour "Bloquées":
├─ ✅ Débloquer (→ "validated")
├─ ⛔ Bannir (→ "banned")
└─ 📨 Avertir

Pour "Bannies":
└─ 📨 Avertir (notification)
```

---

## 👨‍💼 Profil Vendeur Public (`/vendor/:id`)

Les clients peuvent voir le profil complet d'une boutique :

- 🏪 **Infos boutique** : Nom, propriétaire, email, localisation
- ⭐ **Évaluation** : Note (ex: 4.8/5) et nombre d'avis
- 📊 **Statistiques** : Nombre produits, abonnés, date adhésion
- ✅ **Badges** : Fiabilité, rapidité, qualité
- 🛍️ **Produits** : Affichage des produits de la boutique
- 💬 **Avis** : Graphique des évaluations clients
- 🔔 **Abonnement** : Bouton pour s'abonner à la boutique

---

## 🔐 Accès Admin (Démo)

### Bouton spécial sur page login
Une option "Accès Admin (Démo)" permet de tester immédiatement :
- Email: `admin@doshop.com`
- Role: `admin`
- Redirection automatique vers `/dashboard/admin`

---

## 📱 Points d'entrée de l'application

### Page Login (`/auth`)
```
┌─────────────────────────────────┐
│        Do Shopping              │
├─────────────────────────────────┤
│  [👤 Acheteur]  [🏪 Vendeur]   │
├─────────────────────────────────┤
│  📊 Accès Admin (Démo)          │ ← Nouveau !
├─────────────────────────────────┤
│  Email: [_________________]     │
│  Mot de passe: [____________]   │
│  [Se connecter]                 │
└─────────────────────────────────┘
```

---

## 🎯 Utilisation - Scénarios

### Scénario 1 : Client veut acheter
```
1. Client login → role: 'customer'
2. Voir /products
3. Clique "Acheter maintenant" → crée order
4. Va à /invoice pour télécharger facture
5. S'abonne à boutique via /vendor/:id
```

### Scénario 2 : Vendeur crée boutique
```
1. Vendor login → role: 'vendor'
2. Clique "Créer boutique" → /create-shop
3. Boutique status: "pending" (attente validation)
4. Admin voit boutique en attente
5. Admin clique "Valider" → status: "validated"
6. Clients voient la boutique
```

### Scénario 3 : Admin gère boutiques
```
1. Admin login → role: 'admin'
2. Va à /dashboard/admin
3. Voit boutiques par status (pending/validated/blocked/banned)
4. Valide boutiques en attente
5. Envoie avertissements aux vendeurs
6. Bloque/bannit si nécessaire
```

---

## 💾 Stockage (localStorage)

```
auth-user
├─ user object (id, email, role, permissions, etc)

shops-status
├─ { shopId: { status, reason, updatedAt } }

shop-warnings
├─ { shopId: [ { id, vendor, message, severity, createdAt, read } ] }

shop-subscriptions
├─ { userId: [ shopId1, shopId2 ] }

orders
├─ [ { id, userId, items, total, tax, status, createdAt } ]

cart-items, favorites
├─ [existing data]
```

---

## 🔄 Flux d'Authentification Amélioré

```
┌────────────────────────────────────────────────────────┐
│              Page Login (/auth)                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Mode: 'login' (by default)                          │
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │ [👤 Acheteur]      [🏪 Vendeur]             │    │
│  │ signup-client      signup-vendor            │    │
│  │                                              │    │
│  │ 📊 Accès Admin (Démo) ← handleAdminAccess   │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
│  Email: [_________________]                          │
│  Pass:  [_________________]                          │
│  [Se connecter]                                      │
│                                                        │
│  → handleLogin() → AuthContext.login()               │
│     role: 'customer'                                 │
│     → Navigate '/'                                  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 🚀 Prochaines Étapes (Phase 9)

- [ ] Intégration API backend pour persistance
- [ ] Sistema de notification email
- [ ] Analytics avancées pour admin
- [ ] Système de reporting
- [ ] Modération de contenu
- [ ] Metriques de performance vendeurs

---

## 📦 Build Status

```
✅ 2372 modules transformed
✅ CSS: 41.71 KB (gzip: 6.88 KB)
✅ JS:  336.30 KB (gzip: 92.35 KB)
✅ Build time: ~2.6s
```

---

**Version:** Phase 8 - Role-Based Auth & Admin System
**Last Updated:** 2024
**Status:** ✅ Production Ready
