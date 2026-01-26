import { getServices } from '@/lib/supabase-server'
import ServicesClient from './ServicesClient'
import { DEFAULT_LANGUAGE } from '@/utils/language'
import { formatServicesForLanguage } from '@/utils/services'

// Forcer le rendu dynamique (SSR) - pas de prerendering statique
export const dynamic = 'force-dynamic'

// Métadonnées avec canonical et hreflang
// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  alternates: {
    canonical: 'https://www.mynotary.io/services',
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

export default async function Services() {
  const servicesData = await getServices()
  const formattedServices = formatServicesForLanguage(servicesData, DEFAULT_LANGUAGE)
  return <ServicesClient servicesData={formattedServices} serverLanguage={DEFAULT_LANGUAGE} />
}
