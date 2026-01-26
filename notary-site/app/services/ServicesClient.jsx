'use client'

import Link from 'next/link'
import SEOHead from '@/components/SEOHead'
import { trackServiceClick } from '@/utils/analytics'
import { useTranslation } from '@/hooks/useTranslation'
import { useLanguage } from '@/contexts/LanguageContext'
import PriceDisplay from '@/components/PriceDisplay'
import MobileCTA from '@/components/MobileCTA'
import TrustpilotSlider from '@/components/TrustpilotSlider'

export default function ServicesClient({ servicesData, serverLanguage }) {
  // Utiliser la langue serveur pour éviter le flash
  const { t } = useTranslation(serverLanguage)
  const { getLocalizedPath } = useLanguage()

  // Les services sont déjà pré-formatés côté serveur
  const services = (servicesData || []).filter(s => s.show_in_list === true)

  return (
    <div className="min-h-screen">
      <SEOHead
        title={t('seo.servicesTitle')}
        description={t('seo.servicesDescription')}
        ogTitle={t('seo.servicesTitle')}
        ogDescription={t('seo.servicesDescription')}
        twitterTitle={t('seo.servicesTitle')}
        twitterDescription={t('seo.servicesDescription')}
        serverLanguage={serverLanguage}
      />
      
      <section className="relative overflow-hidden flex items-center px-[30px] lg:h-[60vh]" data-hero style={{ backgroundColor: '#1f2937' }}>
        {/* Image Hero Cloudflare optimisée */}
        <img
          src="https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/165f7d09-facd-47ad-dd30-db71400aaf00/w=auto,q=auto,f=avif"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          fetchPriority="high"
          decoding="async"
        />
        
        {/* Dark Overlay uniforme */}
        <div className="absolute inset-0 z-[1] bg-black/70"></div>
        
        <div className="relative z-10 max-w-[1300px] mx-auto text-center w-full">
          <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-semibold mb-4 animate-fade-in">
            {t('services.title')}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight animate-fade-in animation-delay-100">
            {t('services.heading')}<br />
            <span>{t('services.headingHighlight')}</span>
          </h1>
          <p className="text-lg text-white/90 max-w-3xl mx-auto animate-fade-in animation-delay-200">
            {t('services.subtitle')}
          </p>
        </div>
      </section>

      <TrustpilotSlider />

      <section className="py-20 px-4 sm:px-[30px] bg-white">
        <div className="max-w-[1300px] mx-auto">
          {services.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">{t('services.noServices')}</p>
            </div>
          ) : (
            <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.filter(s => s && s.service_id).map((service) => {
                const servicePath = `/services/${service.service_id}`
                const localizedHref = getLocalizedPath ? getLocalizedPath(servicePath) : servicePath
                const finalPath = localizedHref || servicePath
                
                const handleServiceClick = (e) => {
                  e.preventDefault();
                  trackServiceClick(service.service_id, service.name, 'services_page');
                  // Forcer un rechargement complet de la page
                  window.location.href = finalPath;
                };
                
                return (
                  <Link
                    key={service.id}
                    href={finalPath}
                    className="group block bg-gray-50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 border border-gray-200 transform hover:-translate-y-2 scroll-slide-up flex flex-col"
                    onClick={handleServiceClick}
                  >
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{service.list_title || service.name}</h3>
                    </div>

                    <p className="text-gray-600 mb-6 min-h-[60px] leading-relaxed flex-1">{service.short_description || service.description}</p>

                    <div className="flex flex-col gap-3 mt-auto items-center">
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
          )}
        </div>
      </section>
      
      <MobileCTA />
    </div>
  )
}

