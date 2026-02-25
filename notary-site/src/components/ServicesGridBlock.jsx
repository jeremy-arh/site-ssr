'use client'

import { useState, useMemo, memo } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { useLanguage } from '@/contexts/LanguageContext'
import ServiceCard from './ServiceCard'
import { fuzzySearchServices } from '@/utils/fuzzySearch'

const trackWithAnalytics = (type, ...args) => {
  import('@/utils/analytics').then((m) => {
    if (type === 'service') m.trackServiceClick(...args)
  }).catch(() => {})
}

/**
 * Bloc de services strictement identique à celui de /online-notary-service.
 * Utilisé sur la home, les pages service détail, et la page /services.
 */
const ServicesGridBlock = memo(({
  services = [],
  title,
  subtitle,
  analyticsContext = 'services_block',
  isLoading = false,
}) => {
  const { t } = useTranslation()
  const { getLocalizedPath, language } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = useMemo(() => {
    const categoryMap = new Map()
    services.forEach(service => {
      const categoryRef = service.category || 'general'
      const categoryLabel = service.category_label || categoryRef
      if (!categoryMap.has(categoryRef)) {
        categoryMap.set(categoryRef, { ref: categoryRef, label: categoryLabel })
      }
    })
    return Array.from(categoryMap.values()).sort((a, b) => a.label.localeCompare(b.label, language))
  }, [services, language])

  const filteredServices = useMemo(() => {
    let filtered = services
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(s => (s.category || 'general') === selectedCategory)
    }
    const searched = fuzzySearchServices(filtered, searchQuery)
    return [...searched].sort((a, b) => (a.list_title || a.name || '').localeCompare(b.list_title || b.name || '', language))
  }, [selectedCategory, searchQuery, services, language])

  const displayTitle = title ?? (t('serviceDetail.relatedServicesOnlineNotary') || t('serviceDetail.relatedServices'))
  const displaySubtitle = subtitle ?? (t('services.searchSubtitle') || 'Find the notarization service you need. Search by name or filter by category.')

  if (services.length === 0 && !isLoading) return null

  return (
    <section id="services" className="py-10 px-4 sm:px-6 lg:px-[30px] bg-white overflow-hidden">
      <div className="max-w-[1100px] mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">{displayTitle}</h2>
        <p className="text-gray-600 text-sm text-center mb-6 max-w-xl mx-auto">
          {displaySubtitle}
        </p>

        {/* Search + filters - compact */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('services.searchPlaceholder') || 'Search services...'}
              className="w-full px-4 py-3 pl-11 pr-10 text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 transition-all text-sm placeholder-gray-400"
            />
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label="Clear">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        </div>

        {/* Filtre par catégorie - compact */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedCategory === 'all' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {t('services.categories.all') || 'All'}
            </button>
            {categories.map(cat => (
              <button
                key={cat.ref}
                onClick={() => setSelectedCategory(cat.ref)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedCategory === cat.ref ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Service cards */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-gray-100 rounded-xl p-4 h-32"></div>
                ))}
              </div>
            </div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-sm">{t('services.noResults') || 'No services found'}</p>
            <p className="text-gray-500 text-xs mt-1">{t('services.tryDifferentSearch') || 'Try a different search term'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.filter(s => s && s.service_id).map((service) => {
              const servicePath = `/services/${service.service_id}`
              const finalPath = getLocalizedPath ? getLocalizedPath(servicePath) : servicePath
              return (
                <ServiceCard
                  key={service.service_id}
                  service={service}
                  finalPath={finalPath}
                  viewText={t('services.view')}
                  onClick={(e) => {
                    e.preventDefault()
                    trackWithAnalytics('service', service.service_id, service.name, analyticsContext)
                    window.location.href = finalPath
                  }}
                />
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
})

ServicesGridBlock.displayName = 'ServicesGridBlock'
export default ServicesGridBlock
