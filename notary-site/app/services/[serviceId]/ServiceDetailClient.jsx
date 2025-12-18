'use client'

import { useEffect, useMemo, useState, memo } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import SEOHead from '@/components/SEOHead'

// URLs Cloudflare optimisées (AVIF auto, qualité auto)
const HERO_IMG_CLOUDFLARE = 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/763a76aa-aa08-47d4-436f-ca7bea56e900/w=auto,q=auto,f=avif'
const PRICING_IMG_CLOUDFLARE = 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/ab3815ee-dd67-4351-09f2-f661ee7d1000/w=auto,q=auto,f=avif'
import StructuredData from '@/components/StructuredData'
import { useCurrency } from '@/contexts/CurrencyContext'
import { getFormUrl } from '@/utils/formUrl'
import { getCanonicalUrl } from '@/utils/canonicalUrl'
import { useTranslation } from '@/hooks/useTranslation'
import { useLanguage } from '@/contexts/LanguageContext'
import { formatServiceForLanguage, formatServicesForLanguage } from '@/utils/services'
import PriceDisplay from '@/components/PriceDisplay'
import HowItWorks from '@/components/HowItWorks'
import Testimonial from '@/components/Testimonial'
import FAQ from '@/components/FAQ'
import MobileCTA from '@/components/MobileCTA'
import ChatCTA from '@/components/ChatCTA'

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
    <section className="py-20 px-[30px] bg-gray-50">
      <div className="max-w-[1300px] mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">{t('serviceDetail.relatedServices')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedServices.slice(0, 6).map((relatedService) => (
            <Link
              key={relatedService.id}
              href={getLocalizedPath(`/services/${relatedService.service_id}`)}
              className="group block bg-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 border border-gray-200 transform hover:-translate-y-2"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3">{relatedService.list_title || relatedService.name}</h3>
              <p className="text-gray-600 mb-6">{relatedService.short_description || relatedService.description}</p>
              {relatedService.base_price && (
                <PriceDisplay price={relatedService.base_price} showFrom className="text-lg font-bold text-gray-900" />
              )}
            </Link>
          ))}
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
      <section data-hero className="relative overflow-hidden h-screen flex items-center">
        {/* Image Hero Cloudflare optimisée avec next/image */}
        <Image
          src={HERO_IMG_CLOUDFLARE}
          alt=""
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
          quality={85}
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
                className="primary-cta text-base lg:text-lg inline-flex items-center gap-2 text-white flex-shrink-0 bg-blue-600 hover:bg-blue-700"
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
                <span className="btn-text inline-block">
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
            <div className="lg:w-2/5 flex items-center justify-center relative h-[650px]">
              <Image
                src={PRICING_IMG_CLOUDFLARE}
                alt={service.name}
                fill
                className="object-cover rounded-2xl"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={85}
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
