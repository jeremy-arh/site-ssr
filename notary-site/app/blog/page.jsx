import { getBlogPosts, getBlogCategories } from '@/lib/supabase-server'
import { formatBlogPostsForLanguage } from '@/utils/blog'
import BlogClient from './BlogClient'
import { DEFAULT_LANGUAGE } from '@/utils/language'

// Forcer le rendu dynamique (SSR) - pas de prerendering statique
export const dynamic = 'force-dynamic'

// Métadonnées avec canonical et hreflang
// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  alternates: {
    canonical: 'https://www.mynotary.io/blog',
    languages: {
      'x-default': 'https://www.mynotary.io/blog',
      'en': 'https://www.mynotary.io/blog',
      'fr': 'https://www.mynotary.io/fr/blog',
      'es': 'https://www.mynotary.io/es/blog',
      'de': 'https://www.mynotary.io/de/blog',
      'it': 'https://www.mynotary.io/it/blog',
      'pt': 'https://www.mynotary.io/pt/blog',
    },
  },
}

export default async function Blog() {
  const [blogPostsData, categoriesData] = await Promise.all([
    getBlogPosts(),
    getBlogCategories(),
  ])

  // Pré-formater pour la langue par défaut côté serveur
  const formattedPosts = formatBlogPostsForLanguage(blogPostsData, DEFAULT_LANGUAGE)

  return (
    <BlogClient 
      initialPosts={formattedPosts} 
      initialCategories={categoriesData} 
      serverLanguage={DEFAULT_LANGUAGE}
    />
  )
}
