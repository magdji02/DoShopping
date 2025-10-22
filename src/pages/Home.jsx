import HeroSection from '../components/HeroSection'
import CategoryCard from '../components/CategoryCard'
import ProductCard from '../components/ProductCard'
import SellerCard from '../components/SellerCard'
import ShopsCarousel from '../components/ShopsCarousel'
import Testimonials from '../components/Testimonials'
import Newsletter from '../components/Newsletter'
import { CATEGORIES } from '../utils/constants'
import { fetchProducts, fetchSellers } from '../utils/api'
import { useEffect, useState } from 'react'
import Loader from '../components/Loader'

export default function Home(){
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [sellers, setSellers] = useState([])

  useEffect(() => {
    (async () => {
      setLoading(true)
      const [{ items }, s] = await Promise.all([
        fetchProducts({ limit: 8 }),
        fetchSellers(),
      ])
      setProducts(items)
      setSellers(s)
      setLoading(false)
    })()
  }, [])

  return (
    <div>
      <HeroSection />

      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-display font-semibold mb-4">Catégories populaires</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {CATEGORIES.map(c => <CategoryCard key={c.id} icon={c.icon} name={c.name} />)}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-4">
        <h2 className="text-2xl font-display font-semibold mb-4">Produits tendances</h2>
        {loading ? <Loader rows={6}/> : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-display font-semibold mb-4">Vendeurs à la une</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {sellers.map(s => <SellerCard key={s.id} seller={s} />)}
        </div>
      </section>

      <ShopsCarousel />

      <Testimonials />
      <Newsletter />
    </div>
  )
}
