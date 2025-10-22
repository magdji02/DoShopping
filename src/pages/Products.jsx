import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import FiltersSidebar from '../components/FiltersSidebar'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'
import { fetchProducts } from '../utils/api'

export default function Products(){
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const [filters, setFilters] = useState({ category: '', inStock: false, maxPrice: undefined })
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({ items: [], total: 0 })

  useEffect(() => {
    (async () => {
      setLoading(true)
      const res = await fetchProducts({ q, category: filters.category, page, limit: 9 })
      const filtered = res.items.filter(p => (filters.inStock ? p.stock>0 : true) && (filters.maxPrice? p.price <= filters.maxPrice : true))
      setData({ items: filtered, total: res.total })
      setLoading(false)
    })()
  }, [q, filters, page])

  const pages = useMemo(() => Math.ceil(data.total / 9) || 1, [data.total])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-[280px_1fr] gap-6">
      <FiltersSidebar values={filters} onChange={setFilters} />
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-display font-semibold">Tous les produits</h1>
          <p className="text-sm text-gray-600">{data.total} résultats</p>
        </div>
        {loading ? (
          <Loader rows={9} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.items.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        <div className="flex items-center justify-center gap-2 mt-6">
          <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="btn-primary bg-white text-royal border border-royal disabled:opacity-50">Précédent</button>
          <span className="text-sm">Page {page} / {pages}</span>
          <button disabled={page>=pages} onClick={()=>setPage(p=>p+1)} className="btn-accent disabled:opacity-50">Suivant</button>
        </div>
      </div>
    </div>
  )
}
