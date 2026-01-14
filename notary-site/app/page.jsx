import { getBlogPosts, getServices, getFAQs, getTestimonials } from '@/lib/supabase-server'
import HomeClient from './HomeClient'

// Forcer le rendu dynamique (SSR) - pas de prerendering statique
export const dynamic = 'force-dynamic'

// Métadonnées avec canonical pour éviter les problèmes de duplicate content
export const metadata = {
  alternates: {
    canonical: 'https://www.mynotary.io',
  },
}

export default async function Home() {
  // Récupérer toutes les données côté serveur (SSR)
  const [blogPostsData, servicesData, faqsData, testimonialsData] = await Promise.all([
    getBlogPosts(),
    getServices(),
    getFAQs(),
    getTestimonials(),
  ])

  const recentPosts = blogPostsData.slice(0, 3)

  return (
    <HomeClient
      blogPostsData={recentPosts}
      servicesData={servicesData}
      faqsData={faqsData}
      testimonialsData={testimonialsData}
    />
  )
}
