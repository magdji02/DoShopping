export default function Loader({ rows = 6 }){
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: rows }).map((_,i) => (
        <div key={i} className="card overflow-hidden">
          <div className="aspect-square shimmer animate-shimmer"/>
          <div className="p-4 space-y-2">
            <div className="h-4 w-2/3 bg-gray-200 rounded"/>
            <div className="h-4 w-1/3 bg-gray-200 rounded"/>
          </div>
        </div>
      ))}
    </div>
  )
}
