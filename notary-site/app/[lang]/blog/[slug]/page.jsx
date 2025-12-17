'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/utils/language'
// Import du contenu de BlogPost directement
import BlogPostContent from '@/app/blog/[slug]/page'

export default function LangBlogPost() {
  const params = useParams()
  const router = useRouter()
  const lang = params.lang
  const slug = params.slug

  useEffect(() => {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      router.replace(`/blog/${slug}`)
      return
    }

    if (lang === DEFAULT_LANGUAGE) {
      router.replace(`/blog/${slug}`)
      return
    }
  }, [lang, slug, router])

  if (!SUPPORTED_LANGUAGES.includes(lang) || lang === DEFAULT_LANGUAGE) {
    return null
  }

  // Utiliser le composant BlogPost directement
  return <BlogPostContent />
}

