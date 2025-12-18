import Link from 'next/link'
import { getLocalizedPath } from '@/lib/translations-server'
import InteractiveElements from '@/components/InteractiveElements'
import PriceDisplayServer from '@/components/PriceDisplayServer'

// Images optimisées
const HERO_IMG_DESKTOP = 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/d0f6bfc4-a8db-41e1-87e2-7c7e0b7a1c00/q=20,f=webp'
const HERO_IMG_MOBILE = 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/d0f6bfc4-a8db-41e1-87e2-7c7e0b7a1c00/w=800,q=20,f=webp'

// SVG Icons (inline pour éviter les requêtes)
const IconWorld = () => (
  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
)
const IconFlash = () => (
  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
)
const IconLock = () => (
  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)
const IconOpenNew = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zm-2 16H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7h-7z"/>
  </svg>
)
const IconArrowRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
)

// Service Icons Map
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
  'default': () => (
    <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
    </svg>
  ),
}

const getServiceIcon = (serviceId) => {
  return SERVICE_ICONS[serviceId] || SERVICE_ICONS['default']
}

// Composant Server pour la page Home
export default function HomeContent({ language, translations, services, blogPosts, faqsData, testimonialsData }) {
  const t = translations
  const localizedPath = (path) => getLocalizedPath(path, language)

  return (
    <>
      {/* Hero Section - 100% Server Rendered */}
      <section data-hero className="relative overflow-hidden h-screen flex items-center">
        <picture>
          <source media="(max-width: 768px)" srcSet={HERO_IMG_MOBILE} />
          <img
            src={HERO_IMG_DESKTOP}
            alt=""
            width="1920"
            height="1080"
            className="absolute inset-0 w-full h-full object-cover object-top"
            style={{ aspectRatio: '16/9' }}
            fetchPriority="high"
          />
        </picture>
        
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-16 w-full">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white mb-4 lg:mb-6 leading-tight">
              {t.hero.title}
            </h1>

            <p className="text-base sm:text-lg text-white/90 mb-6 lg:mb-8 leading-relaxed max-w-2xl">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-row flex-wrap items-center gap-3 mb-8 lg:mb-12">
              <a 
                href="https://form.mynotary.io" 
                className="primary-cta text-base lg:text-lg inline-flex items-center gap-2 text-white flex-shrink-0 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
              >
                <IconOpenNew />
                <span>{t.hero.cta}</span>
              </a>
            </div>

            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-8 mt-6 lg:mt-8">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <IconWorld />
                <span className="text-white font-medium text-sm lg:text-base">{t.hero.feature1}</span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <IconFlash />
                <span className="text-white font-medium text-sm lg:text-base">{t.hero.feature2}</span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <IconLock />
                <span className="text-white font-medium text-sm lg:text-base">{t.hero.feature3}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Server Rendered */}
      <section id="services" className="py-20 px-4 sm:px-[30px] bg-white scroll-mt-20">
        <div className="max-w-[1300px] mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-semibold mb-4">
              {t.services.title}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {t.services.heading}<br />
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{t.services.headingHighlight}</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t.services.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const ServiceIcon = getServiceIcon(service.service_id)
              return (
                <Link
                  key={service.id}
                  href={localizedPath(`/services/${service.service_id}`)}
                  className="group block bg-gray-50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 border border-gray-200 transform hover:-translate-y-2"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 flex items-center justify-center">
                      <ServiceIcon />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{service.list_title || service.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-6 min-h-[60px] leading-relaxed">{service.short_description}</p>
                  <div className="flex flex-col gap-3 items-center">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-black underline underline-offset-4 decoration-2">
                      {t.services.learnMore}
                      <IconArrowRight />
                    </span>
                    {service.base_price && (
                      <PriceDisplayServer price={service.base_price} showFrom className="text-lg font-bold text-gray-900" perDocumentText={t.services.perDocument} />
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Chat CTA - Server Rendered */}
      <section className="py-16 px-[30px] bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{t.chatCta.title}</h2>
          <p className="text-gray-300 mb-8">{t.chatCta.description}</p>
          <a 
            href="https://form.mynotary.io" 
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            <IconOpenNew />
            {t.chatCta.cta}
          </a>
        </div>
      </section>

      {/* How It Works - Server Rendered */}
      <section id="how-it-works" className="py-20 px-[30px] bg-gray-50 scroll-mt-20">
        <div className="max-w-[1300px] mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-semibold mb-4">
              {t.howItWorks.badge}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              {t.howItWorks.heading}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold mb-4">
                  {num}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t.howItWorks[`step${num}`].title}</h3>
                <p className="text-gray-600 text-sm">{t.howItWorks[`step${num}`].description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Server Rendered avec accordion client */}
      <section id="faq" className="py-20 px-[30px] bg-white scroll-mt-20">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-semibold mb-4">
              {t.faq.badge}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {t.faq.title}
            </h2>
          </div>
          
          <InteractiveElements.FAQAccordion items={t.faq.items} />
        </div>
      </section>

      {/* Blog Section - Server Rendered */}
      {blogPosts.length > 0 && (
        <section className="py-20 px-[30px] bg-gray-50">
          <div className="max-w-[1300px] mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-semibold mb-4">
                {t.blog.badge}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                {t.blog.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Link
                  key={post.id}
                  href={localizedPath(`/blog/${post.slug}`)}
                  className="group block bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all"
                >
                  {post.cover_image_url && (
                    <div className="h-48 overflow-hidden bg-gray-100">
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
                    {post.excerpt && <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>}
                    <span className="text-black font-medium text-sm inline-flex items-center gap-2">
                      {t.blog.readMore} <IconArrowRight />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href={localizedPath('/blog')} className="inline-flex items-center gap-2 text-black font-semibold hover:underline">
                {t.blog.viewAll} <IconArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Mobile CTA - Client Component pour interactivité */}
      <InteractiveElements.MobileCTA ctaText={t.nav.notarizeNow} />
    </>
  )
}

