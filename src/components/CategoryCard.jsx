export default function CategoryCard({ icon, name }){
  return (
    <div className="min-w-[160px] card p-4 flex items-center gap-3 hover:scale-[1.02]">
      <span className="text-2xl" aria-hidden>{icon}</span>
      <span className="font-medium">{name}</span>
    </div>
  )
}
