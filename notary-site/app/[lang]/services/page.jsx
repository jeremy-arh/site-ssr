import Link from 'next/link'
import { getServices } from '@/lib/supabase-server'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/utils/language'
import { createTranslator, getLocalizedPath } from '@/lib/translations-server'
import { formatServicesForLanguage } from '@/utils/services'
import { redirect } from 'next/navigation'
import PriceDisplayServer from '@/components/PriceDisplayServer'
import InteractiveElements from '@/components/InteractiveElements'

// Forcer le rendu dynamique (SSR)
export const dynamic = 'force-dynamic'

// Générer les métadonnées côté serveur
export async function generateMetadata({ params }) {
  const { lang } = await params
  const language = SUPPORTED_LANGUAGES.includes(lang) ? lang : DEFAULT_LANGUAGE
  const t = createTranslator(language)
  return {
    title: t('seo.servicesTitle'),
    description: t('seo.servicesDescription'),
    openGraph: {
      title: t('seo.servicesTitle'),
      description: t('seo.servicesDescription'),
    },
  }
}

// Service Icons SVG inline
const SERVICE_ICONS = {
  'certified-translation': () => (
    <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12.913 17H20.087M12.913 17L11 21M12.913 17L16.5 9L20.087 17M20.087 17L22 21"/>
      <path d="M2 5H8M8 5H11M8 5V3M11 5H14M11 5C10.5 9 9.5 11.5 8 14"/>
      <path d="M5 10C5.5 11.5 6.5 13 8 14M8 14C9 15 11 16.5 14 16.5"/>
    </svg>
  ),
  'certified-true-copy-of-passport': () => (
    <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M8 17h8"/>
    </svg>
  ),
  'certified-true-copy': () => (
    <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
    </svg>
  ),
  'online-signature-certification': () => (
    <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 19H4M4 15l3-3 2 2 4-4 3 3 4-4"/><circle cx="18" cy="7" r="3"/>
    </svg>
  ),
  'online-affidavit-sworn-declaration': () => (
    <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3v18M3 9l3-3 3 3M18 9l3-3-3-3M6 9v6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V9"/>
      <path d="M3 9a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3"/>
    </svg>
  ),
  'apostille-hague-convention': () => (
    <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/><path d="M2 12h2M20 12h2M12 2v2M12 20v2"/>
    </svg>
  ),
  'online-power-of-attorney': () => (
    <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <path d="M14 2v6h6"/><path d="M9 15l2 2 4-4"/>
    </svg>
  ),
  'commercial-administrative-documents': () => (
    <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
    </svg>
  ),
  'default': () => (
    <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
}

const getServiceIcon = (serviceId) => {
  return SERVICE_ICONS[serviceId] || SERVICE_ICONS['default']
}

export default async function LangServices({ params }) {
  const { lang } = await params

  if (!SUPPORTED_LANGUAGES.includes(lang) || lang === DEFAULT_LANGUAGE) {
    redirect('/services')
  }

  const language = lang
  const t = createTranslator(language)
  const localizedPath = (path) => getLocalizedPath(path, language)

  // Récupérer et formater les données côté serveur
  const servicesData = await getServices()
  const services = formatServicesForLanguage(
    servicesData.filter(s => s.show_in_list === true),
    language
  )

  return (
    <div className="min-h-screen">
      {/* Hero Section - 100% Server Rendered */}
      <section className="pt-32 pb-16 px-[30px] bg-gray-50" data-hero>
        <div className="max-w-[1300px] mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-semibold mb-4 animate-fade-in">
            {t('services.title')}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in animation-delay-100">
            {t('services.heading')}<br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{t('services.headingHighlight')}</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto animate-fade-in animation-delay-200">
            {t('services.subtitle')}
          </p>
        </div>
      </section>

      {/* Services Grid - 100% Server Rendered */}
      <section className="py-20 px-4 sm:px-[30px] bg-white">
        <div className="max-w-[1300px] mx-auto">
          {services.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">{t('services.noServices')}</p>
            </div>
          ) : (
            <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => {
                const ServiceIcon = getServiceIcon(service.service_id)
                return (
                  <Link
                    key={service.id}
                    href={localizedPath(`/services/${service.service_id}`)}
                    className="group block bg-gray-50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 border border-gray-200 transform hover:-translate-y-2 flex flex-col"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                        <ServiceIcon />
                      </div>
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
                        <PriceDisplayServer 
                          price={service.base_price} 
                          showFrom 
                          className="text-lg font-bold text-gray-900" 
                          perDocumentText={t('services.perDocument')}
                        />
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
      
      {/* Mobile CTA */}
      <InteractiveElements.MobileCTA ctaText={t('nav.notarizeNow')} />
    </div>
  )
}
