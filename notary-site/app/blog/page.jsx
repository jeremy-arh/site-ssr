import { getBlogPosts, getBlogCategories } from '@/lib/supabase-server'
import { formatBlogPostsForLanguage } from '@/utils/blog'
import BlogClient from './BlogClient'

// Forcer le rendu dynamique (SSR) - pas de prerendering statique
export const dynamic = 'force-dynamic'

// Métadonnées avec canonical
export const metadata = {
  alternates: {
    canonical: 'https://www.mynotary.io/blog',
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
