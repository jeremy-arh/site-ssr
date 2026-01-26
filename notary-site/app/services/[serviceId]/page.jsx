import { getService, getServices, getFAQs } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import ServiceDetailClient from './ServiceDetailClient'
import { DEFAULT_LANGUAGE } from '@/utils/language'
import { formatServiceForLanguage, formatServicesForLanguage } from '@/utils/services'

// Forcer le rendu dynamique (SSR) - pas de prerendering statique  
export const dynamic = 'force-dynamic'

// Générer les métadonnées avec canonical et hreflang pour chaque service
// eslint-disable-next-line react-refresh/only-export-components
export async function generateMetadata({ params }) {
  const { serviceId } = await params
  return {
    alternates: {
      canonical: `https://www.mynotary.io/services/${serviceId}`,
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

// Cette page est un Server Component qui récupère les données côté serveur (SSR)
export default async function ServiceDetail({ params }) {
  const { serviceId } = await params

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

  // PRÉ-FORMATER LES DONNÉES CÔTÉ SERVEUR (anglais par défaut)
  const formattedService = formatServiceForLanguage(serviceData, DEFAULT_LANGUAGE)
  const formattedRelatedServices = formatServicesForLanguage(relatedServices, DEFAULT_LANGUAGE)

  return (
    <ServiceDetailClient
      serviceData={formattedService}
      relatedServicesData={formattedRelatedServices}
      serviceId={serviceId}
      faqsData={faqsData}
      serverLanguage={DEFAULT_LANGUAGE}
    />
  )
}
