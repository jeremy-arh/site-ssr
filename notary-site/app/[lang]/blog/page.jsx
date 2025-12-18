import { getBlogPosts } from '@/lib/supabase-server'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/utils/language'
import { createTranslator } from '@/lib/translations-server'
import { formatBlogPostsForLanguage } from '@/utils/blog'
import { redirect } from 'next/navigation'
import BlogContent from '../../blog/BlogContent'

// Forcer le rendu dynamique (SSR)
export const dynamic = 'force-dynamic'

// Générer les métadonnées côté serveur
export async function generateMetadata({ params }) {
  const { lang } = await params
  const language = SUPPORTED_LANGUAGES.includes(lang) ? lang : DEFAULT_LANGUAGE
  const t = createTranslator(language)
  return {
    title: t('seo.blogTitle'),
    description: t('seo.blogDescription'),
    openGraph: {
      title: t('seo.blogTitle'),
      description: t('seo.blogDescription'),
    },
  }
}

export default async function LangBlog({ params }) {
  const { lang } = await params

  if (!SUPPORTED_LANGUAGES.includes(lang) || lang === DEFAULT_LANGUAGE) {
    redirect('/blog')
  }

  const language = lang
  const t = createTranslator(language)

  // Récupérer et formater les données côté serveur
  const postsData = await getBlogPosts()
  const posts = formatBlogPostsForLanguage(postsData, language)
  
  // Extraire les catégories uniques côté serveur
  const categories = [...new Set(posts.map(post => post.category).filter(Boolean))]

  // Pré-calculer les traductions côté serveur
  const translations = {
    badge: t('blog.badge'),
    title: t('blog.title'),
    description: t('blog.description'),
    allArticles: t('blog.allArticles'),
    noArticlesCategory: t('blog.noArticlesCategory'),
    readMore: t('blog.readMore'),
    minRead: t('blog.minRead'),
    notarizeNow: t('nav.notarizeNow'),
  }

  return (
    <BlogContent
      language={language}
      translations={translations}
      initialPosts={posts}
      categories={categories}
    />
  )
}
