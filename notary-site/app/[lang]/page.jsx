import { getBlogPostsFromFiles, getServicesFromFiles, getFAQsFromFiles, getTestimonialsFromFiles } from '@/lib/data-loader'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/utils/language'
import { redirect } from 'next/navigation'
import HomeClient from '../HomeClient'

export default async function LangHome({ params }) {
  const { lang } = await params

  if (!SUPPORTED_LANGUAGES.includes(lang) || lang === DEFAULT_LANGUAGE) {
    redirect('/')
  }

  const blogPostsData = getBlogPostsFromFiles()
  const servicesData = getServicesFromFiles()
  const faqsData = getFAQsFromFiles()
  const testimonialsData = getTestimonialsFromFiles()

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
