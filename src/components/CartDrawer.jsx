import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { formatCFA } from '../utils/api'

export default function CartDrawer(){
  const [open, setOpen] = useState(false)
  const { items, subtotal, removeItem, updateQty, clear } = useCart()

  useEffect(() => {
    const handler = () => setOpen(v => !v)
    document.addEventListener('toggle-cart', handler)
    return () => document.removeEventListener('toggle-cart', handler)
  }, [])

  return (
    <div aria-hidden={!open} className={`fixed inset-0 z-40 ${open? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-black/30 transition-opacity ${open? 'opacity-100' : 'opacity-0'}`} onClick={()=>setOpen(false)} />
      <aside className={`absolute right-0 top-0 h-full w-full max-w-md bg-pure shadow-xl p-4 transition-transform duration-300 ${open? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Votre panier</h3>
          <button onClick={()=>setOpen(false)} className="text-sm underline">Fermer</button>
        </div>
        <div className="space-y-3 max-h-[65vh] overflow-auto pr-1">
          {items.length===0 && <p className="text-sm text-gray-500">Aucun article.</p>}
          {items.map(it => (
            <div key={it.id} className="flex gap-3 items-center">
              <img src={it.thumbnail || it.image} alt={it.name} className="w-16 h-16 rounded-lg object-cover"/>
              <div className="flex-1">
                <p className="font-medium line-clamp-1">{it.name}</p>
                <p className="text-sm text-gray-600">{formatCFA(it.price)}</p>
                <div className="flex items-center gap-2 mt-1">
                  <button className="px-2 py-1 rounded bg-lightgray" onClick={()=>updateQty(it.id, it.qty-1)}>-</button>
                  <span className="text-sm">{it.qty}</span>
                  <button className="px-2 py-1 rounded bg-lightgray" onClick={()=>updateQty(it.id, it.qty+1)}>+</button>
                </div>
              </div>
              <button className="text-xs text-softred underline" onClick={()=>removeItem(it.id)}>Retirer</button>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Sous-total</span>
            <span className="font-semibold">{formatCFA(subtotal)}</span>
          </div>
          <div className="flex gap-2">
            <button className="btn-primary bg-white text-royal border border-royal flex-1" onClick={clear}>Vider</button>
            <button className="btn-accent flex-1">Commander</button>
          </div>
        </div>
      </aside>
    </div>
  )
}
