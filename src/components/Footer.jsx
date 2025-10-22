import { Link } from 'react-router-dom'

export default function Footer(){
  return (
    <footer className="bg-royal text-white mt-8">
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
        <div>
          <h4 className="font-display font-semibold text-lg mb-2">Do Shopping</h4>
          <p className="text-white/80 text-sm">La plateforme multi-vendeur moderne pour vendre et acheter facilement.</p>
        </div>
        <div>
          <h5 className="font-semibold mb-2">Liens rapides</h5>
          <ul className="space-y-1 text-white/90 text-sm">
            <li><Link to="/products" className="hover:underline">Produits</Link></li>
            <li><Link to="/sellers" className="hover:underline">Vendeurs</Link></li>
            <li><Link to="/about" className="hover:underline">À propos</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold mb-2">Suivez-nous</h5>
          <div className="flex gap-3 text-white/90 text-sm">
            <a href="#" aria-label="Facebook" className="hover:underline">Facebook</a>
            <a href="#" aria-label="Instagram" className="hover:underline">Instagram</a>
            <a href="#" aria-label="Twitter" className="hover:underline">X</a>
          </div>
        </div>
      </div>
      <div className="text-center text-white/80 text-xs py-4 border-t border-white/20">© {new Date().getFullYear()} Do Shopping</div>
    </footer>
  )
}
