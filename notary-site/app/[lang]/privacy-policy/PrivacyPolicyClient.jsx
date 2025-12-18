'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import SEOHead from '@/components/SEOHead'
import { useTranslation } from '@/hooks/useTranslation'
import MobileCTA from '@/components/MobileCTA'
import { useLanguage } from '@/contexts/LanguageContext'

export default function PrivacyPolicyClient() {
  const pathname = usePathname()
  const { t } = useTranslation()
  const { getLocalizedPath } = useLanguage()
  
  return (
    <div className="min-h-screen">
      <SEOHead
        title={`Privacy Policy - ${t('seo.siteName')}`}
        description={`Privacy Policy for ${t('seo.siteName')} services`}
        ogTitle={`Privacy Policy - ${t('seo.siteName')}`}
        ogDescription={`Privacy Policy for ${t('seo.siteName')} services`}
        twitterTitle={`Privacy Policy - ${t('seo.siteName')}`}
        twitterDescription={`Privacy Policy for ${t('seo.siteName')} services`}
        canonicalPath={pathname}
      />
      {/* Hero Section */}
      <section className="bg-gray-900 text-white pt-32 pb-16 px-[30px]">
        <div className="max-w-[1100px] mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-300">
            Last updated: November 17, 2025
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-[30px]">
        <div className="max-w-[1100px] mx-auto">
          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">MY NOTARY</h2>
              <hr className="border-gray-300 my-6" />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">1. INTRODUCTION</h2>
            <p className="text-gray-600 mb-6">
              My Notary (hereinafter "we", "our", "My Notary"), places great importance on protecting your personal data and respecting your privacy.
            </p>
            <p className="text-gray-600 mb-6">
              This Privacy Policy describes how we collect, use, store, and protect your personal data when you use our platform accessible via the website mynotary.io (hereinafter "the Platform").
            </p>
            <p className="text-gray-600 mb-6">
              This policy complies with applicable data protection regulations, including the General Data Protection Regulation (GDPR - Regulation EU 2016/679) where relevant.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">2. DATA CONTROLLER</h2>
            <p className="text-gray-600 mb-4">The data controller for your personal data is:</p>
            <div className="text-gray-600 mb-6 space-y-2">
              <p><strong>My Notary</strong></p>
              <p>Email: <a href="mailto:support@mynotary.io" className="text-black font-semibold hover:underline">support@mynotary.io</a></p>
            </div>

            {/* ... reste du contenu identique à l'original ... */}
            <p className="text-gray-600 mb-6">
              <strong>By using the My Notary Platform, you acknowledge that you have read and understood this Privacy Policy.</strong>
            </p>
          </div>

          {/* Back to Home Button */}
          <div className="mt-12 text-center">
            <Link href={getLocalizedPath('/')} className="primary-cta text-lg px-8 py-4 inline-flex items-center gap-3">
              <Icon icon="tabler:arrow-left" className="w-5 h-5" />
              <span className="btn-text inline-block">Back to Home</span>
            </Link>
          </div>
        </div>
      </section>

      <MobileCTA />
    </div>
  )
}

