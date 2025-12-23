'use client'

import { useEffect, useMemo, useState, memo } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import SEOHead from '@/components/SEOHead'

// URLs Cloudflare optimisées avec paramètres
const HERO_IMG_CLOUDFLARE = 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/165f7d09-facd-47ad-dd30-db71400aaf00/w=auto,q=auto,f=avif'
const PRICING_IMG_CLOUDFLARE = 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/23262bc0-f4d7-4c93-6254-04da31866900/q=20'
import StructuredData from '@/components/StructuredData'
import { useCurrency } from '@/contexts/CurrencyContext'
import { getFormUrl } from '@/utils/formUrl'
import { getCanonicalUrl } from '@/utils/canonicalUrl'
import { useTranslation } from '@/hooks/useTranslation'
import { useLanguage } from '@/contexts/LanguageContext'
import { formatServiceForLanguage, formatServicesForLanguage } from '@/utils/services'
import PriceDisplay from '@/components/PriceDisplay'
import dynamic from 'next/dynamic'

// Différer les composants non-critiques pour réduire le JS initial
const HowItWorks = dynamic(() => import('@/components/HowItWorks'), { ssr: true })
const Testimonial = dynamic(() => import('@/components/Testimonial'), { ssr: true })
const FAQ = dynamic(() => import('@/components/FAQ'), { ssr: true })
const MobileCTA = dynamic(() => import('@/components/MobileCTA'), { ssr: true })
const ChatCTA = dynamic(() => import('@/components/ChatCTA'), { ssr: true })

// ANALYTICS : Plausible uniquement (léger, ~1KB)
const trackWithPlausible = (type, ...args) => {
  import('@/utils/plausible').then((m) => {
    if (type === 'service') m.trackServiceClick(...args)
    else if (type === 'cta') m.trackCTAClick(...args)
  }).catch(() => {})
}

// SVG Icons inline pour éviter @iconify (performance)
const IconWorld = memo(() => (
  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
))
const IconFlash = memo(() => (
  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
))
const IconLock = memo(() => (
  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
))
const IconCheckCircle = memo(() => (
  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
  </svg>
))
const IconUpload = memo(() => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
  </svg>
))
const IconArrowLeft = memo(() => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
))
const IconOpenNew = memo(() => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zm-2 16H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7h-7z"/>
  </svg>
))

// Icônes pour les services (même que sur la homepage)
const IconBadgeCheck = memo(() => (
  <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
))
const IconTranslate = memo(() => (
  <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12.913 17H20.087M12.913 17L11 21M12.913 17L16.5 9L20.087 17M20.087 17L22 21"/>
    <path d="M2 5H8M8 5H11M8 5V3M11 5H14M11 5C10.5 9 9.5 11.5 8 14"/>
    <path d="M5 10C5.5 11.5 6.5 13 8 14M8 14C9 15 11 16.5 14 16.5"/>
  </svg>
))
const IconPassport = memo(() => (
  <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="2" width="16" height="20" rx="2"/>
    <circle cx="12" cy="10" r="3"/>
    <path d="M8 17h8"/>
  </svg>
))
const IconDocument = memo(() => (
  <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
  </svg>
))
const IconSignature = memo(() => (
  <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 19H4M4 15l3-3 2 2 4-4 3 3 4-4"/>
    <circle cx="18" cy="7" r="3"/>
  </svg>
))
const IconScale = memo(() => (
  <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 3v18M3 9l3-3 3 3M18 9l3-3-3-3M6 9v6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V9"/>
    <path d="M3 9a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3"/>
  </svg>
))
const IconApostille = memo(() => (
  <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v6l4 2"/>
    <path d="M2 12h2M20 12h2M12 2v2M12 20v2"/>
  </svg>
))
const IconPower = memo(() => (
  <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <path d="M14 2v6h6"/>
    <path d="M9 15l2 2 4-4"/>
  </svg>
))

// Map des icônes par service_id
const SERVICE_ICONS = {
  'certified-translation': IconTranslate,
  'certified-true-copy-of-passport': IconPassport,
  'certified-true-copy': IconDocument,
  'online-signature-certification': IconSignature,
  'online-affidavit-sworn-declaration': IconScale,
  'apostille-hague-convention': IconApostille,
  'online-power-of-attorney': IconPower,
  'commercial-administrative-documents': IconDocument,
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
const OtherServicesSection = memo(({ relatedServicesData, language }) => {
  const { t } = useTranslation()
  const { getLocalizedPath } = useLanguage()

  const relatedServices = useMemo(() => {
    return formatServicesForLanguage(relatedServicesData || [], language)
  }, [relatedServicesData, language])

  if (relatedServices.length === 0) {
    return null
  }

  return (
    <section id="other-services" className="py-20 px-4 sm:px-[30px] bg-white overflow-hidden">
      <div className="max-w-[1300px] mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">{t('serviceDetail.relatedServices')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedServices.filter(s => s && s.service_id).map((service) => {
            const ServiceIcon = SERVICE_ICONS[service.service_id] || IconBadgeCheck
            return (
              <Link
                key={service.id || service.service_id}
                href={getLocalizedPath(`/services/${service.service_id}`)}
                className="group bg-gray-50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 border border-gray-200 transform hover:-translate-y-2 grid"
                style={{ gridTemplateRows: 'auto 1fr auto' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 flex-shrink-0">
                    <ServiceIcon />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{service.list_title || service.name}</h3>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed self-start">{service.short_description || service.description}</p>

                <div className="flex flex-col gap-3 items-center pt-4 border-t border-gray-200 self-end">
                  <div className="inline-flex items-center gap-2 group-hover:gap-3 transition-all justify-center text-sm font-semibold text-black underline underline-offset-4 decoration-2">
                    <span className="btn-text inline-block">{t('services.learnMore')}</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                  {service.base_price && (
                    <div className="flex items-center gap-2 justify-center">
                      <PriceDisplay price={service.base_price} showFrom className="text-lg font-bold text-gray-900" />
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
})

export default function ServiceDetailClient({ serviceData, relatedServicesData, serviceId }) {
  const pathname = usePathname()
  const { t } = useTranslation()
  const { language, getLocalizedPath } = useLanguage()
  const { currency, formatPrice } = useCurrency()
  const [ctaPrice, setCtaPrice] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [serviceId])

  // Formater le service selon la langue
  const service = useMemo(() => {
    return formatServiceForLanguage(serviceData, language)
  }, [serviceData, language])

  // Différer le formatage du prix pour ne pas bloquer le rendu initial
  useEffect(() => {
    if (service?.base_price) {
      const timer = setTimeout(() => {
        formatPrice(service.base_price).then(setCtaPrice)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [service?.base_price, formatPrice])

  // Track service view - Plausible uniquement (léger, ~1KB)
  useEffect(() => {
    if (service && serviceId) {
      trackWithPlausible('service', serviceId, service.name, 'service_detail_page')
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

  const formUrl = useMemo(() => {
    return getFormUrl(currency, service?.service_id || serviceId)
  }, [currency, service?.service_id, serviceId])

  const faqItems = useMemo(() => {
    if (!service?.faq) return []
    return service.faq.map((item) => ({
      question: item[`question_${language}`] || item.question_en,
      answer: item[`answer_${language}`] || item.answer_en,
    }))
  }, [service, language])

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl text-gray-900 mb-4 md:mb-6 leading-tight">{t('common.notFound')}</h1>
        <p className="text-gray-600 mb-8">{t('common.error')}</p>
        <Link href={getLocalizedPath('/')} className="primary-cta text-lg px-8 py-4 inline-flex items-center gap-2">
          <IconOpenNew />
          <span className="btn-text inline-block">{t('nav.notarizeNow')}</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title={service.meta_title || service.name || t('serviceDetail.defaultTitle')}
        description={service.meta_description || service.short_description || service.description || ''}
        ogTitle={service.meta_title || service.name || t('serviceDetail.defaultTitle')}
        ogDescription={service.meta_description || service.short_description || service.description || ''}
        twitterTitle={service.meta_title || service.name || t('serviceDetail.defaultTitle')}
        twitterDescription={service.meta_description || service.short_description || service.description || ''}
        canonicalPath={pathname}
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
        ]}
      />
      {/* Hero Section - hauteur fixe pour éviter CLS */}
      <section data-hero className="relative overflow-hidden h-screen flex items-center" style={{ backgroundColor: '#1f2937' }}>
        {/* Image Hero Cloudflare optimisée */}
        <img
          src={HERO_IMG_CLOUDFLARE}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-top"
          fetchPriority="high"
          decoding="async"
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-16 w-full">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white mb-4 lg:mb-6 leading-tight">
              {service.page_h1 || service.name}
            </h1>

            <p className="text-base sm:text-lg text-white/90 mb-6 lg:mb-8 leading-relaxed max-w-2xl">
              {service.short_description || service.description}
            </p>

            <div className="flex flex-row flex-wrap items-center gap-3 mb-8 lg:mb-12">
              <a 
                href={formUrl} 
                className="text-base lg:text-lg text-white flex-shrink-0 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-all"
                style={{ 
                  display: 'inline-flex', 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  gap: '8px',
                  whiteSpace: 'nowrap'
                }}
                onClick={() => {
                  const ctaCopy = service.cta || t('nav.notarizeNow')
                  const destination = formUrl
                  
                  trackWithPlausible('cta', 'service_detail_hero', service?.service_id || serviceId, pathname, {
                    ctaText: ctaCopy,
                    destination,
                    elementId: 'service_detail_hero'
                  })
                }}
              >
                <IconOpenNew />
                <span style={{ whiteSpace: 'nowrap' }}>
                  {service.cta || t('nav.notarizeNow')}
                </span>
              </a>
              {ctaPrice && (
                <div className="text-white flex items-center gap-1">
                  <span className="text-base font-semibold">{ctaPrice}</span>
                  <span className="text-xs font-normal text-white/70">{t('services.perDocument')} - no hidden fee</span>
                </div>
              )}
            </div>

            {/* Features - CSS responsive uniquement, pas de JS */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-8 mt-6 lg:mt-8">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <IconWorld />
                <span className="text-white font-medium text-sm lg:text-base">{t('hero.feature1')}</span>
              </div>

              <div className="flex items-center gap-2 whitespace-nowrap">
                <IconFlash />
                <span className="text-white font-medium text-sm lg:text-base">{t('hero.feature2')}</span>
              </div>

              <div className="flex items-center gap-2 whitespace-nowrap">
                <IconLock />
                <span className="text-white font-medium text-sm lg:text-base">{t('hero.feature3')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Two Column Layout */}
      <section
        className="min-h-screen flex items-center justify-center px-4 sm:px-[30px] py-8 sm:py-16 relative"
        style={{ backgroundColor: '#F7F5F2' }}
      >
        <div className="max-w-[1300px] w-full mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left Side - Image SVG */}
            <div className="lg:w-2/5 flex items-center justify-center">
              <img
                src={PRICING_IMG_CLOUDFLARE}
                alt={service.name}
                className="w-full h-auto rounded-2xl object-cover"
                style={{ maxHeight: '800px' }}
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Right Side - Pricing Block */}
            <div className="lg:w-3/5 flex flex-col">
              <div 
                className="rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col h-full"
                style={{
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)'
                }}
              >
                {/* Top Section - Black Background */}
                <div 
                  className="p-6 sm:p-8 lg:p-10 xl:p-12"
                  style={{
                    background: '#000000'
                  }}
                >
                  {/* Price Section */}
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-white">{service.name}</h2>
                  
                    {service.base_price ? (
                      <>
                        <div className="mb-4 sm:mb-6">
                          <div className="flex items-baseline gap-2 mb-2 sm:mb-3">
                            <PriceDisplay 
                              price={service.base_price} 
                              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white"
                            />
                          </div>
                          <p className="text-xs sm:text-sm text-gray-400">{t('services.perDocument')}</p>
                        </div>
                      </>
                    ) : (
                      <div>
                        <p className="text-base sm:text-lg text-gray-300">{t('serviceDetail.pricing.contactForPricing')}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Section - White Background */}
                <div 
                  className="p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col flex-1"
                  style={{
                    background: '#ffffff'
                  }}
                >
                  {/* Benefits List - Optimisé sans animations coûteuses */}
                  <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4 flex-1">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <IconCheckCircle />
                      <div>
                        <h3 className="text-gray-900 text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.legallyValid.title')}</h3>
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.legallyValid.description')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 sm:gap-4">
                      <IconCheckCircle />
                      <div>
                        <h3 className="text-gray-900 text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.sameDay.title')}</h3>
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.sameDay.description')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 sm:gap-4">
                      <IconCheckCircle />
                      <div>
                        <h3 className="text-gray-900 text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.officialNotarization.title')}</h3>
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.officialNotarization.description')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 sm:gap-4">
                      <IconCheckCircle />
                      <div>
                        <h3 className="text-gray-900 text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.available247.title')}</h3>
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.available247.description')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 sm:gap-4">
                      <IconCheckCircle />
                      <div>
                        <h3 className="text-gray-900 text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.transparentFee.title')}</h3>
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.transparentFee.description')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 sm:gap-4">
                      <IconCheckCircle />
                      <div>
                        <h3 className="text-gray-900 text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.bankGradeSecurity.title')}</h3>
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.bankGradeSecurity.description')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 sm:gap-4">
                      <IconCheckCircle />
                      <div>
                        <h3 className="text-gray-900 text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.globalCompliance.title')}</h3>
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.globalCompliance.description')}</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button - Simplifié sans animations coûteuses */}
                  <a
                    href={formUrl}
                    onClick={() => {
                      const destination = formUrl
                      trackWithPlausible('cta', 'service_detail_pricing', service?.service_id || serviceId, pathname, {
                        ctaText: 'Upload my document',
                        destination,
                        elementId: 'service_detail_pricing'
                      })
                    }}
                    className="block w-full text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 text-white font-bold rounded-xl transition-colors duration-200 text-center bg-black hover:bg-gray-900 shadow-lg cursor-pointer"
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

      {/* What is Section - content-visibility pour optimisation */}
      <section className="py-20 px-[30px] bg-gray-50 content-visibility-auto">
        <div className="max-w-[1300px] mx-auto">
          <WhatIsContent service={service} t={t} />
        </div>
      </section>

      {/* Chat CTA Section */}
      <ChatCTA />

      {/* Testimonial Section */}
      <Testimonial />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Other Services Section */}
      <OtherServicesSection relatedServicesData={relatedServicesData} language={language} />

      {/* FAQ Section */}
      {faqItems.length > 0 && <FAQ faqsData={faqItems} />}

      {/* Back to Services */}
      <section className="px-[30px] py-12">
        <div className="max-w-[1100px] mx-auto text-center">
          <Link href={getLocalizedPath('/#services')} className="inline-flex items-center gap-3 text-black font-semibold hover:underline">
            <IconArrowLeft />
            <span>{t('serviceDetail.backToServices')}</span>
          </Link>
        </div>
      </section>

      {/* Mobile CTA */}
      <MobileCTA ctaText={service.cta || t('nav.notarizeNow')} price={service.base_price} serviceId={service?.service_id || serviceId} />
    </div>
  )
}
