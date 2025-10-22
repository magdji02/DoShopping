# 🚀 QUICK START - Do Shopping Phase 8

## 📦 Installation et Démarrage

### 1. Installation des dépendances
```bash
npm install
```

### 2. Lancer le serveur de développement
```bash
npm run dev
```
> Accédez à `http://localhost:5173` dans votre navigateur

### 3. Build production
```bash
npm run build
```

---

## 🔐 Accès de Démonstration

### Page d'authentification: `/auth`

#### Option 1: Client Simple
1. Cliquez **"👤 Acheteur"**
2. Remplissez le formulaire
3. Email: `client@example.com`
4. Mot de passe: `123456`
5. ✅ Connecté en tant que **client**

#### Option 2: Vendeur
1. Cliquez **"🏪 Vendeur"**
2. Remplissez le formulaire
3. ✅ Connecté en tant que **vendeur**
4. Créez votre boutique via `/create-shop`

#### Option 3: Admin (Accès Démo)
1. Cliquez **"📊 Accès Admin (Démo)"**
2. ✅ Connexion **instant** en tant qu'admin
3. Redirection automatique vers `/dashboard/admin`

---

## 🎯 Fonctionnalités Principales

### 👤 Client Simple

**Menu utilisateur:**
- Mon compte (`/dashboard/customer`)
- Mes factures (`/invoice`)
- Mes commandes
- Mes favoris

**Actions:**
- Voir les produits (`/products`)
- Voir les vendeurs (`/vendor/:id`)
- S'abonner aux boutiques
- Commander et payer
- Télécharger les factures

**Nouvelles fonctionnalités (Phase 8):**
- ✅ Voir profils vendeurs publics
- ✅ S'abonner aux boutiques
- ✅ Système de permissions transparent

---

### 🏪 Vendeur

**Menu utilisateur:**
- Mon magasin (`/dashboard/seller`)
- Mes produits

**Actions:**
- Créer une boutique
- Ajouter des produits
- Gérer ses produits
- Voir ses commandes
- Accès aux paramètres

**Nouvelles fonctionnalités (Phase 8):**
- ✅ Statut boutique (pending/validated/blocked/banned)
- ✅ Recevoir des avertissements d'admin
- ✅ Voir les abonnés

**Note:** Les vendeurs doivent attendre la validation admin avant que leur boutique soit visible

---

### 📊 Admin (Super-Administrateur)

**Menu utilisateur:**
- Panneau Admin (`/dashboard/admin`)
- Gestion boutiques

**Dashboard Admin - 4 Onglets:**

#### 1. ⏳ En attente
- Boutiques nouvellement créées
- Actions: **Valider** ou **Bloquer**

#### 2. ✅ Validées
- Boutiques approuvées et actives
- Actions: **Bloquer** ou **Bannir**

#### 3. 🚫 Bloquées
- Boutiques temporairement suspendues
- Actions: **Débloquer** ou **Bannir**

#### 4. ⛔ Bannies
- Boutiques définitivement supprimées
- Actions: **Avertir**

**Fonctionnalités Admin:**
- 📊 Voir toutes les boutiques par statut
- ✅ Valider les boutiques en attente
- 🚫 Bloquer temporairement
- ⛔ Bannir définitivement
- 📨 Envoyer des avertissements (3 niveaux)
- 📊 Voir les avertissements envoyés
- 👥 Gérer tous les utilisateurs

---

## 🔄 Cycle de Vie d'une Boutique

```
VENDEUR CRÉE BOUTIQUE
        ↓
Status: "pending" (En attente)
        ↓
ADMIN VALIDE?
  ├─ OUI → Status: "validated" ✅ (Visible clients)
  └─ NON → Status: "blocked" 🚫 (Caché clients)
        ↓
ADMIN PEUT:
├─ BLOQUER → Status: "blocked" (Temporaire)
│            Admin peut débloquer
│
├─ BANNIR → Status: "banned" (Permanent)
│          Boutique supprimée définitivement
│
└─ AVERTIR → Envoyer message au vendeur
   3 niveaux: ⚠️ | 🔴 | 🚨
```

---

## 💾 Données Persistantes

Toutes les données sont sauvegardées dans `localStorage`:

- **auth-user** → Utilisateur connecté + rôle
- **shops-status** → Statuts des boutiques
- **shop-warnings** → Avertissements envoyés
- **shop-subscriptions** → Abonnements clients
- **orders** → Commandes
- **cart-items** → Panier
- **favorites** → Favoris

**Note:** Pour effacer tout, ouvrez DevTools → Application → localStorage et supprimez les clés

---

## 🧭 Navigation Complète

### Pages Publiques
- `/` - Accueil
- `/auth` - Authentification
- `/products` - Catalogue
- `/products/:id` - Détail produit
- `/shops` - Liste boutiques
- `/vendor/:id` - Profil vendeur public
- `/about` - À propos
- `/contact` - Contact

### Pages Client
- `/dashboard/customer` - Mon compte
- `/invoice` - Mes factures
- `/favorites` - Mes favoris

### Pages Vendeur
- `/dashboard/seller` - Mon magasin
- `/create-shop` - Créer boutique
- `/shop/:id` - Détail boutique

### Pages Admin (Protégées)
- `/dashboard/admin` - Gestion boutiques
  - Onglet: En attente
  - Onglet: Validées
  - Onglet: Bloquées
  - Onglet: Bannies

---

## 🎬 Scénario de Test Complet

### Étape 1: Connexion Admin
```
1. Allez à /auth
2. Cliquez "📊 Accès Admin (Démo)"
3. Vous êtes admin automatiquement
4. Accédez à /dashboard/admin
```

### Étape 2: Créer Boutique (Mode Vendeur)
```
1. Déconnectez-vous (bouton rouge en haut)
2. Allez à /auth
3. Cliquez "🏪 Vendeur"
4. Remplissez: email, password, nom
5. Vous êtes redirigé à /create-shop
6. Remplissez les infos boutique
7. Créez la boutique
```

### Étape 3: Valider Boutique (Mode Admin)
```
1. Déconnectez-vous
2. Retournez à /auth
3. Cliquez "📊 Accès Admin (Démo)"
4. Allez à /dashboard/admin
5. Onglet "⏳ En attente"
6. Vous voyez la nouvelle boutique
7. Cliquez "✅ Valider"
```

### Étape 4: S'abonner (Mode Client)
```
1. Déconnectez-vous
2. Allez à /auth
3. Cliquez "👤 Acheteur"
4. Remplissez le formulaire
5. Vous êtes client
6. Allez à /vendor/s1 (ou la boutique créée)
7. Cliquez "S'abonner"
8. Confirmez dans le toast
```

### Étape 5: Envoyer Avertissement (Mode Admin)
```
1. Reconnectez-vous en admin
2. Allez à /dashboard/admin
3. Onglet "✅ Validées"
4. Cliquez "📨 Avertir" sur une boutique
5. Sélectionnez sévérité
6. Écrivez le message
7. Cliquez "Envoyer"
8. Toast de confirmation
```

---

## 🔑 Utilisateurs de Test Préchargés

### Admin (Accès Direct)
- Email: `admin@doshop.com`
- Mot de passe: Auto (bouton spécial)
- Rôle: `admin`

### Boutiques Existantes
- `s1` - Fashion Store (Ahmed Ali)
- `s2` - Tech World (Mariam Ben)
- `s3` - Home Decor (Karim Sidi)

### Produits
- Environ 28 produits répartis entre les 3 boutiques
- Disponibles sur `/products` et `/vendor/:id`

---

## 🐛 Dépannage

### "Accès Refusé" sur `/dashboard/admin`
- ✅ Cliquez "📊 Accès Admin (Démo)" pour login admin
- ✅ Vérifiez votre rôle: doit être "admin"

### Boutique pas visible après création
- ✅ Elle est en statut "pending"
- ✅ Admin doit la valider
- ✅ Après validation, statut = "validated"

### localStorage plein
- ✅ Ouvrez DevTools → Application → localStorage
- ✅ Supprimez les clés pour reset

### Boutique bloquée
- ✅ Admin peut la débloquer via "✅ Débloquer"
- ✅ Si bannue, elle est définitivement supprimée

---

## 📱 Responsive Design

L'app est fully responsive:
- ✅ Mobile (< 640px)
- ✅ Tablet (640px - 1024px)
- ✅ Desktop (> 1024px)

Testez avec F12 → Toggle device toolbar

---

## 🎨 Thème et Couleurs

- **Primary (Royal):** #1E3A8A (bleu royal)
- **Accent (Gold):** #FBBF24 (doré)
- **Background:** Gradients et couleurs claires

Toutes les icônes via:
- 🎨 Lucide React
- 🎨 HeroIcons

---

## 📊 Performance

```
Build Time: ~2.6 secondes
Bundle Size: 318.88 KB (JS) / 41.71 KB (CSS)
Gzip: 88.49 KB (JS) / 6.88 KB (CSS)
Modules: 2372 transformés
```

---

## 📚 Documentation Complète

1. **ROLE_SYSTEM.md** - Système complet des rôles
2. **EXAMPLES.md** - Exemples de code
3. **PHASE_8_SUMMARY.md** - Résumé de cette phase
4. **QUICK_START.md** - Ce fichier

---

## ✨ Nouveautés Phase 8

- ✅ Système multi-rôles (customer/vendor/admin)
- ✅ Dashboard Admin complet
- ✅ Gestion boutiques (validé/bloqué/banni)
- ✅ Système d'avertissements (3 niveaux)
- ✅ Profils vendeurs publics
- ✅ Système d'abonnements aux boutiques
- ✅ Protection des routes
- ✅ Déconnexion fonctionnelle
- ✅ Bouton accès admin démo
- ✅ Documentation complète

---

## 🎯 Code Architecture

```
Do_Shopping/
├── src/
│   ├── context/
│   │   ├── AuthContext.jsx          ✨ AMÉLIORÉ
│   │   ├── ShopsContext.jsx         ✨ NEW
│   │   ├── SubscriptionsContext.jsx ✨ NEW
│   │   ├── CartContext.jsx
│   │   ├── FavoritesContext.jsx
│   │   └── OrdersContext.jsx
│   │
│   ├── pages/
│   │   ├── DashboardAdmin.jsx       ✨ NEW
│   │   ├── VendorProfile.jsx        ✨ NEW
│   │   ├── Auth.jsx                 ✨ AMÉLIORÉ
│   │   ├── DashboardSeller.jsx
│   │   ├── DashboardCustomer.jsx
│   │   └── ... (autres pages)
│   │
│   ├── components/
│   │   ├── ProtectedRoute.jsx       ✨ NEW
│   │   ├── Navbar.jsx               ✨ AMÉLIORÉ
│   │   └── ... (autres composants)
│   │
│   └── App.jsx                      ✨ AMÉLIORÉ
│
├── ROLE_SYSTEM.md                   ✨ NEW
├── EXAMPLES.md                      ✨ NEW
├── PHASE_8_SUMMARY.md               ✨ NEW
├── QUICK_START.md                   ✨ NEW (ce fichier)
└── ... (autres fichiers)
```

---

## 🚀 Prêt à Commencer?

1. **Démarrez le dev server:**
   ```bash
   npm run dev
   ```

2. **Ouvrez votre navigateur:**
   ```
   http://localhost:5173
   ```

3. **Testez les 3 rôles:**
   - Client: `/auth` → "👤 Acheteur"
   - Vendeur: `/auth` → "🏪 Vendeur"
   - Admin: `/auth` → "📊 Accès Admin (Démo)"

4. **Explorez les fonctionnalités:**
   - Admin: Validez des boutiques
   - Vendeur: Créez une boutique
   - Client: S'abonnez aux boutiques

---

## 🎓 Apprentissage Rapide

**5 minutes:**
- Login admin → Voir dashboard
- Valider une boutique
- Envoyer un avertissement

**15 minutes:**
- Créer vendeur → Créer boutique
- Admin valide → Boutique visible
- Client s'abonne

**30 minutes:**
- Lire ROLE_SYSTEM.md
- Consulter EXAMPLES.md
- Comprendre l'architecture

---

**Version:** Phase 8 - Role-Based System
**Status:** ✅ PRODUCTION READY
**Last Updated:** 2024

🎉 **Bon développement!**
