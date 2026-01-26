import { getBlogPost, getRelatedBlogPosts } from '@/lib/supabase-server'
import { formatBlogPostForLanguage, formatBlogPostsForLanguage } from '@/utils/blog'
import BlogPostClient from './BlogPostClient'
import { notFound } from 'next/navigation'
import { DEFAULT_LANGUAGE } from '@/utils/language'

// Forcer le rendu dynamique (SSR) - pas de prerendering statique
export const dynamic = 'force-dynamic'

// Générer les métadonnées avec canonical et hreflang pour chaque article
// eslint-disable-next-line react-refresh/only-export-components
export async function generateMetadata({ params }) {
  const { slug } = await params
  return {
    alternates: {
      canonical: `https://www.mynotary.io/blog/${slug}`,
      languages: {
        'x-default': `https://www.mynotary.io/blog/${slug}`,
        'en': `https://www.mynotary.io/blog/${slug}`,
        'fr': `https://www.mynotary.io/fr/blog/${slug}`,
        'es': `https://www.mynotary.io/es/blog/${slug}`,
        'de': `https://www.mynotary.io/de/blog/${slug}`,
        'it': `https://www.mynotary.io/it/blog/${slug}`,
        'pt': `https://www.mynotary.io/pt/blog/${slug}`,
      },
    },
  }
}

export default async function BlogPost({ params }) {
  const { slug } = await params

  const postData = await getBlogPost(slug)

  if (!postData) {
    notFound()
  }

  const relatedPostsData = await getRelatedBlogPosts(slug, 3)

  // Pré-formater côté serveur
  const formattedPost = formatBlogPostForLanguage(postData, DEFAULT_LANGUAGE)
  const formattedRelatedPosts = formatBlogPostsForLanguage(relatedPostsData, DEFAULT_LANGUAGE)

  return (
    <BlogPostClient
      initialPost={formattedPost}
      initialRelatedPosts={formattedRelatedPosts}
      slug={slug}
      serverLanguage={DEFAULT_LANGUAGE}
    />
  )
}
