import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import MainLayout from './layouts/MainLayout.jsx'
import AuthLayout from './layouts/AuthLayout.jsx'
import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Sellers from './pages/Sellers.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import DashboardSeller from './pages/DashboardSeller.jsx'
import DashboardCustomer from './pages/DashboardCustomer.jsx'
import DashboardAdmin from './pages/DashboardAdmin.jsx'
import CreateShop from './pages/CreateShop.jsx'
import ShopDetail from './pages/ShopDetail.jsx'
import Shops from './pages/Shops.jsx'
import Favorites from './pages/Favorites.jsx'
import VendorProfile from './pages/VendorProfile.jsx'
import Invoice from './pages/Invoice.jsx'
import Auth from './pages/Auth.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { FavoritesProvider } from './context/FavoritesContext.jsx'
import { OrdersProvider } from './context/OrdersContext.jsx'
import { ShopsProvider } from './context/ShopsContext.jsx'
import { SubscriptionsProvider } from './context/SubscriptionsContext.jsx'
import { StatsProvider } from './context/StatsContext.jsx'
import { ShopsDataProvider } from './context/ShopsDataContext.jsx'
import { ToastProvider } from './components/Toast.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import { useAuth } from './context/AuthContext.jsx'
import { useShopsData } from './context/ShopsDataContext.jsx'

export default function App(){
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <OrdersProvider>
            <ShopsProvider>
              <SubscriptionsProvider>
                <ShopsDataProvider>
                  <StatsProvider>
                    <ToastProvider>
                      <AppContent />
                    </ToastProvider>
                  </StatsProvider>
                </ShopsDataProvider>
              </SubscriptionsProvider>
            </ShopsProvider>
          </OrdersProvider>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  )
}

// Component qui charge les boutiques du user quand il est connecté
function AppContent() {
  const { user, updateUser } = useAuth()
  const { getShopsForUser } = useShopsData()

  useEffect(() => {
    if (user && user.role === 'vendor' && !user.shopId) {
      // Si vendor sans shopId, charger ses boutiques
      const shops = getShopsForUser(user.id)
      if (shops.length > 0) {
        // Assigner la première boutique
        updateUser({ shopId: shops[0].id })
      }
    }
  }, [user, getShopsForUser, updateUser])

  return (
    <Routes>
      <Route element={<MainLayout />}> 
        <Route index element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/sellers" element={<Sellers />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard/seller" element={<DashboardSeller />} />
        <Route path="/dashboard/customer" element={<DashboardCustomer />} />
        <Route path="/dashboard/admin" element={<ProtectedRoute requiredRole="admin"><DashboardAdmin /></ProtectedRoute>} />
        <Route path="/create-shop" element={<DashboardSeller />} />
        <Route path="/shop/:id" element={<ShopDetail />} />
        <Route path="/vendor/:id" element={<VendorProfile />} />
        <Route path="/shops" element={<Shops />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/invoice" element={<Invoice />} />
      </Route>
      <Route element={<AuthLayout />}> 
        <Route path="/auth" element={<Auth />} />
      </Route>
    </Routes>
  )
}