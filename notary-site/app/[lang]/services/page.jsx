import { getServices } from '@/lib/supabase-server'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/utils/language'
import { permanentRedirect } from 'next/navigation'
import ServicesClient from '../../services/ServicesClient'
import { formatServicesForLanguage } from '@/utils/services'

// Forcer le rendu dynamique (SSR) - pas de prerendering statique
export const dynamic = 'force-dynamic'

// Générer les métadonnées avec canonical et hreflang pour chaque langue
// eslint-disable-next-line react-refresh/only-export-components
export async function generateMetadata({ params }) {
  const { lang } = await params
  return {
    alternates: {
      canonical: `https://www.mynotary.io/${lang}/services`,
      languages: {
        'x-default': 'https://www.mynotary.io/services',
        'en': 'https://www.mynotary.io/services',
        'fr': 'https://www.mynotary.io/fr/services',
        'es': 'https://www.mynotary.io/es/services',
        'de': 'https://www.mynotary.io/de/services',
        'it': 'https://www.mynotary.io/it/services',
        'pt': 'https://www.mynotary.io/pt/services',
      },
    },
  }
}

export default async function LangServices({ params }) {
  const { lang } = await params

  if (!SUPPORTED_LANGUAGES.includes(lang) || lang === DEFAULT_LANGUAGE) {
    permanentRedirect('/services')
  }

  const servicesData = await getServices()
  const formattedServices = formatServicesForLanguage(servicesData, lang)

  return (
    <ServicesClient servicesData={formattedServices} serverLanguage={lang} />
  )
}
