import SEOHead from '../components/SEOHead';
import StructuredData from '../components/StructuredData';
import { useTranslation } from '../hooks/useTranslation';
import Hero from '../components/Hero'
import Services from '../components/Services'
import HowItWorks from '../components/HowItWorks'
import Testimonial from '../components/Testimonial'
import FAQ from '../components/FAQ'
import BlogSection from '../components/BlogSection'
import MobileCTA from '../components/MobileCTA'
import ChatCTA from '../components/ChatCTA'

function Home() {
  const { t, language } = useTranslation();
  
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
  ];
  
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
              faqItems: faqItems.slice(0, 5), // Limiter à 5 pour éviter les erreurs
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

export default Home
