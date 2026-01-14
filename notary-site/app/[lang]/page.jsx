import { getBlogPosts, getServices, getFAQs, getTestimonials } from '@/lib/supabase-server'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/utils/language'
import { redirect } from 'next/navigation'
import HomeClient from '../HomeClient'

// Forcer le rendu dynamique (SSR) - pas de prerendering statique
export const dynamic = 'force-dynamic'

// Générer les métadonnées avec canonical pour chaque langue
// eslint-disable-next-line react-refresh/only-export-components
export async function generateMetadata({ params }) {
  const { lang } = await params
  return {
    alternates: {
      canonical: `https://www.mynotary.io/${lang}`,
    },
  }
}

export default async function LangHome({ params }) {
  const { lang } = await params

  if (!SUPPORTED_LANGUAGES.includes(lang) || lang === DEFAULT_LANGUAGE) {
    redirect('/')
  }

  const [blogPostsData, servicesData, faqsData, testimonialsData] = await Promise.all([
    getBlogPosts(),
    getServices(),
    getFAQs(),
    getTestimonials(),
  ])

  const recentPosts = blogPostsData.slice(0, 3) // Prendre les 3 plus récents

  return (
    <HomeClient
      blogPostsData={recentPosts}
      servicesData={servicesData}
      faqsData={faqsData}
      testimonialsData={testimonialsData}
    />
  )
}
