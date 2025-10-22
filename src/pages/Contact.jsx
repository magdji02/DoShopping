export default function Contact(){
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-display font-semibold mb-4">Contact</h1>
      <form className="card p-4 grid gap-3">
        <input className="input" placeholder="Nom"/>
        <input className="input" placeholder="Email"/>
        <textarea className="input h-32" placeholder="Message"/>
        <button className="btn-accent w-fit">Envoyer</button>
      </form>
    </div>
  )
}
