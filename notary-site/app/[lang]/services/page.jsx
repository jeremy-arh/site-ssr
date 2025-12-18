import { getServicesFromFiles } from '@/lib/data-loader'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/utils/language'
import { redirect } from 'next/navigation'
import ServicesClient from '../../services/ServicesClient'

export default async function LangServices({ params }) {
  const { lang } = await params

  if (!SUPPORTED_LANGUAGES.includes(lang) || lang === DEFAULT_LANGUAGE) {
    redirect('/services')
  }

  const servicesData = getServicesFromFiles()

  return (
    <ServicesClient servicesData={servicesData} />
  )
}
