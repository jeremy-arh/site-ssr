'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import SEOHead from '@/components/SEOHead'
import StructuredData from '@/components/StructuredData'
import { useCurrency } from '@/contexts/CurrencyContext'
import { getFormUrl } from '@/utils/formUrl'
import { getCanonicalUrl } from '@/utils/canonicalUrl'
import { useTranslation } from '@/hooks/useTranslation'
import { useLanguage } from '@/contexts/LanguageContext'
import PriceDisplay from '@/components/PriceDisplay'
import ServicesGridBlock from '@/components/ServicesGridBlock'
import dynamic from 'next/dynamic'
import { trackCTAToFormOnService } from '@/utils/gtm'

import HowItWorks from '@/components/HowItWorks'
import NeedAssistanceCTA from '@/components/NeedAssistanceCTA'
import FAQ from '@/components/FAQ'
import TrustpilotSlider from '@/components/TrustpilotSlider'

const MobileCTA = dynamic(() => import('@/components/MobileCTA'), { ssr: true })
const ChatCTA = dynamic(() => import('@/components/ChatCTA'), { ssr: true })

const PRICING_IMG = 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/2207777e-4fd2-441a-4447-820672f68b00/f=webp,q=80'
const HERO_IMG = 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/aa0b6231-eb7d-4a68-a985-249ba265d500/public'
const CERTIFICATE_IMG = 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/7828fe57-4fc5-4a0b-57a2-51593b2ab000/f=webp,q=80'
const VALID_IMG = 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/01529a7e-1628-4385-60ff-e85c87731700/f=webp,q=80'

const trackWithAnalytics = (type, ...args) => {
  import('@/utils/analytics').then((m) => {
    if (type === 'service') m.trackServiceClick(...args)
    else if (type === 'cta') m.trackCTAClick(...args)
  }).catch(() => {})
}

const IconWorld = () => (
  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-gray-900 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
)
const IconFlash = () => (
  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-gray-900 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
)
const IconLock = () => (
  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-gray-900 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)
const IconOpenNew = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zm-2 16H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7h-7z"/>
  </svg>
)
const IconCheckCircle = () => (
  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
  </svg>
)
const IconUpload = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
  </svg>
)
const IconArrowRight = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)
const IconArrowLeft = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
)

const HARDCODED_FAQS = [
  {
    question: 'What is an online notary service?',
    answer: 'An online notary service allows you to get documents notarized remotely via secure video call. Instead of visiting a notary in person, you connect with a licensed notary online, verify your identity, and complete the notarization digitally. The process is legally valid and recognized internationally when apostilled under The Hague Convention.',
  },
  {
    question: 'Is online notarization legally valid?',
    answer: 'Yes. Online notarization (Remote Online Notarization or RON) is legally recognized in many jurisdictions worldwide. Documents notarized through our platform can receive an apostille under The Hague Convention, ensuring international validity across member countries including the EU, US, UK, and many others.',
  },
  {
    question: 'What documents can I get notarized online?',
    answer: 'You can notarize a wide range of documents online: affidavits and sworn declarations, certified true copies (passports, IDs, diplomas), powers of attorney, business documents, certified translations, and more. Each document is securely signed, sealed, and stored in your private dashboard.',
  },
  {
    question: 'How long does online notarization take?',
    answer: 'The entire process typically takes 15-30 minutes. You upload your document, schedule a video call with a licensed notary, verify your identity, and complete the notarization. Your notarized document is available immediately after the session.',
  },
  {
    question: 'How much does an online notary service cost?',
    answer: 'Our services start from €79 per document. Pricing varies by service type (affidavit, certified copy, apostille, etc.). All prices are transparent with no hidden fees. You can view the exact price before starting your notarization.',
  },
]

export default function OnlineNotaryServiceClient({ relatedServicesData }) {
  const pathname = usePathname()
  const { t } = useTranslation('en')
  const { getLocalizedPath } = useLanguage()
  const { currency } = useCurrency()
  const [ctaPrice, setCtaPrice] = useState('')

  const formUrl = getFormUrl(currency, null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  useEffect(() => {
    setCtaPrice('€79')
  }, [currency])

  const breadcrumbItems = [
    { name: t('common.home') || 'Home', url: '/' },
    { name: 'Online Notary Service', url: pathname },
  ]

  return (
    <div className="min-h-screen w-full max-w-full" style={{ overflowX: 'clip' }}>
      <SEOHead
        title="Online Notary Service | Notarize Documents Online in Minutes"
        description="Professional online notary service. Get your documents notarized online 24/7. Fast, secure, and legally recognized worldwide. Certified true copies, affidavits, apostilles & more."
        ogTitle="Online Notary Service | Notarize Documents Online"
        ogDescription="Professional online notary service. Get documents notarized online 24/7. Legally recognized worldwide."
        twitterTitle="Online Notary Service | Notarize Documents Online"
        twitterDescription="Professional online notary service. Fast, secure, legally recognized worldwide."
        serverLanguage="en"
      />
      <StructuredData
        type="Service"
        data={{
          serviceName: 'Online Notary Service',
          serviceDescription: 'Professional online notary service. Get your documents notarized online 24/7. Fast, secure, and legally recognized worldwide.',
          '@id': getCanonicalUrl(pathname),
        }}
        additionalData={[
          { type: 'BreadcrumbList', data: { items: breadcrumbItems } },
          { type: 'FAQPage', data: { faqItems: HARDCODED_FAQS } },
        ]}
      />

      {/* Hero */}
      <section data-hero className="relative flex flex-col lg:flex-row overflow-x-hidden w-full max-w-full">
        <div className="w-full lg:w-1/2 flex flex-col items-start px-6 sm:px-12 lg:px-16 py-16 lg:py-0" style={{ backgroundColor: '#F7F5F2' }}>
          <div className="w-full">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-gray-900 mb-4 lg:mb-6 leading-tight">
              Online Notary Service
            </h1>
            <p className="text-base sm:text-lg text-gray-700 mb-6 lg:mb-8 leading-relaxed">
              Get your documents notarized online in minutes. Our professional online notary service is fast, secure, and legally recognized worldwide. Certified true copies, affidavits, apostilles, and more.
            </p>
            <div className="flex flex-col items-start gap-4 mb-8 lg:mb-12">
              <div className="flex flex-row flex-wrap items-center gap-3">
                <a
                  id="hero-cta"
                  href={formUrl}
                  className="text-[10px] min-[380px]:text-xs sm:text-sm md:text-base lg:text-lg text-white flex-shrink-0 bg-blue-600 hover:bg-blue-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all inline-flex items-center gap-2 whitespace-nowrap"
                  onClick={(e) => {
                    e.preventDefault()
                    trackWithAnalytics('cta', 'online_notary_service_hero', null, pathname, { ctaText: 'Start your notarization', destination: formUrl, elementId: 'online_notary_service_hero' })
                    trackCTAToFormOnService('online_notary_service_hero', pathname, 'Start your notarization', formUrl, 'online_notary_service_hero', null, currency)
                    setTimeout(() => { window.location.href = formUrl }, 100)
                  }}
                >
                  <IconOpenNew />
                  <span>Start your notarization</span>
                </a>
                {ctaPrice && (
                  <div className="text-gray-900 flex items-center gap-1 whitespace-nowrap">
                    <span className="text-[10px] min-[380px]:text-xs sm:text-sm md:text-base font-semibold">From {ctaPrice}</span>
                    <span className="text-[9px] min-[380px]:text-[10px] sm:text-xs font-normal text-gray-600">{t('services.perDocument')} - no hidden fee</span>
                  </div>
                )}
              </div>
              <NeedAssistanceCTA
                textColor="text-black"
                analyticsContext="online_notary_service_hero"
                onTrack={(ctaText, destination, elementId) => {
                  trackWithAnalytics('cta', 'online_notary_service_hero', null, pathname, { ctaText, destination, elementId })
                }}
                className="mb-0"
              />
            </div>
            <div className="flex flex-col xl:flex-row items-start xl:items-center gap-3 xl:gap-6">
              <div className="flex items-center gap-2">
                <IconWorld />
                <span className="text-gray-900 font-medium text-[10px] min-[380px]:text-xs sm:text-sm lg:text-base whitespace-nowrap">{t('hero.feature1')}</span>
              </div>
              <div className="flex items-center gap-2">
                <IconFlash />
                <span className="text-gray-900 font-medium text-[10px] min-[380px]:text-xs sm:text-sm lg:text-base whitespace-nowrap">{t('hero.feature2')}</span>
              </div>
              <div className="flex items-center gap-2">
                <IconLock />
                <span className="text-gray-900 font-medium text-[10px] min-[380px]:text-xs sm:text-sm lg:text-base whitespace-nowrap">{t('hero.feature3')}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex w-1/2 relative">
          <img src={HERO_IMG} alt="" className="absolute inset-0 w-full h-full object-cover" fetchPriority="high" />
        </div>
      </section>

      <TrustpilotSlider serverLanguage="en" />

      <ServicesGridBlock
          services={relatedServicesData || []}
          title={t('serviceDetail.relatedServicesOnlineNotary') || t('serviceDetail.relatedServices')}
          analyticsContext="online_notary_service_page"
        />

      <ChatCTA title={t('chatCTA.servicesTitle')} />

      {/* Pricing */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-[30px] py-8 sm:py-12 md:py-16 relative overflow-x-hidden w-full max-w-full" style={{ backgroundColor: '#F7F5F2' }}>
        <div className="max-w-[1300px] w-full mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8 items-start justify-start">
            <div className="w-full lg:w-2/5 flex items-center justify-center">
              <img src={PRICING_IMG} alt="Online notary service" className="w-full h-auto rounded-xl md:rounded-2xl object-contain" loading="lazy" decoding="async" />
            </div>
            <div className="w-full lg:w-3/5 flex flex-col">
              <div className="rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden flex flex-col h-full" style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)' }}>
                <div className="p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12" style={{ background: '#000000' }}>
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 md:mb-6 text-white">Online Notary Service</h2>
                  <div className="mb-3 sm:mb-4 md:mb-6">
                    <div className="flex items-baseline gap-2 mb-2 sm:mb-3">
                      <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">From €79</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400">{t('services.perDocument')}</p>
                  </div>
                </div>
                <div className="p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 flex flex-col flex-1" style={{ background: '#ffffff' }}>
                  <div className="mb-5 sm:mb-6 md:mb-8 space-y-2.5 sm:space-y-3 md:space-y-4 flex-1">
                    {[
                      { title: t('serviceDetail.pricing.benefits.legallyValid.title'), desc: t('serviceDetail.pricing.benefits.legallyValid.description') },
                      { title: t('serviceDetail.pricing.benefits.sameDay.title'), desc: t('serviceDetail.pricing.benefits.sameDay.description') },
                      { title: t('serviceDetail.pricing.benefits.officialNotarization.title'), desc: t('serviceDetail.pricing.benefits.officialNotarization.description') },
                      { title: t('serviceDetail.pricing.benefits.available247.title'), desc: t('serviceDetail.pricing.benefits.available247.description') },
                      { title: t('serviceDetail.pricing.benefits.transparentFee.title'), desc: t('serviceDetail.pricing.benefits.transparentFee.description') },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 sm:gap-3 md:gap-4">
                        <IconCheckCircle />
                        <div>
                          <h3 className="text-gray-900 text-xs sm:text-sm md:text-base font-semibold mb-0.5 sm:mb-1">{item.title}</h3>
                          <p className="text-gray-700 text-[11px] sm:text-xs md:text-sm leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <a
                    href={formUrl}
                    onClick={(e) => {
                      e.preventDefault()
                      trackCTAToFormOnService('online_notary_service_pricing', pathname, 'Upload my document', formUrl, 'online_notary_service_pricing', null, currency)
                      setTimeout(() => { window.location.href = formUrl }, 100)
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

      {/* Features */}
      <section className="py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-[30px] bg-white overflow-x-hidden w-full max-w-full">
        <div className="max-w-[1300px] mx-auto space-y-16 md:space-y-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 min-h-[400px] lg:min-h-[500px]">
            <div className="flex items-center justify-center order-2 lg:order-1">
              <div className="w-full max-w-md">
                <img src={CERTIFICATE_IMG} alt={t('serviceDetail.whatYouReceive.title')} className="w-full h-auto rounded-[30px] object-cover shadow-xl" loading="lazy" decoding="async" />
                <p className="text-xs text-gray-400 mt-3 text-center italic">
                  {t('serviceDetail.whatYouReceive.disclaimer')}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center order-1 lg:order-2">
              <div className="w-full max-w-md text-left">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">{t('serviceDetail.whatYouReceive.title')}</h2>
                <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8">{t('serviceDetail.whatYouReceive.subtitle')}</p>
                <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                  {[t('serviceDetail.whatYouReceive.items.official'), t('serviceDetail.whatYouReceive.items.notaryInfo'), t('serviceDetail.whatYouReceive.items.dateRef'), t('serviceDetail.whatYouReceive.items.digitalPdf'), t('serviceDetail.whatYouReceive.items.permanentAccess')].map((text, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <IconCheckCircle />
                      <span className="text-gray-700 text-sm md:text-base">{text}</span>
                    </li>
                  ))}
                </ul>
                <a href={formUrl} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors" onClick={(e) => { e.preventDefault(); window.location.href = formUrl }}>
                  <span>{t('serviceDetail.whatYouReceive.cta')}</span>
                  <IconArrowRight />
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 min-h-[400px] lg:min-h-[500px]">
            <div className="flex items-center justify-center order-1 lg:order-1">
              <div className="w-full max-w-md text-left">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">{t('serviceDetail.validForPurpose.title')}</h2>
                <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8">{t('serviceDetail.validForPurpose.subtitle')}</p>
                <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                  {[t('serviceDetail.validForPurpose.items.bankAccount'), t('serviceDetail.validForPurpose.items.visa'), t('serviceDetail.validForPurpose.items.university'), t('serviceDetail.validForPurpose.items.property'), t('serviceDetail.validForPurpose.items.company')].map((text, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <IconCheckCircle />
                      <span className="text-gray-700 text-sm md:text-base">{text}</span>
                    </li>
                  ))}
                </ul>
                <a href={formUrl} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors" onClick={(e) => { e.preventDefault(); window.location.href = formUrl }}>
                  <span>{t('serviceDetail.validForPurpose.cta')}</span>
                  <IconArrowRight />
                </a>
              </div>
            </div>
            <div className="flex items-center justify-center order-2 lg:order-2">
              <img src={VALID_IMG} alt="Valid for any official purpose" className="w-full max-w-md h-auto rounded-[30px] object-cover shadow-xl" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />

      {/* What is Online Notary Service */}
      <section className="py-20 px-[30px] bg-gray-50 overflow-x-hidden w-full max-w-full">
        <div className="max-w-[1300px] mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-12 text-center">
            What is an Online Notary Service?
          </h2>
          <div className="max-w-6xl mx-auto blog-content">
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
              An <strong>online notary service</strong> allows you to get documents notarized remotely through a secure video call with a licensed notary public. Instead of scheduling in-person appointments, traveling to a notary office, or waiting for availability, you can complete the entire process from anywhere with an internet connection.
            </p>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
              Our <strong>notary online</strong> platform supports a wide range of notarial services: certified true copies of passports and IDs, affidavits and sworn declarations, powers of attorney, business document notarization, certified translations, and apostilles under The Hague Convention. All documents are legally valid and internationally recognized.
            </p>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
              Whether you need a <strong>notary service</strong> for immigration, banking, real estate, or legal proceedings, our platform delivers the same legal validity as traditional in-person notarization—with the convenience of completing everything online in 15-30 minutes.
            </p>
          </div>
        </div>
      </section>

      <FAQ faqsData={HARDCODED_FAQS} />

      <section className="px-[30px] py-12">
        <div className="max-w-[1100px] mx-auto text-center">
          <a
            href={getLocalizedPath('/#services')}
            className="inline-flex items-center gap-3 text-black font-semibold hover:underline cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              window.location.href = getLocalizedPath('/#services')
            }}
          >
            <IconArrowLeft />
            <span>{t('serviceDetail.backToServices')}</span>
          </a>
        </div>
      </section>

      <MobileCTA ctaText="Start your notarization" price={79} priceUsd={94} priceGbp={67} serviceId={null} />
    </div>
  )
}
