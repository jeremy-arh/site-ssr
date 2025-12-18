import { getBlogPostsFromFiles } from '@/lib/data-loader'
import { formatBlogPostsForLanguage } from '@/utils/blog'
import BlogClient from './BlogClient'

// Cette page est un Server Component qui récupère les données depuis les fichiers JSON pré-générés
export default async function Blog() {
  // Récupérer les données depuis les fichiers JSON (générés par prebuild)
  const postsData = getBlogPostsFromFiles()

  // Formater les posts pour la langue par défaut (sera ajusté côté client selon la langue sélectionnée)
  const formattedPosts = formatBlogPostsForLanguage(postsData, 'en')

  // Extraire les catégories uniques
  const categories = [...new Set(formattedPosts.map(post => post.category).filter(Boolean))]

  return <BlogClient initialPosts={formattedPosts} initialCategories={categories} postsData={postsData} />
}
