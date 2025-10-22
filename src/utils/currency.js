// Format prices in CFA francs (XOF)
export function formatCFA(amount) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(num) {
  return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0 }).format(num)
}
