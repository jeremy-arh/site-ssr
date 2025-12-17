'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/utils/language'
// Import du contenu de Services directement
import ServicesContent from '@/app/services/page'

export default function LangServices() {
  const params = useParams()
  const router = useRouter()
  const lang = params.lang

  useEffect(() => {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      router.replace('/services')
      return
    }

    if (lang === DEFAULT_LANGUAGE) {
      router.replace('/services')
      return
    }
  }, [lang, router])

  if (!SUPPORTED_LANGUAGES.includes(lang) || lang === DEFAULT_LANGUAGE) {
    return null
  }

  return <ServicesContent />
}

