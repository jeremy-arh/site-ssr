import { getBlogPost, getRelatedBlogPosts } from '@/lib/supabase-server'
import { formatBlogPostForLanguage, formatBlogPostsForLanguage } from '@/utils/blog'
import BlogPostClient from './BlogPostClient'
import { notFound } from 'next/navigation'

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
