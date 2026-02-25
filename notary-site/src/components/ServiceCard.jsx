'use client'

import { memo } from 'react'
import Link from 'next/link'
import PriceDisplay from './PriceDisplay'

/**
 * Carte de service compacte - style page online-notary-service.
 * La description s'affiche uniquement au survol.
 */
const ServiceCard = memo(({
  service,
  finalPath,
  viewText = 'View',
  onClick,
}) => {
  const rawDesc = (service.short_description || service.description || '').replace(/<[^>]+>/g, '').trim()

  return (
    <Link
      href={finalPath}
      className="group relative flex flex-col p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all text-left overflow-hidden"
      onClick={onClick}
    >
      {/* Contenu de la card - flouté au survol */}
      <div className="transition-all duration-200 group-hover:blur-md pointer-events-none">
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2 leading-snug">
          {service.list_title || service.name}
        </h3>
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          {service.base_price && (
            <PriceDisplay price={service.base_price} priceUsd={service.price_usd} priceGbp={service.price_gbp} showFrom className="text-sm font-bold text-gray-900" />
          )}
          <span className="text-blue-600 flex items-center gap-1 text-sm font-medium">
            {viewText}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>

      {/* Overlay description - visible au survol, par-dessus le flou */}
      {rawDesc && (
        <div
          className="absolute inset-0 flex items-center justify-center p-4 bg-white/95 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          aria-hidden="true"
        >
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 text-center">
            {rawDesc}
          </p>
        </div>
      )}
    </Link>
  )
})

ServiceCard.displayName = 'ServiceCard'

export default ServiceCard
