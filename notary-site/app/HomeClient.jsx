'use client'

import dynamic from 'next/dynamic'
// Imports statiques groupés en haut
import SEOHead from '@/components/SEOHead'
import StructuredData from '@/components/StructuredData'
import { useTranslation } from '@/hooks/useTranslation'
import Hero from '@/components/Hero'
import LazyLoad from '@/components/LazyLoad'
import TrustpilotSlider from '@/components/TrustpilotSlider'
// HowItWorks et FAQ importés statiquement car requis pour la navigation par ancre (#how-it-works, #faq)
import HowItWorks from '@/components/HowItWorks'
import FAQ from '@/components/FAQ'

// Services : SSR pour le SEO, skeleton pendant le chargement
const Services = dynamic(() => import('@/components/Services'), {
  ssr: true,
  loading: () => (
    <section className="py-20 px-4 sm:px-[30px] bg-white">
      <div className="max-w-[1300px] mx-auto">
        <div className="h-[400px] animate-pulse bg-gray-100 rounded-2xl" />
      </div>
    </section>
  )
})

// Composants below-the-fold : pas de SSR (réduisent le TBT)
const ChatCTA = dynamic(() => import('@/components/ChatCTA'), { ssr: false, loading: () => null })
const BlogSection = dynamic(() => import('@/components/BlogSection'), { ssr: false, loading: () => null })
const MobileCTA = dynamic(() => import('@/components/MobileCTA'), { ssr: false, loading: () => null })

export default function HomeClient({ blogPostsData, servicesData, faqsData, serverLanguage }) {
  const { t } = useTranslation(serverLanguage)

  const faqItems = [
    { question: t('faq.items.0.question'), answer: t('faq.items.0.answer') },
    { question: t('faq.items.1.question'), answer: t('faq.items.1.answer') },
    { question: t('faq.items.2.question'), answer: t('faq.items.2.answer') },
    { question: t('faq.items.3.question'), answer: t('faq.items.3.answer') },
    { question: t('faq.items.4.question'), answer: t('faq.items.4.answer') },
  ]

  return (
    <>
      <SEOHead
        title={t('seo.defaultTitle')}
        description={t('seo.defaultDescription')}
        ogTitle={t('seo.defaultOgTitle')}
        ogDescription={t('seo.defaultOgDescription')}
        twitterTitle={t('seo.defaultOgTitle')}
        twitterDescription={t('seo.defaultOgDescription')}
        serverLanguage={serverLanguage}
      />
      <StructuredData
        type="Organization"
        additionalData={[
          { type: 'FAQPage', data: { faqItems: faqItems.slice(0, 5) } },
        ]}
      />

      {/* Above-the-fold */}
      <Hero />
      <TrustpilotSlider serverLanguage={serverLanguage} />
      <Services servicesData={servicesData} />

      {/* Below-the-fold — rendu différé via IntersectionObserver */}
      <LazyLoad rootMargin="300px">
        <ChatCTA />
      </LazyLoad>

      <LazyLoad rootMargin="300px" sectionId="how-it-works">
        <HowItWorks />
      </LazyLoad>

      <LazyLoad rootMargin="300px" sectionId="faq">
        <FAQ faqsData={faqsData} />
      </LazyLoad>

      <LazyLoad rootMargin="300px">
        <BlogSection initialPosts={blogPostsData} />
      </LazyLoad>

      <LazyLoad rootMargin="200px">
        <MobileCTA />
      </LazyLoad>
    </>
  )
}
