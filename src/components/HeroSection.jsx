import { Link } from 'react-router-dom'

export default function HeroSection(){
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop" alt="Vendeurs et produits" className="w-full h-full object-cover" loading="lazy"/>
        <div className="absolute inset-0 bg-royal/70 mix-blend-multiply" />
      </div>
      <div className="max-w-7xl mx-auto px-4 py-28 text-center text-white">
        <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">Créez votre boutique, vendez, encaissez.</h1>
        <p className="max-w-2xl mx-auto text-white/90 mb-8">La plateforme e-commerce multi-vendeur pensée pour la simplicité et la croissance.</p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/dashboard/seller" className="btn-accent">Créer ma boutique</Link>
          <Link to="/products" className="btn-primary bg-white text-royal hover:brightness-105">Explorer les produits</Link>
        </div>
      </div>
    </section>
  )
}
