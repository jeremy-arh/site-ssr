import { getService, getServices, getFAQs } from '@/lib/supabase-server'
import { notFound, redirect } from 'next/navigation'
import ServiceDetailClient from '../../../services/[serviceId]/ServiceDetailClient'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/utils/language'
import { formatServiceForLanguage, formatServicesForLanguage } from '@/utils/services'

// Forcer le rendu dynamique (SSR) - pas de prerendering statique
export const dynamic = 'force-dynamic'

// Générer les métadonnées avec canonical et hreflang pour chaque langue et service
// eslint-disable-next-line react-refresh/only-export-components
export async function generateMetadata({ params }) {
  const { lang, serviceId } = await params
  return {
    alternates: {
      canonical: `https://www.mynotary.io/${lang}/services/${serviceId}`,
      languages: {
        'x-default': `https://www.mynotary.io/services/${serviceId}`,
        'en': `https://www.mynotary.io/services/${serviceId}`,
        'fr': `https://www.mynotary.io/fr/services/${serviceId}`,
        'es': `https://www.mynotary.io/es/services/${serviceId}`,
        'de': `https://www.mynotary.io/de/services/${serviceId}`,
        'it': `https://www.mynotary.io/it/services/${serviceId}`,
        'pt': `https://www.mynotary.io/pt/services/${serviceId}`,
      },
    },
  }
}

export default async function LangServiceDetail({ params }) {
  const { lang, serviceId } = await params

  if (!SUPPORTED_LANGUAGES.includes(lang) || lang === DEFAULT_LANGUAGE) {
    redirect(`/services/${serviceId}`)
  }

  const [serviceData, allServicesData, generalFaqsData] = await Promise.all([
    getService(serviceId),
    getServices(),
    getFAQs(),
  ])

  if (!serviceData) {
    notFound()
  }

  const relatedServices = allServicesData
    .filter(s => s.service_id !== serviceId && s.show_in_list === true)

  // Utiliser les FAQs du service si disponibles, sinon fallback sur les FAQs générales
  let serviceFaqs = null
  
  if (serviceData.faqs) {
    if (typeof serviceData.faqs === 'string') {
      try {
        serviceFaqs = JSON.parse(serviceData.faqs)
      } catch (e) {
        console.error('Error parsing service FAQs JSON:', e)
      }
    } else if (Array.isArray(serviceData.faqs)) {
      serviceFaqs = serviceData.faqs
    }
    
    if (!Array.isArray(serviceFaqs) || serviceFaqs.length === 0) {
      serviceFaqs = null
    }
  }

  const faqsData = serviceFaqs || generalFaqsData

  // PRÉ-FORMATER LES DONNÉES CÔTÉ SERVEUR selon la langue
  const formattedService = formatServiceForLanguage(serviceData, lang)
  const formattedRelatedServices = formatServicesForLanguage(relatedServices, lang)

  return (
    <ServiceDetailClient
      serviceData={formattedService}
      relatedServicesData={formattedRelatedServices}
      serviceId={serviceId}
      faqsData={faqsData}
      serverLanguage={lang}
    />
  )
}
