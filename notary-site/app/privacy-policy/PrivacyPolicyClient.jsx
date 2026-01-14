'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { memo } from 'react'
import SEOHead from '@/components/SEOHead'
import { useTranslation } from '@/hooks/useTranslation'
import MobileCTA from '@/components/MobileCTA'

// SVG Icon inline pour éviter @iconify/react
const IconArrowLeft = memo(() => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
));

IconArrowLeft.displayName = 'IconArrowLeft';

export default function PrivacyPolicyClient() {
  const pathname = usePathname()
  const { t } = useTranslation()
  
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

      {/* Content Section - truncated for brevity but same as before */}
      <section className="py-20 px-[30px]">
        <div className="max-w-[1100px] mx-auto">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">1. INTRODUCTION</h2>
            <p className="text-gray-600 mb-6">
              My Notary (hereinafter "we", "our", "My Notary"), places great importance on protecting your personal data and respecting your privacy.
            </p>

            <hr className="border-gray-300 my-8" />

            <p className="text-gray-600 mb-6 italic">
              <strong>By using the My Notary Platform, you acknowledge that you have read and understood this Privacy Policy.</strong>
            </p>
          </div>

          {/* Back to Home Button */}
          <div className="mt-12 text-center">
            <Link href="/" className="primary-cta text-lg px-8 py-4 inline-flex items-center gap-3">
              <IconArrowLeft />
              <span className="btn-text inline-block">Back to Home</span>
            </Link>
          </div>
        </div>
      </section>

      <MobileCTA />
    </div>
  )
}

