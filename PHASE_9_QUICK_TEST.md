# 🧪 Phase 9 - Quick Test Guide

## 🚀 Démarrage Rapide

```bash
npm run dev
# http://localhost:5175
```

---

## ✅ Test 1: Visiteur Voit les Produits (Sans Login)

```
1. Ouvrir http://localhost:5175/products
2. ✅ Pas de redirection login
3. ✅ Voir liste des produits
4. Chaque produit affiche:
   ├─ Image + Prix + Rating
   ├─ 👤 Nom Vendeur (NOUVEAU!)
   └─ [Voir] [Ajouter] buttons
```

---

## ✅ Test 2: Profil Vendeur depuis Produit

```
1. Sur /products, click sur "👤 Vendor Name"
   (ex: "👤 Fashion Store")

2. Redirect à /vendor/:id

3. Affichage du profil:
   ├─ 👔 Nom boutique
   ├─ ⭐ 4.8 (245 avis)
   ├─ 👥 1,250 abonnés
   ├─ 👁️ X visites ← NEW!
   ├─ 🔔 S'abonner (si login → ok, sinon message)
   └─ Produits et Avis
```

---

## ✅ Test 3: Compteur Visites Augmente

```
1. Ouvrir http://localhost:5175/vendor/s1
   → Voir: 👁️ 1 visite

2. Refresh la page (F5)
   → Voir: 👁️ 2 visites ✅

3. Ouvrir /vendor/s2
   → Voir: 👁️ 1 visite (boutique différente)

4. Revenir à /vendor/s1
   → Voir: 👁️ 3 visites ✅

5. DevTools → Application → localStorage
   → Voir: shop-visits: {"s1": 3, "s2": 1}
```

---

## ✅ Test 4: Vendeur Voit Ses Visites

```
1. /auth → Click "🏪 Vendeur"
2. Remplir: Email, Mot de passe, Nom
3. Login → Redirect /dashboard/seller

4. Dans le dashboard:
   ├─ Voir 4 widgets:
   │  ├─ Ventes ce mois
   │  ├─ Visiteurs uniques
   │  ├─ 👁️ Visites de boutique ← NEW!
   │  └─ Produits actifs
   │
   └─ Widget visites affiche:
      ├─ Titre: "Visites de boutique 👁️"
      ├─ Nombre: (ex: 127)
      └─ Sous-titre: "Depuis le lancement"
```

---

## ✅ Test 5: Parcours Complet (Visiteur)

```
Scénario: Je suis un visiteur, je ne suis pas connecté

1. Aller à http://localhost:5175 (Home)

2. Menu → "🛍️ Produits"
   ✅ J'accède à /products sans login

3. Voir produits avec vendeurs
   ✅ Chaque produit affiche le vendeur

4. Click sur "👤 TechHub"
   → /vendor/s2
   ✅ Je vois le profil complet
   ✅ Compteur visites: 👁️ 1

5. Click "🔔 S'abonner"
   ✅ Message: "⚠️ Veuillez vous connecter d'abord"

6. Refresh page
   ✅ Compteur visites: 👁️ 2

7. Aller à /vendor/s1
   ✅ Compteur visites: 👁️ 1

8. Revenir à /vendor/s2
   ✅ Compteur visites: 👁️ 3
```

---

## ✅ Test 6: Parcours Complet (Vendeur)

```
Scénario: Je suis un vendeur, je veux voir mes visites

1. /auth → "🏪 Vendeur"
   ├─ Email: vendor@test.com
   ├─ Mot de passe: 12345
   └─ Nom: Ahmed Store

2. Login → /dashboard/seller

3. Voir widget "👁️ Visites de boutique"
   ✅ Affiche le nombre total de visites reçues

4. Si je me connecte en tant que vendeur différent
   → Voir un compteur différent (pour sa boutique)

5. Admin → Voir toutes les boutiques
   → Pas d'impact sur le compteur vendeur
```

---

## 🔍 Vérification des Données

### Voir toutes les visites
```javascript
// Dans DevTools Console (F12)
JSON.parse(localStorage.getItem('shop-visits'))

// Résultat attendu:
{
  "s1": 5,
  "s2": 3,
  "s3": 1,
  ...
}
```

### Reset visites (pour tester)
```javascript
localStorage.removeItem('shop-visits')
location.reload()
// Compteurs reviennent à 0
```

### Voir info vendeur
```javascript
JSON.parse(localStorage.getItem('auth-user'))

// Résultat:
{
  "id": "user123",
  "email": "vendor@test.com",
  "name": "Ahmed Store",
  "role": "vendor",
  "shopId": "s1",  ← Important pour les visites
  ...
}
```

---

## 📱 Points d'Accès Principaux

| URL | Accès | Affiche | Nouveautés |
|-----|-------|---------|-----------|
| `/products` | 🌐 Public | Tous produits | ✅ Vendeur cliquable |
| `/vendor/:id` | 🌐 Public | Profil boutique | ✅ Compteur visites |
| `/dashboard/seller` | 🔐 Vendeur | Dashboard | ✅ Widget visites |
| `/dashboard/customer` | 🔐 Client | Mon compte | - |
| `/dashboard/admin` | 🔐 Admin | Gestion | - |

---

## 🐛 Troubleshooting

### Compteur visites pas d'augmentation?
```
✅ Check localStorage:
   DevTools → Application → Storage → localStorage
   
✅ Vérifier que vous accédez à /vendor/:id
   Pas /shop/:id (c'est une page différente)

✅ Refresh automatiquement la page? 
   Vérifier que useEffect fonctionne
```

### Vendeur ne voit pas ses visites?
```
✅ Vérifier shopId du vendeur:
   localStorage → auth-user → shopId
   
✅ Vérifier que le shopId correspond à vendorId du produit:
   PRODUCTS → p.s (ex: "s1")
   
✅ Vérifier que vous êtes sur le bon dashboard:
   /dashboard/seller (pas /dashboard/customer)
```

### Données supprimées?
```
✅ localStorage.removeItem('shop-visits')
   → Reset le compteur
   
✅ Reload page
   → Compteur redémarrera de 0
```

---

## 🎯 Checklist de Vérification

- [ ] Visiteur peut voir /products sans login
- [ ] Chaque produit affiche un vendeur cliquable
- [ ] Click vendeur → /vendor/:id
- [ ] Compteur visites augmente à chaque refresh
- [ ] Visiteur peut voir le profil du vendeur
- [ ] Vendeur connecté voit ses visites en dashboard
- [ ] localStorage["shop-visits"] persiste après refresh
- [ ] Vendeur différent = compteur différent
- [ ] Bouton S'abonner sans login → message warning

---

## 📊 Données de Test

### Vendeurs (Boutiques)
```
s1: Fashion Store (Ahmed Ali)
s2: Tech World (Mariam Ben)
s3: Home Decor (Karim Sidi)
s4: Beauty Shop (Fatou Diallo)
s5: Home Furniture (Mohamed Sow)
s6: Food Store (Aminata Traore)
s7: Jewelry Store (Boubou Keita)
s8: Books Shop (Aissatou Sy)
s9: Modern Fashion (Khady Sene)
s10: Electronics (Ibrahim Toure)
```

### Produits Exemple
```
Wax (18,500 XOF) - Fashion Store (s1)
Robe (35,000 XOF) - Modern Fashion (s9)
Smartphone (185,000 XOF) - Tech World (s2)
Écouteurs (28,000 XOF) - Electronics (s10)
Lampe (18,500 XOF) - Home Furniture (s5)
...
```

---

## 🎉 Succès Attendu

```
✅ Phase 9 est complète quand:
1. Visiteur voit produits + vendeur sans login
2. Compteur visites augmente
3. Vendeur voit ses visites en dashboard
4. Données persistent dans localStorage
5. Build compile sans erreurs (✅ 2373 modules)
```

---

**Bon test! 🚀**
