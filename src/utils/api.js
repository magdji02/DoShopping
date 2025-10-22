import { PRODUCTS, SELLERS } from './constants'

const delay = (ms=500) => new Promise(r => setTimeout(r, ms))

export function formatCFA(value) {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value).replace('XOF', 'F CFA')
}

export async function fetchProducts({ q = '', category = '', page = 1, limit = 9 } = {}){
  await delay(400)
  let list = PRODUCTS
  if(q) list = list.filter(p => p.name.toLowerCase().includes(q.toLowerCase()))
  if(category) list = list.filter(p => p.category === category)
  const start = (page-1)*limit
  const slice = list.slice(start, start+limit)
  return { items: slice, total: list.length }
}

export async function fetchProductById(id){
  await delay(300)
  return PRODUCTS.find(p => p.id === id)
}

export async function fetchSimilarProducts(category, excludeId){
  await delay(300)
  return PRODUCTS.filter(p => p.category === category && p.id !== excludeId).slice(0, 6)
}

export async function fetchSellers(){
  await delay(300)
  return SELLERS
}
