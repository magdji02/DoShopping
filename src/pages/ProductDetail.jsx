import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchProductById, fetchSimilarProducts } from '../utils/api'
import ProductDetails from '../components/ProductDetails'
import Reviews from '../components/Reviews'
import ProductCard from '../components/ProductCard'

export default function ProductDetail(){
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [similar, setSimilar] = useState([])

  useEffect(() => {
    (async () => {
      const p = await fetchProductById(id)
      setProduct(p)
      if(p){
        const s = await fetchSimilarProducts(p.category, p.id)
        setSimilar(s)
      }
    })()
  }, [id])

  if(!product) return <div className="max-w-7xl mx-auto px-4 py-8">Produit introuvable.</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <ProductDetails product={product} />

      <section>
        <h2 className="text-xl font-display font-semibold mb-4">Avis clients</h2>
        <Reviews productId={product.id} productName={product.name} />
      </section>

      <section>
        <h2 className="text-xl font-display font-semibold mb-4">Produits similaires</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {similar.map(p => <ProductCard key={p.id} product={p}/>) }
        </div>
      </section>
    </div>
  )
}
