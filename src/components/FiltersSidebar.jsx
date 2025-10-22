import { CATEGORIES } from '../utils/constants'

export default function FiltersSidebar({ values, onChange }){
  return (
    <aside className="card p-4 sticky top-24 h-fit">
      <h4 className="font-semibold mb-3">Filtres</h4>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Catégorie</label>
          <select className="input w-full mt-1" value={values.category} onChange={e=>onChange({ ...values, category: e.target.value })}>
            <option value="">Toutes</option>
            {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Prix max (€)</label>
          <input type="number" className="input w-full mt-1" value={values.maxPrice ?? ''} onChange={e=>onChange({ ...values, maxPrice: e.target.value ? Number(e.target.value) : undefined })} />
        </div>
        <div className="flex items-center gap-2">
          <input id="available" type="checkbox" className="w-4 h-4" checked={values.inStock || false} onChange={e=>onChange({ ...values, inStock: e.target.checked })} />
          <label htmlFor="available" className="text-sm">En stock uniquement</label>
        </div>
      </div>
    </aside>
  )
}
