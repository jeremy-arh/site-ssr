'use client'

import SEOHead from '@/components/SEOHead'
import { useTranslation } from '@/hooks/useTranslation'
import MobileCTA from '@/components/MobileCTA'
import TrustpilotSlider from '@/components/TrustpilotSlider'
import ServicesGridBlock from '@/components/ServicesGridBlock'

export default function ServicesClient({ servicesData, serverLanguage }) {
  const { t } = useTranslation(serverLanguage)

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

      <TrustpilotSlider serverLanguage={serverLanguage} />

      <ServicesGridBlock
        services={services}
        title={`${t('services.heading')} ${t('services.headingHighlight')}`}
        analyticsContext="services_page"
      />
      
      <MobileCTA />
    </div>
  )
}

