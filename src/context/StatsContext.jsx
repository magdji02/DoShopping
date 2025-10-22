import { createContext, useContext, useState, useEffect } from 'react'

const StatsContext = createContext()

export function StatsProvider({ children }) {
  const [shopVisits, setShopVisits] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('shop-visits')) || {}
    } catch {
      return {}
    }
  })

  // Persist to localStorage whenever shopVisits changes
  useEffect(() => {
    localStorage.setItem('shop-visits', JSON.stringify(shopVisits))
  }, [shopVisits])

  /**
   * Track a visit to a shop
   * @param {string} shopId - The seller/shop ID
   */
  const recordShopVisit = (shopId) => {
    setShopVisits(prev => ({
      ...prev,
      [shopId]: (prev[shopId] || 0) + 1
    }))
  }

  /**
   * Get the number of visits for a specific shop
   * @param {string} shopId - The seller/shop ID
   * @returns {number} Number of visits
   */
  const getShopVisitCount = (shopId) => {
    return shopVisits[shopId] || 0
  }

  /**
   * Get all shop visits
   * @returns {object} Object with shopId -> visitCount mapping
   */
  const getAllShopVisits = () => {
    return shopVisits
  }

  /**
   * Reset visits for testing purposes
   */
  const resetVisits = () => {
    setShopVisits({})
  }

  const value = {
    shopVisits,
    recordShopVisit,
    getShopVisitCount,
    getAllShopVisits,
    resetVisits
  }

  return (
    <StatsContext.Provider value={value}>
      {children}
    </StatsContext.Provider>
  )
}

export function useStats() {
  const ctx = useContext(StatsContext)
  if (!ctx) throw new Error('useStats must be used within StatsProvider')
  return ctx
}
