import { getServiceFromFiles, getServicesFromFiles } from '@/lib/data-loader'
import { notFound, redirect } from 'next/navigation'
import ServiceDetailClient from '../../../services/[serviceId]/ServiceDetailClient'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/utils/language'

export default async function LangServiceDetail({ params }) {
  const { lang, serviceId } = await params

  if (!SUPPORTED_LANGUAGES.includes(lang) || lang === DEFAULT_LANGUAGE) {
    redirect(`/services/${serviceId}`)
  }

  const serviceData = getServiceFromFiles(serviceId)
  const allServicesData = getServicesFromFiles()

  if (!serviceData) {
    notFound()
  }

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
