'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/utils/language'
import SEOHead from '@/components/SEOHead'
import StructuredData from '@/components/StructuredData'
import { useTranslation } from '@/hooks/useTranslation'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import HowItWorks from '@/components/HowItWorks'
import Testimonial from '@/components/Testimonial'
import FAQ from '@/components/FAQ'
import BlogSection from '@/components/BlogSection'
import MobileCTA from '@/components/MobileCTA'
import ChatCTA from '@/components/ChatCTA'

export default function LangHome() {
  const params = useParams()
  const router = useRouter()
  const lang = params.lang
  const { t, language } = useTranslation()

  useEffect(() => {
    // Si la langue n'est pas supportée, rediriger vers la page par défaut
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      router.replace('/')
      return
    }

    // Si c'est la langue par défaut, rediriger vers la page sans préfixe
    if (lang === DEFAULT_LANGUAGE) {
      router.replace('/')
      return
    }
  }, [lang, router])

  // Si la langue n'est pas valide, ne rien afficher pendant la redirection
  if (!SUPPORTED_LANGUAGES.includes(lang) || lang === DEFAULT_LANGUAGE) {
    return null
  }

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
      <Services />
      <ChatCTA />
      <Testimonial />
      <HowItWorks />
      <FAQ />
      <BlogSection />
      <MobileCTA />
    </>
  )
}

