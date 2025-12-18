import { getServiceFromFiles, getServicesFromFiles } from '@/lib/data-loader'
import { notFound } from 'next/navigation'
import ServiceDetailClient from './ServiceDetailClient'

// Cette page est un Server Component qui récupère les données depuis les fichiers JSON pré-générés
export default async function ServiceDetail({ params }) {
  const { serviceId } = await params

  // Récupérer le service et tous les services depuis les fichiers JSON (générés par prebuild)
  const serviceData = getServiceFromFiles(serviceId)
  const allServicesData = getServicesFromFiles()

  if (!serviceData) {
    notFound()
  }

  // Filtrer les services similaires (exclure le service actuel)
  const relatedServices = allServicesData
    .filter(s => s.service_id !== serviceId && s.show_in_list === true)
    .slice(0, 3)

  return (
    <ServiceDetailClient
      serviceData={serviceData}
      relatedServicesData={relatedServices}
      serviceId={serviceId}
    />
  )
}
