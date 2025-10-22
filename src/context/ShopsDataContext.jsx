import { createContext, useContext, useState, useEffect } from 'react'

const ShopsDataContext = createContext()

export function ShopsDataProvider({ children }) {
  const [userShops, setUserShops] = useState(() => {
    try {
      const stored = localStorage.getItem('user-shops')
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })

  // Persister dans localStorage quand userShops change
  useEffect(() => {
    localStorage.setItem('user-shops', JSON.stringify(userShops))
  }, [userShops])

  // Créer une nouvelle boutique
  const createShop = (vendorId, shopData) => {
    const shopId = `shop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const newShop = {
      id: shopId,
      vendorId,
      name: shopData.shopName,
      slug: shopData.shopSlug,
      description: shopData.description,
      tagline: shopData.tagline || '',
      category: shopData.category || [],
      address: shopData.address,
      phone: shopData.phone,
      email: shopData.email,
      facebook: shopData.facebook || '',
      instagram: shopData.instagram || '',
      tiktok: shopData.tiktok || '',
      website: shopData.website || '',
      logo: shopData.logoPreview || null,
      banner: shopData.bannerPreview || null,
      createdAt: new Date().toISOString(),
      status: 'pending', // Nécessite validation admin
      rating: 5.0,
      reviews: 0,
    }

    setUserShops(prev => ({
      ...prev,
      [vendorId]: [...(prev[vendorId] || []), newShop]
    }))

    return shopId
  }

  // Obtenir toutes les boutiques d'un vendor
  const getShopsForUser = (vendorId) => {
    return userShops[vendorId] || []
  }

  // Obtenir une boutique spécifique
  const getShopById = (shopId) => {
    for (const vendorShops of Object.values(userShops)) {
      const shop = vendorShops.find(s => s.id === shopId)
      if (shop) return shop
    }
    return null
  }

  // Obtenir une boutique par slug
  const getShopBySlug = (slug) => {
    for (const vendorShops of Object.values(userShops)) {
      const shop = vendorShops.find(s => s.slug === slug)
      if (shop) return shop
    }
    return null
  }

  // Mettre à jour une boutique
  const updateShop = (shopId, updates) => {
    setUserShops(prev => {
      const newShops = { ...prev }
      for (const vendorId in newShops) {
        newShops[vendorId] = newShops[vendorId].map(shop =>
          shop.id === shopId ? { ...shop, ...updates } : shop
        )
      }
      return newShops
    })
  }

  // Supprimer une boutique
  const deleteShop = (vendorId, shopId) => {
    setUserShops(prev => ({
      ...prev,
      [vendorId]: prev[vendorId].filter(s => s.id !== shopId)
    }))
  }

  // Obtenir la première boutique d'un vendor (pour les vendors avec une seule boutique)
  const getFirstShopForUser = (vendorId) => {
    const shops = userShops[vendorId]
    return shops && shops.length > 0 ? shops[0] : null
  }

  // Obtenir toutes les boutiques (pour admin)
  const getAllShops = () => {
    const allShops = []
    for (const vendorShops of Object.values(userShops)) {
      allShops.push(...vendorShops)
    }
    return allShops
  }

  return (
    <ShopsDataContext.Provider value={{
      userShops,
      createShop,
      getShopsForUser,
      getShopById,
      getShopBySlug,
      updateShop,
      deleteShop,
      getFirstShopForUser,
      getAllShops,
    }}>
      {children}
    </ShopsDataContext.Provider>
  )
}

export function useShopsData() {
  const ctx = useContext(ShopsDataContext)
  if (!ctx) throw new Error('useShopsData must be used within ShopsDataProvider')
  return ctx
}
