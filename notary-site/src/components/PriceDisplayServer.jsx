// Server Component pour afficher les prix
// Pas de 'use client' - rendu 100% côté serveur

export default function PriceDisplayServer({ price, showFrom = false, className = '', perDocumentText = 'per document' }) {
  // Format prix simplifié côté serveur (EUR par défaut)
  const formatPrice = (amount) => {
    if (typeof amount !== 'number') {
      amount = parseFloat(amount) || 0
    }
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className={className}>
      {showFrom && <span className="text-sm text-gray-500 mr-1">From</span>}
      <span>{formatPrice(price)}</span>
      {perDocumentText && <span className="text-sm text-gray-500 ml-1">/ {perDocumentText}</span>}
    </div>
  )
}

