import { getBlogPost, getRelatedBlogPosts } from '@/lib/supabase-server'
import { notFound, redirect } from 'next/navigation'
import BlogPostClient from '../../../blog/[slug]/BlogPostClient'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/utils/language'
import { formatBlogPostForLanguage, formatBlogPostsForLanguage } from '@/utils/blog'

// Forcer le rendu dynamique (SSR) - pas de prerendering statique
export const dynamic = 'force-dynamic'

// Générer les métadonnées avec canonical et hreflang pour chaque langue et article
// eslint-disable-next-line react-refresh/only-export-components
export async function generateMetadata({ params }) {
  const { lang, slug } = await params
  return {
    alternates: {
      canonical: `https://www.mynotary.io/${lang}/blog/${slug}`,
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

export default async function LangBlogPost({ params }) {
  const { lang, slug } = await params

  if (!SUPPORTED_LANGUAGES.includes(lang) || lang === DEFAULT_LANGUAGE) {
    redirect(`/blog/${slug}`)
  }

  const [blogPostData, relatedBlogPostsData] = await Promise.all([
    getBlogPost(slug),
    getRelatedBlogPosts(slug),
  ])

  if (!blogPostData) {
    notFound()
  }

  // Pré-formater côté serveur selon la langue
  const formattedPost = formatBlogPostForLanguage(blogPostData, lang)
  const formattedRelatedPosts = formatBlogPostsForLanguage(relatedBlogPostsData, lang)

  return (
    <BlogPostClient
      initialPost={formattedPost}
      initialRelatedPosts={formattedRelatedPosts}
      slug={slug}
      serverLanguage={lang}
    />
  )
}
