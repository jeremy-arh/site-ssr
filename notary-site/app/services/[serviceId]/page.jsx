import { getService, getServices, getFAQs } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import ServiceDetailClient from './ServiceDetailClient'

// Forcer le rendu dynamique (SSR) - pas de prerendering statique  
// Hero: deux colonnes avec image à droite
export const dynamic = 'force-dynamic'

// Générer les métadonnées avec canonical pour chaque service
export async function generateMetadata({ params }) {
  const { serviceId } = await params
  return {
    alternates: {
      canonical: `https://www.mynotary.io/services/${serviceId}`,
    },
  }
}

// Cette page est un Server Component qui récupère les données côté serveur (SSR)
export default async function ServiceDetail({ params }) {
  const { serviceId } = await params

  // Récupérer le service, tous les services (pour les suggestions) et les FAQs générales (fallback)
  const [serviceData, allServicesData, generalFaqsData] = await Promise.all([
    getService(serviceId),
    getServices(),
    getFAQs(),
  ])

  if (!serviceData) {
    notFound()
  }

  // Filtrer les services (exclure le service actuel, garder tous les autres)
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
