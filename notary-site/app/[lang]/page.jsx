import { getBlogPosts, getServices, getFAQs } from '@/lib/supabase-server'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/utils/language'
import { redirect } from 'next/navigation'
import HomeClient from '../HomeClient'

// Forcer le rendu dynamique (SSR) - pas de prerendering statique
export const dynamic = 'force-dynamic'

// Générer les métadonnées avec canonical et hreflang pour chaque langue
// eslint-disable-next-line react-refresh/only-export-components
export async function generateMetadata({ params }) {
  const { lang } = await params
  return {
    alternates: {
      canonical: `https://www.mynotary.io/${lang}`,
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
}

export default async function LangHome({ params }) {
  const { lang } = await params

  if (!SUPPORTED_LANGUAGES.includes(lang) || lang === DEFAULT_LANGUAGE) {
    redirect('/')
  }

  const [blogPostsData, servicesData, faqsData] = await Promise.all([
    getBlogPosts(),
    getServices(),
    getFAQs(),
  ])

  const recentPosts = blogPostsData.slice(0, 3) // Prendre les 3 plus récents

  return (
    <HomeClient
      blogPostsData={recentPosts}
      servicesData={servicesData}
      faqsData={faqsData}
    />
  )
}
