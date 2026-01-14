import { getServices } from '@/lib/supabase-server'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/utils/language'
import { redirect } from 'next/navigation'
import ServicesClient from '../../services/ServicesClient'

// Forcer le rendu dynamique (SSR) - pas de prerendering statique
export const dynamic = 'force-dynamic'

// Générer les métadonnées avec canonical pour chaque langue
// eslint-disable-next-line react-refresh/only-export-components
export async function generateMetadata({ params }) {
  const { lang } = await params
  return {
    alternates: {
      canonical: `https://www.mynotary.io/${lang}/services`,
    },
  }
}

export default async function LangServices({ params }) {
  const { lang } = await params

  if (!SUPPORTED_LANGUAGES.includes(lang) || lang === DEFAULT_LANGUAGE) {
    redirect('/services')
  }

  const servicesData = await getServices()

  return (
    <ServicesClient servicesData={servicesData} />
  )
}
