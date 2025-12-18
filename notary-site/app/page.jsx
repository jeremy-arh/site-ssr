import { getBlogPostsFromFiles, getServicesFromFiles, getFAQsFromFiles, getTestimonialsFromFiles } from '@/lib/data-loader'
import HomeClient from './HomeClient'

// Cette page est un Server Component qui récupère TOUTES les données depuis les fichiers JSON pré-générés
export default async function Home() {
  // Récupérer TOUTES les données depuis les fichiers JSON (générés par prebuild)
  const blogPostsData = getBlogPostsFromFiles()
  const servicesData = getServicesFromFiles()
  const faqsData = getFAQsFromFiles()
  const testimonialsData = getTestimonialsFromFiles()

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
