'use client'

import { useEffect, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import SEOHead from '@/components/SEOHead'
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

export default function ServiceDetailClient({ serviceData, relatedServicesData, serviceId }) {
  const pathname = usePathname()
  const { t } = useTranslation()
  const { language, getLocalizedPath } = useLanguage()
  const { currency } = useCurrency()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [serviceId])

  // Formater le service selon la langue
  const service = useMemo(() => {
    return formatServiceForLanguage(serviceData, language)
  }, [serviceData, language])

  // Formater les services liés selon la langue
  const relatedServices = useMemo(() => {
    return formatServicesForLanguage(relatedServicesData || [], language)
  }, [relatedServicesData, language])

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">{t('serviceDetail.notFoundTitle') || 'Service not found'}</p>
      </div>
    )
  }

  const formUrl = useMemo(() => {
    return getFormUrl(currency, serviceId)
  }, [currency, serviceId])

  const faqItems = useMemo(() => {
    if (!service?.faq) return []
    return service.faq.map((item) => ({
      question: item[`question_${language}`] || item.question_en,
      answer: item[`answer_${language}`] || item.answer_en,
    }))
  }, [service, language])

  const serviceTitle = service[`name_${language}`] || service.name_en || service.name
  const serviceDescription = service[`description_${language}`] || service.description_en || service.description
  const serviceShortDescription = service[`short_description_${language}`] || service.short_description_en || service.short_description

  return (
    <div className="min-h-screen">
      <SEOHead
        title={service.seo_title?.[language] || service.seo_title?.en || serviceTitle}
        description={service.seo_description?.[language] || service.seo_description?.en || serviceShortDescription}
        ogTitle={service.og_title?.[language] || service.og_title?.en || serviceTitle}
        ogDescription={service.og_description?.[language] || service.og_description?.en || serviceShortDescription}
        ogImage={service.og_image_url || service.cover_image_url}
        twitterTitle={service.twitter_title?.[language] || service.twitter_title?.en || serviceTitle}
        twitterDescription={service.twitter_description?.[language] || service.twitter_description?.en || serviceShortDescription}
        twitterImage={service.twitter_image_url || service.cover_image_url}
        canonicalPath={getLocalizedPath(`/services/${service.service_id}`)}
      />
      <StructuredData
        type="Service"
        data={{
          '@id': getCanonicalUrl(getLocalizedPath(`/services/${service.service_id}`)),
          name: serviceTitle,
          description: serviceShortDescription,
          serviceType: service.service_id,
          areaServed: {
            '@type': 'Country',
            name: 'Worldwide',
          },
          provider: {
            '@type': 'Organization',
            name: 'My notary',
            url: getCanonicalUrl('/'),
          },
          offers: {
            '@type': 'Offer',
            priceCurrency: currency,
            price: service.base_price,
            availability: 'https://schema.org/InStock',
          },
        }}
      />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-[30px] bg-gray-50" data-hero>
        <div className="max-w-[1300px] mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-semibold mb-4 animate-fade-in">
            {service.list_title || serviceTitle}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in animation-delay-100">
            {service.hero_title || serviceTitle}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto animate-fade-in animation-delay-200">
            {service.hero_subtitle || serviceShortDescription}
          </p>
          {formUrl && (
            <div className="mt-8 animate-fade-in animation-delay-300">
              <Link href={formUrl} className="primary-cta text-lg px-8 py-4 inline-flex items-center gap-3">
                <span className="btn-text inline-block">{service.cta || t('serviceDetail.ctaButton')}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-[30px] bg-white">
        <div className="max-w-[1300px] mx-auto">
          <div className="prose prose-lg max-w-none text-gray-600 mb-10" dangerouslySetInnerHTML={{ __html: serviceDescription }} />
        </div>
      </section>

      {/* How It Works Section */}
      {service.how_it_works && service.how_it_works.length > 0 && (
        <section className="py-20 px-[30px] bg-gray-100">
          <div className="max-w-[1300px] mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">{t('serviceDetail.howItWorks')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {service.how_it_works.map((step, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-md border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step[`title_${language}`] || step.title_en || step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step[`description_${language}`] || step.description_en || step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonial Section */}
      <Testimonial />

      {/* FAQ Section */}
      {faqItems.length > 0 && <FAQ faqsData={faqItems} />}

      {/* Related Services Section */}
      {relatedServices.length > 0 && (
        <section className="py-20 px-[30px] bg-gray-50">
          <div className="max-w-[1300px] mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">{t('serviceDetail.relatedServices')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedServices.map((relatedService) => (
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
      )}

      <ChatCTA />
      <MobileCTA />
    </div>
  )
}

