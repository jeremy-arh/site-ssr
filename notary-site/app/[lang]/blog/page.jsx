import { getBlogPosts, getBlogCategories } from '@/lib/supabase-server'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/utils/language'
import { redirect } from 'next/navigation'
import BlogClient from '../../blog/BlogClient'
import { formatBlogPostsForLanguage } from '@/utils/blog'

// Forcer le rendu dynamique (SSR) - pas de prerendering statique
export const dynamic = 'force-dynamic'

// Générer les métadonnées avec canonical et hreflang pour chaque langue
// eslint-disable-next-line react-refresh/only-export-components
export async function generateMetadata({ params }) {
  const { lang } = await params
  return {
    alternates: {
      canonical: `https://www.mynotary.io/${lang}/blog`,
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
}

export default async function LangBlog({ params }) {
  const { lang } = await params

  if (!SUPPORTED_LANGUAGES.includes(lang) || lang === DEFAULT_LANGUAGE) {
    redirect('/blog')
  }

  const [blogPostsData, categoriesData] = await Promise.all([
    getBlogPosts(),
    getBlogCategories(),
  ])

  // Pré-formater pour la langue côté serveur
  const formattedPosts = formatBlogPostsForLanguage(blogPostsData, lang)

  return (
    <BlogClient 
      initialPosts={formattedPosts} 
      initialCategories={categoriesData} 
      postsData={blogPostsData}
      serverLanguage={lang}
    />
  )
}
