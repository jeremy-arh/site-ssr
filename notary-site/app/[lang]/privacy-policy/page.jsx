'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/utils/language'
// Import du contenu de PrivacyPolicy directement
import PrivacyPolicyContent from '@/app/privacy-policy/page'

export default function LangPrivacyPolicy() {
  const params = useParams()
  const router = useRouter()
  const lang = params.lang

  useEffect(() => {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      router.replace('/privacy-policy')
      return
    }

    if (lang === DEFAULT_LANGUAGE) {
      router.replace('/privacy-policy')
      return
    }
  }, [lang, router])

  if (!SUPPORTED_LANGUAGES.includes(lang) || lang === DEFAULT_LANGUAGE) {
    return null
  }

  return <PrivacyPolicyContent />
}

