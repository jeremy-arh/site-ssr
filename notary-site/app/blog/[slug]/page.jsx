import { getBlogPost, getRelatedBlogPosts } from '@/lib/supabase-server'
import { formatBlogPostForLanguage, formatBlogPostsForLanguage } from '@/utils/blog'
import BlogPostClient from './BlogPostClient'
import { notFound } from 'next/navigation'

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

// Cette page est un Server Component qui récupère les données côté serveur
export default async function BlogPost({ params }) {
  const { slug } = await params

  // Récupérer l'article côté serveur (SSR)
  const postData = await getBlogPost(slug)

  if (!postData) {
    notFound()
  }

  // Récupérer les articles liés côté serveur
  const relatedPostsData = await getRelatedBlogPosts(slug, 3)

  // Formater pour la langue par défaut (sera ajusté côté client)
  const formattedPost = formatBlogPostForLanguage(postData, 'en')
  const formattedRelatedPosts = formatBlogPostsForLanguage(relatedPostsData, 'en')

  return (
    <BlogPostClient
      initialPost={formattedPost}
      initialRelatedPosts={formattedRelatedPosts}
      postData={postData}
      relatedPostsData={relatedPostsData}
      slug={slug}
    />
  )
}
