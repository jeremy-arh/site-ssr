import { getService, getServices, getFAQs } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import ServiceDetailClient from './ServiceDetailClient'

// Forcer le rendu dynamique (SSR) - pas de prerendering statique
export const dynamic = 'force-dynamic'

// Cette page est un Server Component qui récupère les données côté serveur (SSR)
export default async function ServiceDetail({ params }) {
  const { serviceId } = await params

  // Récupérer le service, tous les services (pour les suggestions) et les FAQs côté serveur
  const [serviceData, allServicesData, faqsData] = await Promise.all([
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

  return (
    <ServiceDetailClient
      serviceData={serviceData}
      relatedServicesData={relatedServices}
      serviceId={serviceId}
      faqsData={faqsData}
    />
  )
}
