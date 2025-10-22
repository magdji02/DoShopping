const TESTIMONIALS = [
  { id: 1, name: 'Aïcha', text: 'Je vends plus facilement et je gère mes commandes en quelques clics.' },
  { id: 2, name: 'Moussa', text: 'Une expérience d’achat fluide et rapide, j’adore la simplicité.' },
  { id: 3, name: 'Fatou', text: 'Excellent support et de belles fonctionnalités pour les vendeurs.' },
]

export default function Testimonials(){
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-display font-semibold mb-6">Témoignages</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {TESTIMONIALS.map(t => (
          <div key={t.id} className="card p-6 animate-fade-in-up">
            <p className="text-gray-700 mb-3">“{t.text}”</p>
            <p className="font-medium">— {t.name}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
