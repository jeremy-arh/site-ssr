'use client'

import dynamic from 'next/dynamic'
import SEOHead from '@/components/SEOHead'
import StructuredData from '@/components/StructuredData'
import { useTranslation } from '@/hooks/useTranslation'
import Hero from '@/components/Hero'
import LazyLoad from '@/components/LazyLoad'

// Services est below-the-fold sur mobile - lazy load pour améliorer LCP
const Services = dynamic(() => import('@/components/Services'), { 
  ssr: true, // Garder SSR pour SEO
  loading: () => (
    <section className="py-20 px-4 sm:px-[30px] bg-white">
      <div className="max-w-[1300px] mx-auto">
        <div className="h-[400px] animate-pulse bg-gray-100 rounded-2xl" />
      </div>
    </section>
  )
})

// Importer HowItWorks et FAQ normalement pour qu'ils soient toujours dans le DOM (nécessaire pour la navigation)
import HowItWorks from '@/components/HowItWorks'
import FAQ from '@/components/FAQ'

// Lazy load composants below-the-fold avec chargement différé
// ssr: false pour éviter le chargement côté serveur des chunks non critiques
// loading: composant de fallback minimal
const ChatCTA = dynamic(() => import('@/components/ChatCTA'), { 
  ssr: false,
  loading: () => null 
})
const Testimonial = dynamic(() => import('@/components/Testimonial'), { 
  ssr: false,
  loading: () => null 
})
const BlogSection = dynamic(() => import('@/components/BlogSection'), { 
  ssr: false,
  loading: () => null 
})
const MobileCTA = dynamic(() => import('@/components/MobileCTA'), { 
  ssr: false,
  loading: () => null 
})

export default function HomeClient({ blogPostsData, servicesData, faqsData, testimonialsData }) {
  const { t } = useTranslation()
  
  // Données structurées pour la FAQ
  const faqItems = [
    {
      question: t('faq.items.0.question'),
      answer: t('faq.items.0.answer'),
    },
    {
      question: t('faq.items.1.question'),
      answer: t('faq.items.1.answer'),
    },
    {
      question: t('faq.items.2.question'),
      answer: t('faq.items.2.answer'),
    },
    {
      question: t('faq.items.3.question'),
      answer: t('faq.items.3.answer'),
    },
    {
      question: t('faq.items.4.question'),
      answer: t('faq.items.4.answer'),
    },
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
        canonicalPath="/"
      />
      <StructuredData 
        type="Organization"
        additionalData={[
          {
            type: 'FAQPage',
            data: {
              faqItems: faqItems.slice(0, 5),
            },
          },
        ]}
      />
      <Hero />
      <Services servicesData={servicesData} />
      
      {/* Composants chargés uniquement quand ils deviennent visibles */}
      <LazyLoad rootMargin="300px">
        <ChatCTA />
      </LazyLoad>
      
      <LazyLoad rootMargin="300px">
        <Testimonial testimonialsData={testimonialsData} />
      </LazyLoad>
      
      <LazyLoad rootMargin="300px">
        <HowItWorks />
      </LazyLoad>
      
      <LazyLoad rootMargin="300px">
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

