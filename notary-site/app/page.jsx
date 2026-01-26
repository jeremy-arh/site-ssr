import { getBlogPosts, getServices, getFAQs } from '@/lib/supabase-server'
import HomeClient from './HomeClient'
import { DEFAULT_LANGUAGE } from '@/utils/language'
import { formatServicesForLanguage } from '@/utils/services'

// Forcer le rendu dynamique (SSR) - pas de prerendering statique
export const dynamic = 'force-dynamic'

// Métadonnées avec canonical et hreflang
// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  alternates: {
    canonical: 'https://www.mynotary.io',
    languages: {
      'x-default': 'https://www.mynotary.io',
      'en': 'https://www.mynotary.io',
      'fr': 'https://www.mynotary.io/fr',
      'es': 'https://www.mynotary.io/es',
      'de': 'https://www.mynotary.io/de',
      'it': 'https://www.mynotary.io/it',
      'pt': 'https://www.mynotary.io/pt',
    },
  },
}

export default async function Home() {
  const [blogPostsData, servicesData, faqsData] = await Promise.all([
    getBlogPosts(),
    getServices(),
    getFAQs(),
  ])

  const recentPosts = blogPostsData.slice(0, 3)
  // Pré-formater les données côté serveur
  const formattedServices = formatServicesForLanguage(servicesData, DEFAULT_LANGUAGE)

  return (
    <HomeClient
      blogPostsData={recentPosts}
      servicesData={formattedServices}
      faqsData={faqsData}
      serverLanguage={DEFAULT_LANGUAGE}
    />
  )
}
