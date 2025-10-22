import { createContext, useContext, useState, useEffect } from 'react'

const ShopsContext = createContext()

export function ShopsProvider({ children }) {
  const [shopsStatus, setShopsStatus] = useState(() => {
    try {
      const stored = localStorage.getItem('shops-status')
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })

  const [warnings, setWarnings] = useState(() => {
    try {
      const stored = localStorage.getItem('shop-warnings')
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem('shops-status', JSON.stringify(shopsStatus))
  }, [shopsStatus])

  useEffect(() => {
    localStorage.setItem('shop-warnings', JSON.stringify(warnings))
  }, [warnings])

  // Obtenir le statut d'une boutique
  const getShopStatus = (shopId) => {
    return shopsStatus[shopId] || 'pending'
  }

  // Mettre à jour le statut d'une boutique
  const updateShopStatus = (shopId, status, reason = '') => {
    // Statuts: 'pending', 'validated', 'blocked', 'banned'
    setShopsStatus(prev => ({
      ...prev,
      [shopId]: {
        status,
        reason,
        updatedAt: new Date().toISOString(),
      }
    }))
  }

  // Valider une boutique (admin)
  const validateShop = (shopId) => {
    updateShopStatus(shopId, 'validated')
  }

  // Bloquer une boutique (admin)
  const blockShop = (shopId, reason = 'Violation des conditions d\'utilisation') => {
    updateShopStatus(shopId, 'blocked', reason)
  }

  // Débloquer une boutique (admin)
  const unblockShop = (shopId) => {
    updateShopStatus(shopId, 'validated')
  }

  // Interdire définitivement une boutique (admin)
  const banShop = (shopId, reason = 'Violation grave des conditions d\'utilisation') => {
    updateShopStatus(shopId, 'banned', reason)
  }

  // Envoyer un avertissement au propriétaire de boutique (admin)
  const warnVendor = (shopId, vendorEmail, message, severity = 'warning') => {
    // severity: 'warning', 'caution', 'critical'
    const warningId = `warn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    setWarnings(prev => ({
      ...prev,
      [shopId]: [
        ...(prev[shopId] || []),
        {
          id: warningId,
          vendor: vendorEmail,
          message,
          severity,
          createdAt: new Date().toISOString(),
          read: false,
        }
      ]
    }))
    
    return warningId
  }

  // Obtenir les avertissements d'une boutique
  const getShopWarnings = (shopId) => {
    return warnings[shopId] || []
  }

  // Marquer un avertissement comme lu
  const markWarningAsRead = (shopId, warningId) => {
    setWarnings(prev => ({
      ...prev,
      [shopId]: (prev[shopId] || []).map(w =>
        w.id === warningId ? { ...w, read: true } : w
      )
    }))
  }

  // Obtenir les boutiques par statut
  const getShopsByStatus = (status) => {
    return Object.entries(shopsStatus)
      .filter(([_, data]) => data.status === status)
      .map(([shopId, data]) => ({ shopId, ...data }))
  }

  // Obtenir les boutiques validées
  const getValidatedShops = () => {
    return Object.entries(shopsStatus)
      .filter(([_, data]) => data.status === 'validated')
      .map(([shopId]) => shopId)
  }

  // Obtenir toutes les boutiques en attente
  const getPendingShops = () => {
    return Object.entries(shopsStatus)
      .filter(([_, data]) => data.status === 'pending')
      .map(([shopId]) => shopId)
  }

  // Obtenir les boutiques bloquées
  const getBlockedShops = () => {
    return Object.entries(shopsStatus)
      .filter(([_, data]) => data.status === 'blocked')
      .map(([shopId]) => shopId)
  }

  // Obtenir les boutiques bannies
  const getBannedShops = () => {
    return Object.entries(shopsStatus)
      .filter(([_, data]) => data.status === 'banned')
      .map(([shopId]) => shopId)
  }

  return (
    <ShopsContext.Provider value={{
      shopsStatus,
      warnings,
      getShopStatus,
      updateShopStatus,
      validateShop,
      blockShop,
      unblockShop,
      banShop,
      warnVendor,
      getShopWarnings,
      markWarningAsRead,
      getShopsByStatus,
      getValidatedShops,
      getPendingShops,
      getBlockedShops,
      getBannedShops,
    }}>
      {children}
    </ShopsContext.Provider>
  )
}

export function useShops() {
  const ctx = useContext(ShopsContext)
  if (!ctx) throw new Error('useShops must be used within ShopsProvider')
  return ctx
}
