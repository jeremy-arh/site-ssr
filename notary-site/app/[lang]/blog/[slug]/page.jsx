import { getBlogPost, getRelatedBlogPosts } from '@/lib/supabase-server'
import { notFound, redirect } from 'next/navigation'
import BlogPostClient from '../../../blog/[slug]/BlogPostClient'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/utils/language'

// Forcer le rendu dynamique (SSR) - pas de prerendering statique
export const dynamic = 'force-dynamic'

// Générer les métadonnées avec canonical pour chaque langue et article
// eslint-disable-next-line react-refresh/only-export-components
export async function generateMetadata({ params }) {
  const { lang, slug } = await params
  return {
    alternates: {
      canonical: `https://www.mynotary.io/${lang}/blog/${slug}`,
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

  return (
    <BlogPostClient
      initialPost={blogPostData}
      initialRelatedPosts={relatedBlogPostsData}
      postData={blogPostData}
      relatedPostsData={relatedBlogPostsData}
      slug={slug}
    />
  )
}
