import { useState } from 'react'
import { useToast } from './Toast'

export default function Newsletter(){
  const [email, setEmail] = useState('')
  const { push } = useToast()
  const submit = (e) => { e.preventDefault(); push('success', 'Merci ! Vous recevrez nos nouveautés.'); setEmail('') }
  return (
    <section className="bg-pure">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h3 className="text-xl font-display font-semibold mb-2">Recevoir les nouveautés</h3>
          <p className="text-gray-600">Inscrivez-vous à notre newsletter pour les promos et nouveautés.</p>
        </div>
        <form onSubmit={submit} className="flex gap-2">
          <input type="email" required placeholder="Votre email" value={email} onChange={e=>setEmail(e.target.value)} className="input flex-1" />
          <button className="btn-accent">S'abonner</button>
        </form>
      </div>
    </section>
  )
}
