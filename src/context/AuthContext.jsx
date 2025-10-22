import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }){
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('auth-user')) || null }
    catch { return null }
  })

  useEffect(() => {
    localStorage.setItem('auth-user', JSON.stringify(user))
  }, [user])

  const login = (userData) => {
    // userData = { email, password, name, role: 'customer' | 'vendor' | 'admin' }
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: userData.name || userData.email.split('@')[0],
      email: userData.email,
      role: userData.role || 'customer', // 'customer', 'vendor', 'admin'
      createdAt: new Date().toISOString(),
      isVerified: userData.role === 'admin' ? true : false, // Admin auto-verified
      shopId: userData.shopId || null, // Pour les vendors
      permissions: getPermissionsByRole(userData.role || 'customer'),
    }
    setUser(newUser)
    return newUser
  }

  const logout = () => setUser(null)

  const updateUser = (updates) => {
    setUser(prev => prev ? { ...prev, ...updates } : null)
  }

  const hasPermission = (permission) => {
    if (!user) return false
    return user.permissions?.includes(permission) || false
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, hasPermission }}>
      {children}
    </AuthContext.Provider>
  )
}

// Permissions par rôle
function getPermissionsByRole(role) {
  const permissions = {
    customer: [
      'view_products',
      'add_to_cart',
      'create_order',
      'view_own_orders',
      'view_own_profile',
      'view_vendor_profiles',
      'subscribe_vendor',
    ],
    vendor: [
      'view_products',
      'create_product',
      'edit_own_products',
      'delete_own_products',
      'create_shop',
      'edit_own_shop',
      'view_own_orders',
      'view_own_profile',
      'view_sales_analytics',
      'manage_inventory',
    ],
    admin: [
      'view_all_products',
      'create_product',
      'edit_any_product',
      'delete_any_product',
      'view_all_shops',
      'validate_shop',
      'block_shop',
      'unblock_shop',
      'ban_shop',
      'warn_vendor',
      'view_all_orders',
      'view_all_users',
      'manage_users',
      'view_analytics',
      'manage_reports',
    ],
  }
  return permissions[role] || permissions.customer
}

export function useAuth(){
  const ctx = useContext(AuthContext)
  if(!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

// Hook pour vérifier les permissions
export function usePermission(permission) {
  const { hasPermission } = useAuth()
  return hasPermission(permission)
}

// Hook pour vérifier le rôle
export function useRole(expectedRole) {
  const { user } = useAuth()
  return user?.role === expectedRole
}

