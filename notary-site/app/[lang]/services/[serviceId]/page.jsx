import { getService, getServices, getFAQs } from '@/lib/supabase-server'
import { notFound, redirect } from 'next/navigation'
import ServiceDetailClient from '../../../services/[serviceId]/ServiceDetailClient'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/utils/language'

// Forcer le rendu dynamique (SSR) - pas de prerendering statique
export const dynamic = 'force-dynamic'

// Générer les métadonnées avec canonical pour chaque langue et service
export async function generateMetadata({ params }) {
  const { lang, serviceId } = await params
  return {
    alternates: {
      canonical: `https://www.mynotary.io/${lang}/services/${serviceId}`,
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
  // Le champ faqs est un JSONB qui peut être un tableau, null, ou une string JSON
  let serviceFaqs = null
  
  if (serviceData.faqs) {
    // Si c'est une string, la parser
    if (typeof serviceData.faqs === 'string') {
      try {
        serviceFaqs = JSON.parse(serviceData.faqs)
      } catch (e) {
        console.error('Error parsing service FAQs JSON:', e)
      }
    } else if (Array.isArray(serviceData.faqs)) {
      serviceFaqs = serviceData.faqs
    }
    
    // Vérifier que c'est un tableau non vide
    if (!Array.isArray(serviceFaqs) || serviceFaqs.length === 0) {
      serviceFaqs = null
    }
  }

  const faqsData = serviceFaqs || generalFaqsData
  
  // Debug en développement
  // eslint-disable-next-line no-undef
  if (process.env.NODE_ENV === 'development') {
    console.log('[Service FAQ Debug]', {
      serviceId,
      lang,
      hasServiceFaqs: !!serviceFaqs,
      serviceFaqsCount: serviceFaqs?.length || 0,
      hasGeneralFaqs: !!generalFaqsData,
      generalFaqsCount: generalFaqsData?.length || 0,
      finalFaqsDataCount: faqsData?.length || 0,
      serviceFaqsRaw: serviceData.faqs
    })
  }

  return (
    <ServiceDetailClient
      serviceData={serviceData}
      relatedServicesData={relatedServices}
      serviceId={serviceId}
      faqsData={faqsData}
    />
  )
}
