import { getBlogPosts, getBlogCategories } from '@/lib/supabase-server'
import { formatBlogPostsForLanguage } from '@/utils/blog'
import BlogClient from './BlogClient'

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

  // Formater pour la langue par défaut (sera ajusté côté client)
  const formattedPosts = formatBlogPostsForLanguage(blogPostsData, 'en')

  return (
    <BlogClient 
      initialPosts={formattedPosts} 
      initialCategories={categoriesData} 
      postsData={blogPostsData} 
    />
  )
}
