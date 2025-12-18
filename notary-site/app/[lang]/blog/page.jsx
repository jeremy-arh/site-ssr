import { getBlogPosts, getBlogCategories } from '@/lib/supabase-server'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/utils/language'
import { redirect } from 'next/navigation'
import BlogClient from '../../blog/BlogClient'

// Forcer le rendu dynamique (SSR) - pas de prerendering statique
export const dynamic = 'force-dynamic'

export default async function LangBlog({ params }) {
  const { lang } = await params

  if (!SUPPORTED_LANGUAGES.includes(lang) || lang === DEFAULT_LANGUAGE) {
    redirect('/blog')
  }

  const [blogPostsData, categoriesData] = await Promise.all([
    getBlogPosts(),
    getBlogCategories(),
  ])

  return (
    <BlogClient initialPosts={blogPostsData} initialCategories={categoriesData} postsData={blogPostsData} />
  )
}
