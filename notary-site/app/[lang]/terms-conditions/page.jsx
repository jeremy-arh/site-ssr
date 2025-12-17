'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/utils/language'
// Import du contenu de TermsConditions directement
import TermsConditionsContent from '@/app/terms-conditions/page'

export default function LangTermsConditions() {
  const params = useParams()
  const router = useRouter()
  const lang = params.lang

  useEffect(() => {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      router.replace('/terms-conditions')
      return
    }

    if (lang === DEFAULT_LANGUAGE) {
      router.replace('/terms-conditions')
      return
    }
  }, [lang, router])

  if (!SUPPORTED_LANGUAGES.includes(lang) || lang === DEFAULT_LANGUAGE) {
    return null
  }

  return <TermsConditionsContent />
}

