import { useEffect, useState } from 'react'
import { fetchSellers } from '../utils/api'
import SellerCard from '../components/SellerCard'

export default function Sellers(){
  const [sellers, setSellers] = useState([])
  useEffect(()=>{ (async()=> setSellers(await fetchSellers()))() }, [])
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-xl font-display font-semibold mb-4">Vendeurs</h1>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {sellers.map(s => <SellerCard key={s.id} seller={s} />)}
      </div>
    </div>
  )
}
