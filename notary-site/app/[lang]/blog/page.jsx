import { getBlogPostsFromFiles } from '@/lib/data-loader'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/utils/language'
import { redirect } from 'next/navigation'
import BlogClient from '../../blog/BlogClient'

export default async function LangBlog({ params }) {
  const { lang } = await params

  if (!SUPPORTED_LANGUAGES.includes(lang) || lang === DEFAULT_LANGUAGE) {
    redirect('/blog')
  }

  const blogPostsData = getBlogPostsFromFiles()
  
  // Extraire les catégories uniques
  const categoriesData = [...new Set(blogPostsData.map(post => post.category).filter(Boolean))]

  return (
    <BlogClient initialPosts={blogPostsData} initialCategories={categoriesData} postsData={blogPostsData} />
  )
}
