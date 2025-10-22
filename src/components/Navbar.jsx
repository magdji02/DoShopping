import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { MagnifyingGlassIcon, HeartIcon, ShoppingCartIcon, Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { PRODUCTS } from '../utils/constants'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { formatCFA } from '../utils/api'

export default function Navbar(){
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { count } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 1024)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const suggestions = useMemo(() => {
    if(!q) return []
    return PRODUCTS.filter(p => p.name.toLowerCase().includes(q.toLowerCase())).slice(0,5)
  }, [q])

  const submit = (e) => {
    e.preventDefault()
    navigate(`/products?q=${encodeURIComponent(q)}`)
    setQ('')
  }

  const links = [
    { to: '/', label: '🏠 Accueil' },
    { to: '/products', label: '🛍️ Produits' },
    { to: '/sellers', label: '🏪 Vendeurs' },
    { to: '/about', label: 'À propos' },
    { to: '/contact', label: '📞 Contact' },
  ]

  const shopLink = { to: '/create-shop', label: '✨ Créer ma boutique' }

  return (
    <header className="sticky top-0 z-50 bg-pure/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-xl hover:bg-gray-100" onClick={() => setOpen(v => !v)} aria-label="Menu">
              {open ? <XMarkIcon className="w-6 h-6"/> : <Bars3Icon className="w-6 h-6"/>}
            </button>
            <Link to="/" className="text-royal font-display font-bold text-xl">Do Shopping</Link>
          </div>

          {!mobile && (
            <nav className="hidden lg:flex items-center gap-6">
              {links.map(l => (
                <NavLink key={l.to} to={l.to} className={({isActive}) => `text-sm font-medium hover:text-royal transition ${isActive? 'text-royal' : 'text-gray-700'}`}>{l.label}</NavLink>
              ))}
              <Link to={shopLink.to} className="text-sm font-semibold px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all transform hover:scale-105">
                {shopLink.label}
              </Link>
            </nav>
          )}

          <form onSubmit={submit} className="relative flex-1 max-w-xl hidden md:block">
            <div className="flex items-center gap-2 bg-lightgray rounded-xl px-3 py-2">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-500"/>
              <input aria-label="Recherche" className="bg-transparent focus:outline-none w-full" placeholder="🔍 Rechercher des produits..." value={q} onChange={e=>setQ(e.target.value)} />
            </div>
            {suggestions.length>0 && (
              <div className="absolute mt-2 w-full bg-pure rounded-xl shadow-lg p-2 z-50">
                {suggestions.map(s => (
                  <Link key={s.id} to={`/products/${s.id}`} className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-sm">{s.name} — {formatCFA(s.price)}</Link>
                ))}
              </div>
            )}
          </form>

          <div className="flex items-center gap-2">
            <Link to="/favorites" className="p-2 rounded-xl hover:bg-gray-100 transition-all" title="Favoris"><HeartIcon className="w-6 h-6"/></Link>
            <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-all" title="Panier" onClick={()=>document.dispatchEvent(new CustomEvent('toggle-cart'))}>
              <ShoppingCartIcon className="w-6 h-6"/>
              {count>0 && (<span className="absolute -top-1 -right-1 bg-gold text-[10px] px-1.5 py-0.5 rounded-full font-bold">{count}</span>)}
            </button>
            
            {/* User Menu */}
            {user ? (
              <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-50 transition-all"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium hidden sm:inline">{user.name}</span>
                  </button>                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                      <p className="text-sm font-bold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                      <span className="inline-block mt-2 px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                        {user.type === 'customer' ? '👤 Client' : user.type === 'vendor' ? '🏪 Vendeur' : '👨‍💼 Admin'}
                      </span>
                    </div>
                    <nav className="p-2 space-y-1">
                      {user.type === 'customer' && (
                        <>
                          <Link to="/dashboard/customer" className="block px-3 py-2 rounded-lg hover:bg-blue-50 text-sm font-medium text-gray-700">👤 Mon Compte</Link>
                          <Link to="/invoice" className="block px-3 py-2 rounded-lg hover:bg-blue-50 text-sm font-medium text-gray-700">📋 Mes Factures</Link>
                          <Link to="/dashboard/customer" className="block px-3 py-2 rounded-lg hover:bg-blue-50 text-sm font-medium text-gray-700">📦 Mes Commandes</Link>
                          <Link to="/favorites" className="block px-3 py-2 rounded-lg hover:bg-blue-50 text-sm font-medium text-gray-700">❤️ Mes Favoris</Link>
                        </>
                      )}
                      {user.type === 'vendor' && (
                        <>
                          <Link to="/dashboard/seller" className="block px-3 py-2 rounded-lg hover:bg-blue-50 text-sm font-medium text-gray-700">🏪 Mon Magasin</Link>
                          <Link to="/dashboard/seller" className="block px-3 py-2 rounded-lg hover:bg-blue-50 text-sm font-medium text-gray-700">📦 Mes Produits</Link>
                          <Link to="/create-shop" className="block px-3 py-2 rounded-lg hover:bg-blue-50 text-sm font-medium text-gray-700">✨ Créer Boutique</Link>
                        </>
                      )}
                      {user.type === 'admin' && (
                        <>
                          <Link to="/dashboard/admin" className="block px-3 py-2 rounded-lg hover:bg-blue-50 text-sm font-semibold text-blue-600">📊 Tableau de Bord</Link>
                          <Link to="/dashboard/admin" className="block px-3 py-2 rounded-lg hover:bg-blue-50 text-sm font-medium text-gray-700">🏪 Gestion Boutiques</Link>
                        </>
                      )}
                    </nav>
                    <button
                      onClick={() => {
                        logout()
                        setUserMenuOpen(false)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-semibold border-t border-gray-100"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/auth" className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-semibold text-sm transition-all">
                  Se connecter
                </Link>
                <Link to="/auth" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold text-sm transition-all transform hover:scale-105 shadow-md">
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {mobile && open && (
        <div className="lg:hidden border-t border-gray-100 bg-pure">
          <div className="p-4 space-y-3">
            <form onSubmit={submit} className="relative">
              <div className="flex items-center gap-2 bg-lightgray rounded-xl px-3 py-2">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-500"/>
                <input aria-label="Recherche" className="bg-transparent focus:outline-none w-full" placeholder="🔍 Rechercher..." value={q} onChange={e=>setQ(e.target.value)} />
              </div>
            </form>
            <nav className="grid gap-2">
              {links.map(l => (
                <NavLink key={l.to} to={l.to} className={({isActive}) => `px-3 py-2 rounded-lg ${isActive? 'bg-lightgray text-royal' : 'hover:bg-gray-50'}`} onClick={()=>setOpen(false)}>{l.label}</NavLink>
              ))}
              <NavLink to={shopLink.to} className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold transition-all" onClick={()=>setOpen(false)}>
                {shopLink.label}
              </NavLink>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
