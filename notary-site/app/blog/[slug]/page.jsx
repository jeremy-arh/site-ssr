import { getBlogPostFromFiles, getRelatedBlogPostsFromFiles } from '@/lib/data-loader'
import { formatBlogPostForLanguage, formatBlogPostsForLanguage } from '@/utils/blog'
import BlogPostClient from './BlogPostClient'
import { notFound } from 'next/navigation'

// Cette page est un Server Component qui récupère les données depuis les fichiers JSON pré-générés
export default async function BlogPost({ params }) {
  const { slug } = await params

  // Récupérer l'article depuis les fichiers JSON (générés par prebuild)
  const postData = getBlogPostFromFiles(slug)

  if (!postData) {
    notFound()
  }

  // Récupérer les articles liés depuis les fichiers JSON
  const relatedPostsData = getRelatedBlogPostsFromFiles(slug, 3)

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
