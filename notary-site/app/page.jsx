import { getBlogPosts, getServices, getFAQs, getTestimonials } from '@/lib/supabase-server'
import { createTranslator, getLocalizedPath, DEFAULT_LANGUAGE } from '@/lib/translations-server'
import { formatServicesForLanguage } from '@/utils/services'
import { formatBlogPostsForLanguage } from '@/utils/blog'
import HomeContent from './HomeContent'

// Forcer le rendu dynamique (SSR)
export const dynamic = 'force-dynamic'

// Générer les métadonnées côté serveur
export async function generateMetadata() {
  const t = createTranslator(DEFAULT_LANGUAGE)
  return {
    title: t('seo.defaultTitle'),
    description: t('seo.defaultDescription'),
    openGraph: {
      title: t('seo.defaultOgTitle'),
      description: t('seo.defaultOgDescription'),
    },
  }
}

export default async function Home() {
  const language = DEFAULT_LANGUAGE
  const t = createTranslator(language)
  
  // Récupérer les données côté serveur
  const [blogPostsData, servicesData, faqsData, testimonialsData] = await Promise.all([
    getBlogPosts(),
    getServices(),
    getFAQs(),
    getTestimonials(),
  ])

  // Formater les données côté serveur
  const formattedServices = formatServicesForLanguage(
    servicesData.filter(s => s.show_in_list === true),
    language
  )
  const formattedBlogPosts = formatBlogPostsForLanguage(blogPostsData.slice(0, 3), language)

  // Pré-calculer les traductions côté serveur
  const translations = {
    nav: { notarizeNow: t('nav.notarizeNow') },
    hero: {
      title: t('hero.title'),
      subtitle: t('hero.subtitle'),
      cta: t('hero.cta'),
      feature1: t('hero.feature1'),
      feature2: t('hero.feature2'),
      feature3: t('hero.feature3'),
    },
    services: {
      title: t('services.title'),
      subtitle: t('services.subtitle'),
      heading: t('services.heading'),
      headingHighlight: t('services.headingHighlight'),
      learnMore: t('services.learnMore'),
      perDocument: t('services.perDocument'),
    },
    howItWorks: {
      badge: t('howItWorks.badge'),
      heading: t('howItWorks.heading'),
      step1: { title: t('howItWorks.step1.title'), description: t('howItWorks.step1.description') },
      step2: { title: t('howItWorks.step2.title'), description: t('howItWorks.step2.description') },
      step3: { title: t('howItWorks.step3.title'), description: t('howItWorks.step3.description') },
      step4: { title: t('howItWorks.step4.title'), description: t('howItWorks.step4.description') },
      step5: { title: t('howItWorks.step5.title'), description: t('howItWorks.step5.description') },
      stepLabel: t('howItWorks.stepLabel'),
    },
    faq: {
      badge: t('faq.badge'),
      title: t('faq.title'),
      items: [
        { question: t('faq.items.0.question'), answer: t('faq.items.0.answer') },
        { question: t('faq.items.1.question'), answer: t('faq.items.1.answer') },
        { question: t('faq.items.2.question'), answer: t('faq.items.2.answer') },
        { question: t('faq.items.3.question'), answer: t('faq.items.3.answer') },
        { question: t('faq.items.4.question'), answer: t('faq.items.4.answer') },
      ],
    },
    testimonial: {
      badge: t('testimonial.badge'),
      title: t('testimonial.title'),
    },
    blog: {
      badge: t('blog.badge'),
      title: t('blog.sectionTitle'),
      readMore: t('blog.readMore'),
      viewAll: t('blog.viewAll'),
      minRead: t('blog.minRead'),
    },
    chatCta: {
      title: t('chatCta.title'),
      description: t('chatCta.description'),
      cta: t('chatCta.cta'),
    },
  }

  return (
    <HomeContent
      language={language}
      translations={translations}
      services={formattedServices}
      blogPosts={formattedBlogPosts}
      faqsData={faqsData}
      testimonialsData={testimonialsData}
    />
  )
}
