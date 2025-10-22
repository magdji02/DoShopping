export default function SellerCard({ seller }){
  return (
    <div className="min-w-[240px] card p-4 flex items-center gap-3">
      <img src={seller.avatar} alt={seller.name} className="w-12 h-12 rounded-full object-cover" loading="lazy"/>
      <div>
        <p className="font-medium">{seller.name}</p>
        <p className="text-xs text-gray-500">{seller.category} • ⭐ {seller.rating}</p>
      </div>
    </div>
  )
}
