import { getBlogPostFromFiles, getRelatedBlogPostsFromFiles } from '@/lib/data-loader'
import { notFound, redirect } from 'next/navigation'
import BlogPostClient from '../../../blog/[slug]/BlogPostClient'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/utils/language'

export default async function LangBlogPost({ params }) {
  const { lang, slug } = await params

  if (!SUPPORTED_LANGUAGES.includes(lang) || lang === DEFAULT_LANGUAGE) {
    redirect(`/blog/${slug}`)
  }

  const blogPostData = getBlogPostFromFiles(slug)
  const relatedBlogPostsData = getRelatedBlogPostsFromFiles(slug)

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
