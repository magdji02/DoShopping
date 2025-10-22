import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import CartDrawer from '../components/CartDrawer.jsx'

export default function MainLayout(){
  return (
    <div className="min-h-screen flex flex-col bg-lightgray text-softblack">
      <Navbar />
      <CartDrawer />
      <main className="flex-1"> 
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
