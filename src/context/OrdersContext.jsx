import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

const OrdersContext = createContext()

export function OrdersProvider({ children }){
  const { user } = useAuth()
  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('orders')) || [] }
    catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders))
  }, [orders])

  const createOrder = (items, total, shippingAddress) => {
    if (!user) {
      throw new Error('User must be logged in to create an order')
    }

    const order = {
      id: `#${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      items: items,
      subtotal: total,
      shippingCost: 0,
      tax: Math.round(total * 0.05),
      total: total + Math.round(total * 0.05),
      shippingAddress: shippingAddress,
      status: 'En attente',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }

    setOrders(prev => [order, ...prev])
    return order
  }

  const getUserOrders = () => {
    if (!user) return []
    return orders.filter(order => order.userId === user.id)
  }

  const updateOrderStatus = (orderId, status) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ))
  }

  const value = { orders, createOrder, getUserOrders, updateOrderStatus }
  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export function useOrders(){
  const ctx = useContext(OrdersContext)
  if(!ctx) throw new Error('useOrders must be used within OrdersProvider')
  return ctx
}
