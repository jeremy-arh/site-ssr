'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/utils/language'
// Import du contenu de ServiceDetail directement
import ServiceDetailContent from '@/app/services/[serviceId]/page'

export default function LangServiceDetail() {
  const params = useParams()
  const router = useRouter()
  const lang = params.lang
  const serviceId = params.serviceId

  useEffect(() => {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      router.replace(`/services/${serviceId}`)
      return
    }

    if (lang === DEFAULT_LANGUAGE) {
      router.replace(`/services/${serviceId}`)
      return
    }
  }, [lang, serviceId, router])

  if (!SUPPORTED_LANGUAGES.includes(lang) || lang === DEFAULT_LANGUAGE) {
    return null
  }

  return <ServiceDetailContent />
}

