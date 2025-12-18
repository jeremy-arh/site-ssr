import { getBlogPost, getRelatedBlogPosts } from '@/lib/supabase-server'
import { notFound, redirect } from 'next/navigation'
import BlogPostClient from '@/app/blog/[slug]/BlogPostClient'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/utils/language'

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
