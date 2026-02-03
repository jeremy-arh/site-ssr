'use client'
// Force rebuild - hero deux colonnes - services blocks updated

import { useEffect, useMemo, useState, memo } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import SEOHead from '@/components/SEOHead'

// URLs Cloudflare optimisées avec paramètres
const PRICING_IMG_CLOUDFLARE = 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/2207777e-4fd2-441a-4447-820672f68b00/f=webp,q=80'
// Image Hero pour la colonne droite (femme avec laptop)
const HERO_IMG_RIGHT = 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/aa0b6231-eb7d-4a68-a985-249ba265d500/public'
import StructuredData from '@/components/StructuredData'
import { useCurrency } from '@/contexts/CurrencyContext'
import { getFormUrl } from '@/utils/formUrl'
import { getCanonicalUrl } from '@/utils/canonicalUrl'
import { useTranslation } from '@/hooks/useTranslation'
import { useLanguage } from '@/contexts/LanguageContext'
// Les données sont pré-formatées côté serveur, plus besoin de formatServiceForLanguage
import PriceDisplay from '@/components/PriceDisplay'
import { fuzzySearchServices } from '@/utils/fuzzySearch'
import dynamic from 'next/dynamic'
import { trackCTAToFormOnService } from '@/utils/gtm'

// Importer HowItWorks et FAQ normalement pour qu'ils soient toujours dans le DOM (nécessaire pour la navigation)
import HowItWorks from '@/components/HowItWorks'
import FAQ from '@/components/FAQ'

// Différer les autres composants non-critiques pour réduire le JS initial
const MobileCTA = dynamic(() => import('@/components/MobileCTA'), { ssr: true })
const ChatCTA = dynamic(() => import('@/components/ChatCTA'), { ssr: true })
// TrustpilotSlider directement importé
import TrustpilotSlider from '@/components/TrustpilotSlider'

// ANALYTICS : Plausible + Segment GA4
const trackWithAnalytics = (type, ...args) => {
  import('@/utils/analytics').then((m) => {
    if (type === 'service') m.trackServiceClick(...args)
    else if (type === 'cta') m.trackCTAClick(...args)
  }).catch(() => {})
}

// SVG Icons inline pour éviter @iconify (performance)
// Icônes noires pour le hero (fond clair beige)
const IconWorld = memo(() => (
  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-gray-900 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
))
// Icônes pour les blocs de certification digitale
const IconLaptop = memo(() => (
  <svg className="w-6 h-6 text-blue-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="4" width="20" height="13" rx="2" ry="2"/><path d="M6 20h12M12 16v4"/>
  </svg>
))
const IconCertificate = memo(() => (
  <svg className="w-6 h-6 text-blue-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4h4M10 13l2 2 4-4"/>
  </svg>
))
const IconEarth = memo(() => (
  <svg className="w-6 h-6 text-blue-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
))
const IconFlash = memo(() => (
  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-gray-900 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
))
const IconLock = memo(() => (
  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-gray-900 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
))
const IconCheckCircle = memo(() => (
  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
  </svg>
))
// Icons for How It Works summary
const IconUpload = memo(({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
  </svg>
))
const IconPeople = memo(({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
  </svg>
))
const IconCreditCard = memo(({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
    <path d="M9 16l2-2 2 2 4-4-1.41-1.41L12 14.17l-1.59-1.59L9 14z" fill="currentColor"/>
  </svg>
))
const IconIdentityCard = memo(({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 6h16v2H4V6zm0 12v-8h16v8H4zm2-6h4v1H6v-1zm0 2h4v1H6v-1zm6-2h6v1h-6v-1zm0 2h4v1h-4v-1z"/>
  </svg>
))
const IconVideoDocument = memo(({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="3" width="14" height="12" rx="1.5"/>
    <path d="M8 7h5M8 10h7"/>
    <path d="M16.5 16.5l-1.5-1.5 1.5-1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="17" cy="17" r="1" fill="currentColor"/>
  </svg>
))
const IconCheck = memo(({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
))
const IconClockFast = memo(({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M15 4a8 8 0 0 1 8 8a8 8 0 0 1-8 8a8 8 0 0 1-8-8a8 8 0 0 1 8-8m0 2a6 6 0 0 0-6 6a6 6 0 0 0 6 6a6 6 0 0 0 6-6a6 6 0 0 0-6-6m-1 2v6l5.25 3.15l.75-1.23l-4.5-2.67V8H14Z"/>
  </svg>
))
const IconArrowLeft = memo(() => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
))
const IconArrowRight = memo(() => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
))
const IconOpenNew = memo(() => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zm-2 16H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7h-7z"/>
  </svg>
))
const IconMoneyBack = memo(() => (
  <svg className="w-12 h-12 text-blue-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z"/>
    <path d="M9 11l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
  </svg>
))
const IconShieldCheck = memo(() => (
  <svg className="w-12 h-12 text-blue-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z"/>
    <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
))

// Map des icônes pour How It Works (défini après toutes les icônes)
const STEP_ICONS_HIW = {
  'line-md:uploading-loop': IconUpload,
  'formkit:people': IconPeople,
  'mynaui:credit-card-check-solid': IconCreditCard,
  'hugeicons:identity-card': IconIdentityCard,
  'video-call': IconVideoDocument,
  'stash:check-solid': IconCheck,
}

// Composant mémorisé pour le contenu "What is" - extrait la logique lourde
const WhatIsContent = memo(({ service, t }) => {
  const { firstH2Content, contentWithoutFirstH2 } = useMemo(() => {
    const detailedDesc = service.detailed_description || ''
    const desc = service.description || ''
    
    const h2Regex = /<h2(?:\s+[^>]*)?>([\s\S]*?)<\/h2>/i
    let h2Match = detailedDesc ? detailedDesc.match(h2Regex) : null
    if (!h2Match && desc) h2Match = desc.match(h2Regex)
    
    let firstH2 = null
    let contentWithout = detailedDesc || desc
    
    if (h2Match && h2Match[1]) {
      firstH2 = h2Match[1]
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;|&#x27;/g, "'")
        .replace(/\s+/g, ' ')
        .trim()
      
      if (detailedDesc && detailedDesc.includes(h2Match[0])) {
        contentWithout = detailedDesc.replace(h2Match[0], '').trim()
      } else if (desc && desc.includes(h2Match[0])) {
        contentWithout = desc.replace(h2Match[0], '').trim()
      }
    }
    
    return { firstH2Content: firstH2, contentWithoutFirstH2: contentWithout }
  }, [service.detailed_description, service.description])

  return (
    <>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-12 text-center">
        {firstH2Content || `${t('serviceDetail.whatIs')} ${service.name}?`}
      </h2>
      <div className="max-w-6xl mx-auto">
        <div className="blog-content" dangerouslySetInnerHTML={{ __html: contentWithoutFirstH2 }} />
      </div>
    </>
  )
})

// Other Services Section Component - memoized pour éviter re-renders
// Design identique à la homepage (Services.jsx)
// Other Services Section Component - Design identique à la homepage avec recherche et catégories
const OtherServicesSection = memo(({ relatedServicesData, language }) => {
  const { t } = useTranslation()
  const { getLocalizedPath } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Les services liés sont déjà pré-formatés côté serveur
  const relatedServices = relatedServicesData || []

  // Extraire toutes les catégories uniques avec leurs libellés traduits
  const categories = useMemo(() => {
    const categoryMap = new Map()
    
    relatedServices.forEach(service => {
      const categoryRef = service.category || 'general'
      const categoryLabel = service.category_label || categoryRef
      
      if (!categoryMap.has(categoryRef)) {
        categoryMap.set(categoryRef, {
          ref: categoryRef,
          label: categoryLabel,
        })
      }
    })
    
    return Array.from(categoryMap.values())
      .sort((a, b) => a.label.localeCompare(b.label, language))
  }, [relatedServices, language])

  // Filtrer par catégorie d'abord, puis recherche
  const filteredServices = useMemo(() => {
    let filtered = relatedServices
    
    // Filtrer par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => (service.category || 'general') === selectedCategory)
    }
    
    // Ensuite appliquer la recherche floue
    return fuzzySearchServices(filtered, searchQuery)
  }, [selectedCategory, searchQuery, relatedServices])

  if (relatedServices.length === 0) {
    return null
  }

  return (
    <section id="services" className="py-20 px-4 sm:px-[30px] bg-white overflow-hidden">
      <div className="max-w-[1300px] mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">{t('serviceDetail.relatedServices')}</h2>

        {/* Barre de recherche */}
        <div className="mb-6 max-w-2xl mx-auto px-1 md:px-0">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
              }}
              placeholder={t('services.searchPlaceholder') || 'Search services...'}
              className="w-full px-5 py-4 pl-12 pr-4 text-gray-900 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-gray-400 transition-all duration-300 text-base placeholder-gray-400"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('')
                }}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Filtre par catégorie */}
        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap justify-center gap-2 px-1 md:px-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                selectedCategory === 'all'
                  ? 'bg-black text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('services.categories.all') || 'All'}
            </button>
            {categories.map((category) => (
              <button
                key={category.ref}
                onClick={() => setSelectedCategory(category.ref)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  selectedCategory === category.ref
                    ? 'bg-black text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        )}

        {/* Message si aucun résultat */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-20">
            {searchQuery ? (
              <div className="max-w-md mx-auto">
                <svg
                  className="w-16 h-16 mx-auto text-gray-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className="text-gray-600 text-lg mb-2">
                  {t('services.noResults') || 'No services found'}
                </p>
                <p className="text-gray-500 text-sm">
                  {t('services.tryDifferentSearch') || 'Try a different search term'}
                </p>
              </div>
            ) : (
              <p className="text-gray-600 text-lg">{t('services.noServices')}</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.filter(s => s && s.service_id).map((service) => {
              const servicePath = `/services/${service.service_id}`
              const localizedPath = getLocalizedPath ? getLocalizedPath(servicePath) : servicePath
              const finalPath = localizedPath || servicePath
              
              const handleServiceClick = (e) => {
                e.preventDefault();
                trackWithAnalytics('service', service.service_id, service.name, 'service_detail_other_services');
                // Forcer un rechargement complet de la page
                window.location.href = finalPath;
              };
              
              return (
                <Link
                  key={service.id || service.service_id}
                  href={finalPath}
                  className="group block bg-gray-50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 border border-gray-200 transform hover:-translate-y-2 scroll-slide-up h-full flex flex-col"
                  onClick={handleServiceClick}
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{service.list_title || service.name}</h3>
                  </div>

                  <p className="text-gray-600 mb-6 min-h-[60px] leading-relaxed flex-1">{service.short_description || service.description}</p>

                  <div className="flex flex-col gap-3 mt-auto items-center pt-4 border-t border-gray-200">
                    <div className="inline-flex items-center gap-2 group-hover:gap-3 transition-all justify-center text-sm font-semibold text-black underline underline-offset-4 decoration-2">
                      <span className="btn-text inline-block">{t('services.learnMore')}</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                    {service.base_price && (
                      <div className="flex items-center gap-2 justify-center">
                        <PriceDisplay price={service.base_price} priceUsd={service.price_usd} priceGbp={service.price_gbp} showFrom className="text-lg font-bold text-gray-900" />
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
})

export default function ServiceDetailClient({ serviceData, relatedServicesData, serviceId, faqsData, serverLanguage }) {
  const pathname = usePathname()
  // Utiliser la langue serveur en priorité pour éviter le flash
  const { t } = useTranslation(serverLanguage)
  const { getLocalizedPath } = useLanguage()
  const { currency, formatPrice } = useCurrency()
  const [ctaPrice, setCtaPrice] = useState('')

  // Les données sont déjà pré-formatées côté serveur, utiliser directement
  const service = serviceData
  const language = serverLanguage

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [serviceId])

  // Différer le formatage du prix pour ne pas bloquer le rendu initial
  // EUR, USD, GBP = prix fixes depuis la DB
  useEffect(() => {
    if (!service?.base_price) return
    
    const timer = setTimeout(() => {
      if (currency === 'EUR') {
        setCtaPrice(`${service.base_price}€`)
      } else if (currency === 'USD' && service.price_usd != null) {
        setCtaPrice(`$${Number(service.price_usd).toFixed(2)}`)
      } else if (currency === 'GBP' && service.price_gbp != null) {
        setCtaPrice(`£${Number(service.price_gbp).toFixed(2)}`)
      } else {
        formatPrice(service.base_price).then(setCtaPrice)
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [service?.base_price, service?.price_usd, service?.price_gbp, currency, formatPrice])

  // Track service view - Plausible uniquement (léger, ~1KB)
  useEffect(() => {
    if (service && serviceId) {
      trackWithAnalytics('service', serviceId, service.name, 'service_detail_page')
    }
  }, [service, serviceId])

  // Breadcrumbs pour données structurées
  const breadcrumbItems = useMemo(() => {
    if (!service) return []
    return [
      { name: t('common.home') || 'Home', url: '/' },
      { name: t('services.title') || 'Services', url: '/services' },
      { name: service.name, url: pathname },
    ]
  }, [service, t, pathname])

  // Formater les FAQs pour le schema.org (FAQPage)
  // Inclut les FAQs dynamiques (du service ou générales) et les FAQs fixes si nécessaire
  // IMPORTANT: Les FAQs sont formatées selon la langue actuelle (language)
  const faqItemsForSchema = useMemo(() => {
    const faqsForSchema = []
    
    // 1. Ajouter les FAQs dynamiques (du service ou générales) si disponibles
    if (faqsData && Array.isArray(faqsData) && faqsData.length > 0) {
      faqsData.forEach((faq) => {
        // Récupérer la question et la réponse selon la langue actuelle
        // Ordre de priorité : langue actuelle > anglais > question/answer par défaut
        let question = ''
        let answer = ''
        
        // Pour la langue actuelle (ex: 'fr', 'es', 'de', etc.)
        if (language && language !== 'en') {
          question = faq[`question_${language}`] || ''
          answer = faq[`answer_${language}`] || ''
        }
        
        // Fallback vers l'anglais si la langue actuelle n'est pas disponible
        if (!question || !answer) {
          question = faq.question_en || faq.question || ''
          answer = faq.answer_en || faq.answer || ''
        }
        
        // Ajouter seulement si question et answer sont valides
        if (question && answer) {
          faqsForSchema.push({
            question: question,
            answer: answer,
          })
        }
      })
    }
    
    // 2. Si pas de FAQs dynamiques, ajouter les FAQs fixes depuis les traductions
    // Les traductions sont automatiquement dans la bonne langue grâce au hook useTranslation
    if (faqsForSchema.length === 0) {
      try {
        // Essayer de récupérer les FAQs depuis les traductions (déjà dans la bonne langue)
        const translatedFaqs = t('faq.items', [])
        if (Array.isArray(translatedFaqs) && translatedFaqs.length > 0) {
          translatedFaqs.forEach((faq) => {
            if (faq && faq.question && faq.answer) {
              faqsForSchema.push({
                question: faq.question,
                answer: faq.answer,
              })
            }
          })
        } else {
          // Si les traductions ne retournent pas un tableau, essayer d'accéder directement
          for (let i = 0; i < 5; i++) {
            try {
              const question = t(`faq.items.${i}.question`, '')
              const answer = t(`faq.items.${i}.answer`, '')
              if (question && answer) {
                faqsForSchema.push({
                  question: question,
                  answer: answer,
                })
              }
            } catch {
              // Continuer avec la FAQ suivante
            }
          }
        }
      } catch {
        // Si les traductions ne sont pas disponibles, utiliser les FAQs par défaut en anglais
        // (ce cas ne devrait normalement pas arriver car les traductions sont toujours disponibles)
        const defaultFaqs = [
          {
            question: 'How does the online notarization process work?',
            answer: 'Everything happens in just a few minutes, directly from your browser. You schedule a secure video session with a licensed notary, sign your document remotely, and the notarization is completed in real time. Your notarized document is immediately uploaded and available on the platform, accompanied by its digital certification.'
          },
          {
            question: 'Are my documents officially recognized internationally?',
            answer: 'Yes. All documents notarized through our platform can receive an apostille issued in accordance with The Hague Convention of 5 October 1961. This apostille certifies the authenticity of the notary\'s signature and seal, ensuring the international validity of your document across all member countries.'
          },
          {
            question: 'What types of documents can I have certified?',
            answer: 'You can notarize and certify a wide range of documents, including:\n- Contracts, declarations, affidavits, and simple powers of attorney\n- Certified true copies (IDs, diplomas, certificates)\n- Certified translations Business and administrative documents\nEach document is securely signed, sealed, and stored within your private space.'
          },
          {
            question: 'How is my data protected?',
            answer: 'All transfers are end-to-end encrypted (AES-256) and stored on secure servers that comply with international data protection standards. Video sessions are recorded and archived under strict control to ensure integrity, traceability, and full confidentiality for every notarization.'
          },
          {
            question: 'When will I receive my final document?',
            answer: 'Immediately after the end of your video session with the notary, your notarized document is automatically available in your secure dashboard. You receive your notarized document right away, without any delay. If an apostille is required, it is added once validated by the competent authority — and the final certified document becomes available for instant download.'
          },
        ]
        defaultFaqs.forEach((faq) => {
          faqsForSchema.push({
            question: faq.question,
            answer: faq.answer,
          })
        })
      }
    }
    
    // Debug en développement pour vérifier la langue utilisée
    // eslint-disable-next-line no-undef
    if (process.env.NODE_ENV === 'development' && faqsForSchema.length > 0) {
      console.log('[Schema.org FAQ Debug]', {
        language,
        faqsCount: faqsForSchema.length,
        firstQuestion: faqsForSchema[0]?.question?.substring(0, 50),
        firstAnswer: faqsForSchema[0]?.answer?.substring(0, 50),
      })
    }
    
    // Limiter à 10 FAQs pour le schema.org (recommandation Google)
    return faqsForSchema.slice(0, 10)
  }, [faqsData, language, t])

  const formUrl = useMemo(() => {
    return getFormUrl(currency, service?.service_id || serviceId)
  }, [currency, service?.service_id, serviceId])


  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl text-gray-900 mb-4 md:mb-6 leading-tight">{t('common.notFound')}</h1>
        <p className="text-gray-600 mb-8">{t('common.error')}</p>
        <a 
          href={getLocalizedPath('/')} 
          className="primary-cta text-lg px-8 py-4 inline-flex items-center gap-2 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = getLocalizedPath('/');
          }}
        >
          <IconOpenNew />
          <span className="btn-text inline-block">{t('nav.notarizeNow')}</span>
        </a>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden max-w-full">
      <SEOHead
        title={service.meta_title || service.name || t('serviceDetail.defaultTitle')}
        description={service.meta_description || service.short_description || service.description || ''}
        ogTitle={service.meta_title || service.name || t('serviceDetail.defaultTitle')}
        ogDescription={service.meta_description || service.short_description || service.description || ''}
        twitterTitle={service.meta_title || service.name || t('serviceDetail.defaultTitle')}
        twitterDescription={service.meta_description || service.short_description || service.description || ''}
        serverLanguage={serverLanguage}
      />
      <StructuredData
        type="Service"
        data={{
          serviceName: service.name,
          serviceDescription: service.meta_description || service.short_description || service.description || '',
          '@id': getCanonicalUrl(pathname),
        }}
        additionalData={[
          {
            type: 'BreadcrumbList',
            data: {
              items: breadcrumbItems,
            },
          },
          // Ajouter les FAQs au schema.org si disponibles
          ...(faqItemsForSchema.length > 0 ? [{
            type: 'FAQPage',
            data: {
              faqItems: faqItemsForSchema,
            },
          }] : []),
        ]}
      />
      {/* Hero Section - Deux colonnes : texte à gauche, image à droite */}
      <section data-hero className="relative flex flex-col lg:flex-row overflow-x-hidden w-full max-w-full">
        {/* Colonne gauche - Texte sur fond beige, centré verticalement */}
        <div 
          className="w-full lg:w-1/2 flex flex-col items-start px-6 sm:px-12 lg:px-16 py-16 lg:py-0 service-hero-left-column" 
          style={{ backgroundColor: '#F7F5F2' }}
        >
          <div className="w-full">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-gray-900 mb-4 lg:mb-6 leading-tight">
              {service.page_h1 || service.name}
            </h1>

            <p className="text-base sm:text-lg text-gray-700 mb-6 lg:mb-8 leading-relaxed">
              {service.short_description || service.description}
            </p>

            <div className="flex flex-row flex-wrap items-center gap-3 mb-8 lg:mb-12">
              <a 
                id="hero-cta"
                href={formUrl} 
                className="text-base lg:text-lg text-white flex-shrink-0 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-all inline-flex items-center gap-2"
                onClick={(e) => {
                  e.preventDefault()
                  const ctaCopy = service.cta || t('nav.notarizeNow')
                  const destination = formUrl
                  
                  trackWithAnalytics('cta', 'service_detail_hero', service?.service_id || serviceId, pathname, {
                    ctaText: ctaCopy,
                    destination,
                    elementId: 'service_detail_hero'
                  })
                  // Track GTM event (uniquement sur pages services)
                  trackCTAToFormOnService('service_detail_hero', pathname, ctaCopy, destination, 'service_detail_hero', service?.service_id || serviceId, currency)
                  // Rediriger après le tracking pour laisser le temps à GTM d'envoyer l'événement
                  setTimeout(() => {
                    window.location.href = destination
                  }, 100)
                }}
              >
                <IconOpenNew />
                <span className="btn-text inline-block">
                  {service.cta || t('nav.notarizeNow')}
                </span>
              </a>
              {ctaPrice && (
                <div className="text-gray-900 flex items-center gap-1">
                  <span className="text-base font-semibold">{ctaPrice}</span>
                  <span className="text-xs font-normal text-gray-600">{t('services.perDocument')} - no hidden fee</span>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="flex flex-col xl:flex-row items-start xl:items-center gap-3 xl:gap-6">
              <div className="flex items-center gap-2">
                <IconWorld />
                <span className="text-gray-900 font-medium text-sm lg:text-base">{t('hero.feature1')}</span>
              </div>

              <div className="flex items-center gap-2">
                <IconFlash />
                <span className="text-gray-900 font-medium text-sm lg:text-base">{t('hero.feature2')}</span>
              </div>

              <div className="flex items-center gap-2">
                <IconLock />
                <span className="text-gray-900 font-medium text-sm lg:text-base">{t('hero.feature3')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne droite - Image (masquée sur mobile, visible uniquement sur lg+) */}
        <div className="hidden lg:flex w-1/2 relative service-hero-right-column">
          <img
            src={HERO_IMG_RIGHT}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            fetchPriority="high"
          />
        </div>
      </section>

      <TrustpilotSlider serverLanguage={serverLanguage} />

      {/* Pricing Section - Two Column Layout */}
      <section
        className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-[30px] py-8 sm:py-12 md:py-16 relative overflow-x-hidden w-full max-w-full"
        style={{ backgroundColor: '#F7F5F2' }}
      >
        <div className="max-w-[1300px] w-full mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8 items-start justify-start">
            {/* Left Side - Image SVG */}
            <div className="w-full lg:w-2/5 flex items-center justify-center">
              <img
                src={PRICING_IMG_CLOUDFLARE}
                alt={service.name}
                className="w-full h-auto rounded-xl md:rounded-2xl object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Right Side - Pricing Block */}
            <div className="w-full lg:w-3/5 flex flex-col">
              <div 
                className="rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden flex flex-col h-full"
                style={{
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)'
                }}
              >
                {/* Top Section - Black Background */}
                <div 
                  className="p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12"
                  style={{
                    background: '#000000'
                  }}
                >
                  {/* Price Section */}
                  <div>
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 md:mb-6 text-white">{service.name}</h2>
                  
                    {service.base_price ? (
                      <>
                        <div className="mb-3 sm:mb-4 md:mb-6">
                          <div className="flex items-baseline gap-2 mb-2 sm:mb-3">
                            <PriceDisplay 
                              price={service.base_price}
                              priceUsd={service.price_usd}
                              priceGbp={service.price_gbp}
                              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white"
                            />
                          </div>
                          <p className="text-xs sm:text-sm text-gray-400">{t('services.perDocument')}</p>
                        </div>
                      </>
                    ) : (
                      <div>
                        <p className="text-sm sm:text-base md:text-lg text-gray-300">{t('serviceDetail.pricing.contactForPricing')}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Section - White Background */}
                <div 
                  className="p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 flex flex-col flex-1"
                  style={{
                    background: '#ffffff'
                  }}
                >
                  {/* Benefits List - Optimisé sans animations coûteuses */}
                  <div className="mb-5 sm:mb-6 md:mb-8 space-y-2.5 sm:space-y-3 md:space-y-4 flex-1">
                    <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4">
                      <IconCheckCircle />
                      <div>
                        <h3 className="text-gray-900 text-xs sm:text-sm md:text-base font-semibold mb-0.5 sm:mb-1">{t('serviceDetail.pricing.benefits.legallyValid.title')}</h3>
                        <p className="text-gray-700 text-[11px] sm:text-xs md:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.legallyValid.description')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4">
                      <IconCheckCircle />
                      <div>
                        <h3 className="text-gray-900 text-xs sm:text-sm md:text-base font-semibold mb-0.5 sm:mb-1">{t('serviceDetail.pricing.benefits.sameDay.title')}</h3>
                        <p className="text-gray-700 text-[11px] sm:text-xs md:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.sameDay.description')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4">
                      <IconCheckCircle />
                      <div>
                        <h3 className="text-gray-900 text-xs sm:text-sm md:text-base font-semibold mb-0.5 sm:mb-1">{t('serviceDetail.pricing.benefits.officialNotarization.title')}</h3>
                        <p className="text-gray-700 text-[11px] sm:text-xs md:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.officialNotarization.description')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4">
                      <IconCheckCircle />
                      <div>
                        <h3 className="text-gray-900 text-xs sm:text-sm md:text-base font-semibold mb-0.5 sm:mb-1">{t('serviceDetail.pricing.benefits.available247.title')}</h3>
                        <p className="text-gray-700 text-[11px] sm:text-xs md:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.available247.description')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4">
                      <IconCheckCircle />
                      <div>
                        <h3 className="text-gray-900 text-xs sm:text-sm md:text-base font-semibold mb-0.5 sm:mb-1">{t('serviceDetail.pricing.benefits.transparentFee.title')}</h3>
                        <p className="text-gray-700 text-[11px] sm:text-xs md:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.transparentFee.description')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4">
                      <IconCheckCircle />
                      <div>
                        <h3 className="text-gray-900 text-xs sm:text-sm md:text-base font-semibold mb-0.5 sm:mb-1">{t('serviceDetail.pricing.benefits.bankGradeSecurity.title')}</h3>
                        <p className="text-gray-700 text-[11px] sm:text-xs md:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.bankGradeSecurity.description')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4">
                      <IconCheckCircle />
                      <div>
                        <h3 className="text-gray-900 text-xs sm:text-sm md:text-base font-semibold mb-0.5 sm:mb-1">{t('serviceDetail.pricing.benefits.globalCompliance.title')}</h3>
                        <p className="text-gray-700 text-[11px] sm:text-xs md:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.globalCompliance.description')}</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button - Simplifié sans animations coûteuses */}
                  <a
                    href={formUrl}
                    onClick={(e) => {
                      e.preventDefault()
                      const destination = formUrl
                      const ctaText = 'Upload my document'
                      trackWithAnalytics('cta', 'service_detail_pricing', service?.service_id || serviceId, pathname, {
                        ctaText: ctaText,
                        destination,
                        elementId: 'service_detail_pricing'
                      })
                      // Track GTM event (uniquement sur pages services)
                      trackCTAToFormOnService('service_detail_pricing', pathname, ctaText, destination, 'service_detail_pricing', service?.service_id || serviceId, currency)
                      // Rediriger après le tracking pour laisser le temps à GTM d'envoyer l'événement
                      setTimeout(() => {
                        window.location.href = destination
                      }, 100)
                    }}
                    className="block w-full text-sm sm:text-base md:text-lg px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 text-white font-bold rounded-lg md:rounded-xl transition-colors duration-200 text-center bg-black hover:bg-gray-900 shadow-lg cursor-pointer"
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      <IconUpload />
                      Upload my document
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chat CTA Section */}
      <ChatCTA />

      {/* Features Section - Alternating Image/Content Layout */}
      <section className="py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-[30px] bg-white overflow-x-hidden w-full max-w-full">
        <div className="max-w-[1300px] mx-auto space-y-16 md:space-y-20">
          
          {/* Section 1: What You Receive After Your Notary Appointment - Image Left, Content Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 min-h-[400px] lg:min-h-[500px]">
            {/* Left - Image */}
            <div className="flex items-center justify-center order-2 lg:order-1">
              <div className="w-full max-w-md">
                <img
                  src={service.certificate_image || "https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/3f9a44ae-57fe-4ec8-6f73-f936dd190a00/f=webp,q=80"}
                  alt={t('serviceDetail.whatYouReceive.title')}
                  className="w-full h-auto rounded-[30px] object-cover shadow-xl"
                  loading="lazy"
                  decoding="async"
                />
                <p className="text-xs text-gray-400 mt-3 text-center italic">
                  {t('serviceDetail.whatYouReceive.disclaimer')}
                </p>
              </div>
            </div>

            {/* Right - Content */}
            <div className="flex items-center justify-center order-1 lg:order-2">
              <div className="w-full max-w-md text-left">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
                  {t('serviceDetail.whatYouReceive.title')}
                </h2>
                <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8">
                  {t('serviceDetail.whatYouReceive.subtitle')}
                </p>
                <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                  <li className="flex items-start gap-3">
                    <IconCheckCircle />
                    <span className="text-gray-700 text-sm md:text-base">{t('serviceDetail.whatYouReceive.items.official')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <IconCheckCircle />
                    <span className="text-gray-700 text-sm md:text-base">{t('serviceDetail.whatYouReceive.items.notaryInfo')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <IconCheckCircle />
                    <span className="text-gray-700 text-sm md:text-base">{t('serviceDetail.whatYouReceive.items.dateRef')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <IconCheckCircle />
                    <span className="text-gray-700 text-sm md:text-base">{t('serviceDetail.whatYouReceive.items.digitalPdf')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <IconCheckCircle />
                    <span className="text-gray-700 text-sm md:text-base">{t('serviceDetail.whatYouReceive.items.permanentAccess')}</span>
                  </li>
                </ul>
                <a
                  href={formUrl}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                  onClick={(e) => {
                    e.preventDefault()
                    const ctaText = t('serviceDetail.whatYouReceive.cta')
                    trackWithAnalytics('cta', 'service_detail_features_section_1', service?.service_id || serviceId, pathname, {
                      ctaText: ctaText,
                      destination: formUrl,
                      elementId: 'service_detail_features_section_1_cta'
                    })
                    // Track GTM event (uniquement sur pages services)
                    trackCTAToFormOnService('service_detail_features_section_1', pathname, ctaText, formUrl, 'service_detail_features_section_1_cta', service?.service_id || serviceId, currency)
                    // Rediriger après le tracking pour laisser le temps à GTM d'envoyer l'événement
                    setTimeout(() => {
                      window.location.href = formUrl
                    }, 100)
                  }}
                >
                  <span>{t('serviceDetail.whatYouReceive.cta')}</span>
                  <IconArrowRight />
                </a>
              </div>
            </div>
          </div>

          {/* Section 2: Valid for Any Official Purpose - Image Left, Content Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 min-h-[400px] lg:min-h-[500px]">
            {/* Left - Image */}
            <div className="flex items-center justify-center order-2 lg:order-1">
              <div className="w-full max-w-md">
                <img
                  src="https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/68f3d89b-5e76-4a1b-6b84-4896a91bc000/f=webp,q=80"
                  alt={t('serviceDetail.validForPurpose.title')}
                  className="w-full h-auto rounded-[30px] object-cover shadow-xl"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            {/* Right - Content */}
            <div className="flex items-center justify-center order-1 lg:order-2">
              <div className="w-full max-w-md text-left">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
                  {t('serviceDetail.validForPurpose.title')}
                </h2>
                <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8">
                  {t('serviceDetail.validForPurpose.subtitle')}
                </p>
                <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                  <li className="flex items-start gap-3">
                    <IconCheckCircle />
                    <span className="text-gray-700 text-sm md:text-base">{t('serviceDetail.validForPurpose.items.bankAccount')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <IconCheckCircle />
                    <span className="text-gray-700 text-sm md:text-base">{t('serviceDetail.validForPurpose.items.visa')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <IconCheckCircle />
                    <span className="text-gray-700 text-sm md:text-base">{t('serviceDetail.validForPurpose.items.university')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <IconCheckCircle />
                    <span className="text-gray-700 text-sm md:text-base">{t('serviceDetail.validForPurpose.items.property')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <IconCheckCircle />
                    <span className="text-gray-700 text-sm md:text-base">{t('serviceDetail.validForPurpose.items.company')}</span>
                  </li>
                </ul>
                <a
                  href={formUrl}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                  onClick={(e) => {
                    e.preventDefault()
                    const ctaText = t('serviceDetail.validForPurpose.cta')
                    trackWithAnalytics('cta', 'service_detail_features_section_2', service?.service_id || serviceId, pathname, {
                      ctaText: ctaText,
                      destination: formUrl,
                      elementId: 'service_detail_features_section_2_cta'
                    })
                    // Track GTM event (uniquement sur pages services)
                    trackCTAToFormOnService('service_detail_features_section_2', pathname, ctaText, formUrl, 'service_detail_features_section_2_cta', service?.service_id || serviceId, currency)
                    // Rediriger après le tracking pour laisser le temps à GTM d'envoyer l'événement
                    setTimeout(() => {
                      window.location.href = formUrl
                    }, 100)
                  }}
                >
                  <span>{t('serviceDetail.validForPurpose.cta')}</span>
                  <IconArrowRight />
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* What is Section - content-visibility pour optimisation */}
      <section className="py-20 px-[30px] bg-gray-50 content-visibility-auto overflow-x-hidden w-full max-w-full">
        <div className="max-w-[1300px] mx-auto">
          <WhatIsContent service={service} t={t} />
        </div>
      </section>

      {/* Other Services Section */}
      <OtherServicesSection relatedServicesData={relatedServicesData} language={language} />

      {/* FAQ Section */}
      <FAQ faqsData={faqsData || null} />

      {/* Back to Services */}
      <section className="px-[30px] py-12">
        <div className="max-w-[1100px] mx-auto text-center">
          <a 
            href={getLocalizedPath('/#services')} 
            className="inline-flex items-center gap-3 text-black font-semibold hover:underline cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = getLocalizedPath('/#services');
            }}
          >
            <IconArrowLeft />
            <span>{t('serviceDetail.backToServices')}</span>
          </a>
        </div>
      </section>

      {/* Mobile CTA */}
      <MobileCTA ctaText={service.cta || t('nav.notarizeNow')} price={service.base_price} priceUsd={service.price_usd} priceGbp={service.price_gbp} serviceId={service?.service_id || serviceId} />
    </div>
  )
}
