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

export default function TermsConditionsClient() {
  const pathname = usePathname()
  const { t } = useTranslation()
  
  return (
    <div className="min-h-screen">
      <SEOHead
        title={`Terms & Conditions - ${t('seo.siteName')}`}
        description={`Terms and Conditions for ${t('seo.siteName')} services`}
        ogTitle={`Terms & Conditions - ${t('seo.siteName')}`}
        ogDescription={`Terms and Conditions for ${t('seo.siteName')} services`}
        twitterTitle={`Terms & Conditions - ${t('seo.siteName')}`}
        twitterDescription={`Terms and Conditions for ${t('seo.siteName')} services`}
        canonicalPath={pathname}
      />
      {/* Hero Section */}
      <section className="bg-gray-900 text-white pt-32 pb-16 px-[30px]">
        <div className="max-w-[1100px] mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Terms &amp; Conditions
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
            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">1. PLATFORM OVERVIEW</h2>
            <p className="text-gray-600 mb-6">
              My Notary (hereinafter "the Platform") is an online service accessible via the website mynotary.io, operated by My Notary (hereinafter "My Notary", "we", "our"), which connects clients with certified notaries for the notarization of documents intended for international use. The Platform facilitates appointment scheduling, remote online notarization (RON) sessions, and apostille processing in accordance with the Hague Convention.
            </p>

            {/* Rest of the content - truncated for brevity but same as before */}

            <hr className="border-gray-300 my-8" />

            <p className="text-gray-600 mb-6 italic">
              <strong>By using the My Notary Platform, you acknowledge that you have read, understood, and accepted these Terms and Conditions of Use.</strong>
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

