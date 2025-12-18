import { getBlogPosts } from '@/lib/supabase-server'
import { formatBlogPostsForLanguage } from '@/utils/blog'
import BlogClient from './BlogClient'

// Forcer le rendu dynamique (SSR) - pas de prerendering statique
export const dynamic = 'force-dynamic'

// Cette page est un Server Component qui récupère les données côté serveur
export default async function Blog() {
  // Récupérer les données côté serveur (SSR)
  const postsData = await getBlogPosts()

  // Formater les posts pour la langue par défaut (sera ajusté côté client selon la langue sélectionnée)
  const formattedPosts = formatBlogPostsForLanguage(postsData, 'en')

  // Extraire les catégories uniques
  const categories = [...new Set(formattedPosts.map(post => post.category).filter(Boolean))]

  return <BlogClient initialPosts={formattedPosts} initialCategories={categories} postsData={postsData} />
}
