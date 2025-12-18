import { getBlogPosts, getServices, getFAQs, getTestimonials } from '@/lib/supabase-server'
import HomeClient from './HomeClient'

// Forcer le rendu dynamique (SSR) - pas de prerendering statique
export const dynamic = 'force-dynamic'

// Cette page est un Server Component qui récupère TOUTES les données côté serveur (SSR)
export default async function Home() {
  // Récupérer TOUTES les données en parallèle côté serveur
  const [blogPostsData, servicesData, faqsData, testimonialsData] = await Promise.all([
    getBlogPosts(),
    getServices(),
    getFAQs(),
    getTestimonials(),
  ])

  // Prendre les 3 articles les plus récents
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
