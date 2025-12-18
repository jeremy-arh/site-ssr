'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import MobileCTA from '@/components/MobileCTA'
import { useTranslation } from '@/hooks/useTranslation'
import { useLanguage } from '@/contexts/LanguageContext'

// NOTE: dynamic et revalidate ne peuvent pas être utilisés avec 'use client'

export default function NotFound() {
  // Hooks doivent être appelés en premier, toujours dans le même ordre
  const [mounted, setMounted] = useState(false)
  const { t } = useTranslation()
  const { getLocalizedPath } = useLanguage()
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Fallback simple pendant le SSR pour éviter l'erreur Supabase auth
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">404</h1>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-[600px] mx-auto px-[30px] text-center py-20">
        <div className="mb-8">
          <h1 className="text-[120px] sm:text-[160px] lg:text-[200px] font-bold text-gray-900 leading-none animate-fade-in">
            404
          </h1>
        </div>

        <div className="mb-8 animate-fade-in animation-delay-200">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t('notFound.title')}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {t('notFound.description')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in animation-delay-400">
          <Link
            href={getLocalizedPath('/')}
            className="primary-cta text-lg px-8 py-4 inline-flex items-center gap-3"
          >
            <Icon icon="lsicon:open-new-filled" className="w-5 h-5 text-white" />
            <span className="btn-text inline-block">{t('nav.notarizeNow')}</span>
          </Link>

          <Link
            href={getLocalizedPath('/#services')}
            className="inline-flex items-center gap-2 text-gray-900 font-semibold hover:underline text-lg"
          >
            <span>{t('notFound.viewServices')}</span>
            <Icon icon="stash:check-solid" className="w-5 h-5" />
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 animate-fade-in animation-delay-600">
          <p className="text-sm text-gray-500 mb-4">{t('notFound.lookingFor')}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href={getLocalizedPath('/#services')} className="text-sm text-gray-600 hover:text-black transition-colors">
              {t('notFound.ourServices')}
            </Link>
            <Link href={getLocalizedPath('/#how-it-works')} className="text-sm text-gray-600 hover:text-black transition-colors">
              {t('notFound.howItWorks')}
            </Link>
            <Link href={getLocalizedPath('/#faq')} className="text-sm text-gray-600 hover:text-black transition-colors">
              {t('notFound.faq')}
            </Link>
            <Link href={getLocalizedPath('/blog')} className="text-sm text-gray-600 hover:text-black transition-colors">
              {t('notFound.blog')}
            </Link>
          </div>
        </div>
      </div>

      <MobileCTA />
    </div>
  )
}

