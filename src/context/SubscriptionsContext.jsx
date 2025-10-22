import { createContext, useContext, useState, useEffect } from 'react'

const SubscriptionsContext = createContext()

export function SubscriptionsProvider({ children }) {
  const [subscriptions, setSubscriptions] = useState(() => {
    try {
      const stored = localStorage.getItem('shop-subscriptions')
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem('shop-subscriptions', JSON.stringify(subscriptions))
  }, [subscriptions])

  // S'abonner à une boutique
  const subscribe = (userId, shopId) => {
    setSubscriptions(prev => {
      const userSubs = prev[userId] || []
      if (!userSubs.includes(shopId)) {
        return {
          ...prev,
          [userId]: [...userSubs, shopId]
        }
      }
      return prev
    })
  }

  // Se désabonner d'une boutique
  const unsubscribe = (userId, shopId) => {
    setSubscriptions(prev => ({
      ...prev,
      [userId]: (prev[userId] || []).filter(id => id !== shopId)
    }))
  }

  // Vérifier si l'utilisateur est abonné à une boutique
  const isSubscribed = (userId, shopId) => {
    return (subscriptions[userId] || []).includes(shopId)
  }

  // Obtenir les abonnements d'un utilisateur
  const getUserSubscriptions = (userId) => {
    return subscriptions[userId] || []
  }

  // Obtenir les abonnés d'une boutique
  const getShopSubscribers = (shopId) => {
    return Object.entries(subscriptions)
      .filter(([_, subs]) => subs.includes(shopId))
      .map(([userId]) => userId)
  }

  // Compter les abonnés d'une boutique
  const getSubscriberCount = (shopId) => {
    return getShopSubscribers(shopId).length
  }

  return (
    <SubscriptionsContext.Provider value={{
      subscriptions,
      subscribe,
      unsubscribe,
      isSubscribed,
      getUserSubscriptions,
      getShopSubscribers,
      getSubscriberCount,
    }}>
      {children}
    </SubscriptionsContext.Provider>
  )
}

export function useSubscriptions() {
  const ctx = useContext(SubscriptionsContext)
  if (!ctx) throw new Error('useSubscriptions must be used within SubscriptionsProvider')
  return ctx
}
