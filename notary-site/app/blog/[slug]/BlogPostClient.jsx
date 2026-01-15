'use client'

import { useState, useEffect, useRef, useMemo, memo } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import SEOHead from '@/components/SEOHead'
import StructuredData from '@/components/StructuredData'
import { getSupabase } from '@/lib/supabase'

// SVG Icons inline pour éviter @iconify/react
const IconArrowLeft = memo(() => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
));
const IconCheck = memo(() => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
));
const IconOpenNew = memo(() => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
  </svg>
));
import { trackBlogPostView } from '@/utils/analytics'
import { useCurrency } from '@/contexts/CurrencyContext'
import { getFormUrl } from '@/utils/formUrl'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTranslation } from '@/hooks/useTranslation'
import { formatBlogPostForLanguage, formatBlogPostsForLanguage } from '@/utils/blog'
import { insertCTAsInContent } from '@/utils/insertCTAsInContent'
import TableOfContents from '@/components/TableOfContents'
import MobileCTA from '@/components/MobileCTA'

export default function BlogPostClient({ initialPost, initialRelatedPosts, postData, relatedPostsData, slug }) {
  const pathname = usePathname()
  const [post, setPost] = useState(initialPost)
  const [relatedPosts, setRelatedPosts] = useState(initialRelatedPosts)
  const [hasHeadings, setHasHeadings] = useState(false)
  const [openFAQIndex, setOpenFAQIndex] = useState(null)
  const contentRef = useRef(null)
  const { currency } = useCurrency()
  const { language, getLocalizedPath } = useLanguage()
  const { t } = useTranslation()

  // Mettre à jour le post et les articles liés quand la langue change
  useEffect(() => {
    if (postData) {
      const formattedPost = formatBlogPostForLanguage(postData, language)
      setPost(formattedPost)
    }

    if (relatedPostsData && relatedPostsData.length > 0) {
      const formattedRelatedPosts = formatBlogPostsForLanguage(relatedPostsData, language)
      setRelatedPosts(formattedRelatedPosts)
    }
  }, [language, postData, relatedPostsData])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [slug])

  useEffect(() => {
    if (post && contentRef.current) {
      const h2Elements = contentRef.current.querySelectorAll('h2')
      h2Elements.forEach((h2, index) => {
        if (!h2.id) {
          h2.id = `heading-${index}`
        }
        h2.classList.add('scroll-fade-in')
      })
    }
  }, [post])

  useEffect(() => {
    if (!post?.content || typeof DOMParser === 'undefined') {
      setHasHeadings(false)
      return
    }

    const parser = new DOMParser()
    const doc = parser.parseFromString(post.content, 'text/html')
    const h2Elements = doc.querySelectorAll('h2')

    setHasHeadings(h2Elements.length > 0)
  }, [post])

  // Incrémenter le compteur de vues (côté client uniquement)
  useEffect(() => {
    if (post && postData) {
      trackBlogPostView(slug, post.title)
      
      // Incrémenter le compteur de vues
      getSupabase().then((supabase) => {
        supabase
          .from('blog_posts')
          .update({ views_count: (postData.views_count || 0) + 1 })
          .eq('id', postData.id)
          .then(() => {})
          .catch((err) => console.error('Error updating view count:', err))
      }).catch(() => {})
    }
  }, [slug, post, postData])

  const computedReadTime = useMemo(() => {
    if (!post) return null
    if (post.read_time_minutes) return post.read_time_minutes

    if (!post.content || typeof DOMParser === 'undefined') {
      return null
    }

    const parser = new DOMParser()
    const doc = parser.parseFromString(post.content, 'text/html')
    const textContent = doc.body?.textContent || ''
    const words = textContent.trim().split(/\s+/).filter(Boolean)

    if (words.length === 0) return null

    return Math.max(1, Math.round(words.length / 200))
  }, [post])

  // Extraire les FAQs depuis les colonnes JSON selon la langue
  const extractedFAQs = useMemo(() => {
    if (!postData) return []
    
    // Mapper les langues aux colonnes FAQ
    const faqColumnMap = {
      en: 'faq',
      fr: 'faq_fr',
      es: 'faq_es',
      de: 'faq_de',
      it: 'faq_it',
      pt: 'faq_pt'
    }
    
    // Récupérer la colonne FAQ correspondant à la langue actuelle
    const faqColumn = faqColumnMap[language] || 'faq'
    const faqs = postData[faqColumn]
    
    // Si les FAQs sont disponibles dans la colonne JSON
    if (Array.isArray(faqs) && faqs.length > 0) {
      return faqs.map(faq => ({
        question: faq.question || '',
        answer: faq.answer || ''
      })).filter(faq => faq.question && faq.answer)
    }
    
    return []
  }, [postData, language])

  const formUrl = getFormUrl(currency, null)

  // Générer le HTML du bloc CTA à insérer
  const ctaTitle = t('howItWorks.ctaTitle') || 'Ready to Get Started?'
  const ctaDescription = t('howItWorks.ctaDescription') || 'Notarize your documents online in just a few minutes. Secure, legally valid, and recognized internationally.'
  const ctaButtonText = post?.cta || t('nav.notarizeNow')
  
  const ctaHTML = useMemo(() => {
    // SVG de la flèche (IconOpenNew) - couleur noire pour le bouton blanc
    const arrowIcon = '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>'
    
    return `
      <div class="blog-cta-block my-12">
        <div class="relative overflow-hidden rounded-3xl p-8 md:p-12 text-center shadow-2xl bg-blue-600">
          <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"></div>
          <div class="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-3xl"></div>
          <div class="relative z-10">
            <h3 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              ${ctaTitle}
            </h3>
            <p class="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              ${ctaDescription}
            </p>
            <a href="${formUrl}" class="primary-cta text-lg">
              ${arrowIcon}
              <span class="btn-text inline-block">${ctaButtonText}</span>
            </a>
          </div>
        </div>
      </div>
    `
  }, [formUrl, ctaTitle, ctaDescription, ctaButtonText])

  // Insérer les CTAs dans le contenu tous les 3 H2
  const contentWithCTAs = useMemo(() => {
    if (!post?.content) {
      console.warn('No post content available')
      return ''
    }
    if (!ctaHTML) {
      console.warn('No CTA HTML available')
      return post.content
    }
    
    console.log('Inserting CTAs. CTA HTML length:', ctaHTML.length)
    console.log('Post content length:', post.content.length)
    
    const result = insertCTAsInContent(post.content, ctaHTML)
    
    // Debug en développement
    const h2Count = (post.content.match(/<h2[^>]*>/gi) || []).length
    const ctaCount = (result.match(/blog-cta-block/gi) || []).length
    console.log(`Blog post "${post.title}": ${h2Count} H2 found, ${ctaCount} CTAs inserted`)
    console.log('Result length:', result.length)
    
    if (ctaCount === 0 && h2Count >= 3) {
      console.error('ERROR: No CTAs inserted but H2 count is', h2Count)
      console.log('CTA HTML preview:', ctaHTML.substring(0, 200))
    }
    
    return result
  }, [post?.content, ctaHTML, post?.title])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'en' ? 'en-US' : language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl text-gray-900 mb-4 md:mb-6 leading-tight">Article Not Found</h1>
        <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
        <Link href="/" className="primary-cta text-lg px-8 py-4 inline-flex items-center gap-2">
          <IconArrowLeft />
          <span className="btn-text inline-block">Back to Home</span>
        </Link>
      </div>
    )
  }

  // Breadcrumbs pour données structurées
  const breadcrumbItems = [
    { name: t('common.home') || 'Home', url: '/' },
    { name: t('blog.title') || 'Blog', url: '/blog' },
    { name: post.title, url: pathname },
  ]

  return (
    <div className="min-h-screen">
      <SEOHead
        title={post.meta_title || post.title || 'Blog Post'}
        description={post.meta_description || post.excerpt || ''}
        ogTitle={post.meta_title || post.title || 'Blog Post'}
        ogDescription={post.meta_description || post.excerpt || ''}
        twitterTitle={post.meta_title || post.title || 'Blog Post'}
        twitterDescription={post.meta_description || post.excerpt || ''}
        canonicalPath={pathname}
      />
      <StructuredData
        type="Article"
        data={{
          headline: post.title,
          description: post.meta_description || post.excerpt || '',
          image: post.cover_image_url || '',
          datePublished: post.published_at || new Date().toISOString(),
          dateModified: post.updated_at || post.published_at || new Date().toISOString(),
        }}
        additionalData={[
          {
            type: 'BreadcrumbList',
            data: {
              items: breadcrumbItems,
            },
          },
          // Ajouter les FAQs extraites du HTML si disponibles
          ...(extractedFAQs.length > 0 ? [{
            type: 'FAQPage',
            data: {
              faqItems: extractedFAQs,
            },
          }] : []),
        ]}
      />
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-[30px] bg-gray-50">
        <div className="max-w-[1400px] mx-auto">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-8">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm mb-6 animate-fade-in overflow-hidden">
                <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0">
                  {t('common.home') || 'Home'}
                </Link>
                <span className="text-gray-400 flex-shrink-0">/</span>
                <Link href={getLocalizedPath('/blog')} className="text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0">
                  {t('blog.title') || 'Blog'}
                </Link>
                <span className="text-gray-400 flex-shrink-0">/</span>
                <span className="text-gray-900 font-medium truncate min-w-0">{post.title}</span>
              </nav>

              {/* Category Badge */}
              {post.category && (
                <div className="mb-4 animate-fade-in animation-delay-100">
                  <span className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-semibold">
                    {post.category}
                  </span>
                </div>
              )}

              {/* Title */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl text-gray-900 mb-4 md:mb-6 leading-tight animate-fade-in animation-delay-200">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8 animate-fade-in animation-delay-300">
                <span>{formatDate(post.published_at)}</span>
                {computedReadTime && (
                  <>
                    <span>•</span>
                    <span>{computedReadTime} {t('blog.minRead') || 'min read'}</span>
                  </>
                )}
                {post.views_count > 0 && (
                  <>
                    <span>•</span>
                    <span>{post.views_count} {t('common.views') || 'views'}</span>
                  </>
                )}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8 animate-fade-in animation-delay-400">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content with Table of Contents */}
      <article className="px-[30px] pb-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            {/* Table of Contents - Mobile first, then right side on desktop */}
            <div className="lg:col-span-4 lg:order-2">
              {hasHeadings && post.content && <TableOfContents content={post.content} />}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8 lg:order-1">
              <div
                ref={contentRef}
                className="blog-content animate-fade-in animation-delay-600"
                dangerouslySetInnerHTML={{ __html: contentWithCTAs }}
              />

              {/* FAQ Section - Dans le prolongement de l'article */}
              {extractedFAQs.length > 0 && (
                <div className="mt-16 mb-8">
                  <div className="text-center mb-10">
                    <div className="inline-block px-3 py-2 bg-black text-white rounded-full text-sm font-semibold mb-3 scroll-fade-in">
                      {t('faq.title') || 'Frequently Asked Questions'}
                    </div>
                  </div>

                  {/* Liste des FAQs */}
                  <div className="space-y-4">
                    {extractedFAQs.map((faq, index) => {
                      const isOpen = openFAQIndex === index
                      
                      return (
                        <div
                          key={`blog-faq-${index}`}
                          className="border border-gray-200 rounded-2xl overflow-hidden bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 scroll-slide-up"
                        >
                          <button
                            onClick={() => setOpenFAQIndex(isOpen ? null : index)}
                            className="w-full px-5 py-4 md:px-6 md:py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-all duration-300 group"
                          >
                            <span className="text-base md:text-lg font-bold text-gray-900 pr-4 transition-all">{faq.question}</span>
                            <div className={`w-8 h-8 flex items-center justify-center transition-transform duration-300 flex-shrink-0 ${
                              isOpen ? 'rotate-180' : ''
                            }`}>
                              <svg
                                className={`w-5 h-5 ${isOpen ? '' : 'text-gray-900'}`}
                                fill={isOpen ? "url(#blog-faq-gradient)" : "currentColor"}
                                viewBox="0 0 16 16"
                              >
                                <defs>
                                  <linearGradient id="blog-faq-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#491AE9" />
                                    <stop offset="33%" stopColor="#D414E5" />
                                    <stop offset="66%" stopColor="#FC03A1" />
                                    <stop offset="100%" stopColor="#FF7715" />
                                  </linearGradient>
                                </defs>
                                <path d="M8.00045 8.78092L11.3003 5.48111L12.2431 6.42392L8.00045 10.6666L3.75781 6.42392L4.70063 5.48111L8.00045 8.78092Z" />
                              </svg>
                            </div>
                          </button>

                          {isOpen && (
                            <div className="px-5 md:px-6 pb-5 animate-slide-up">
                              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
                                {faq.answer}
                              </p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* CTA Section */}
      <section className="px-[30px] pb-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 text-center shadow-2xl">
            {/* Background image optimisé avec next/image */}
            <Image
              src="/images/cta-background.webp"
              alt=""
              fill
              quality={80}
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="object-cover object-center"
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/60"></div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                {t('howItWorks.ctaTitle') || 'Ready to Get Started?'}
              </h3>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                {t('howItWorks.ctaDescription') || 'Notarize your documents online in just a few minutes. Secure, legally valid, and recognized internationally.'}
              </p>
              <a
                href={formUrl}
                className="primary-cta text-lg inline-flex items-center gap-3 bg-white text-black hover:bg-gray-100"
              >
                <IconCheck />
                <span className="btn-text inline-block">{post.cta || t('nav.notarizeNow')}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts Section */}
      <section className="px-[30px] py-20 bg-gray-50">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            {t('blog.latestArticles') || 'Latest Articles'}
          </h2>
          {relatedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={getLocalizedPath(`/blog/${relatedPost.slug}`)}
                  className="group block bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                >
                  {/* Cover Image */}
                  {relatedPost.cover_image_url ? (
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src={relatedPost.cover_image_url}
                        alt={relatedPost.cover_image_alt || relatedPost.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      {relatedPost.category && (
                        <span className="absolute top-4 left-4 px-3 py-1 bg-black text-white text-xs font-semibold rounded-full">
                          {relatedPost.category}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                      {relatedPost.category && (
                        <span className="absolute top-4 left-4 px-3 py-1 bg-black text-white text-xs font-semibold rounded-full">
                          {relatedPost.category}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Meta Info */}
                    {relatedPost.read_time_minutes && (
                      <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                        <span>{relatedPost.read_time_minutes} min read</span>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors">
                      {relatedPost.title}
                    </h3>

                    {/* Excerpt */}
                    {relatedPost.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {relatedPost.excerpt}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">
                        {formatDate(relatedPost.published_at)}
                      </span>
                      <div className="flex items-center gap-2 text-black font-medium text-sm group-hover:gap-3 transition-all">
                        {t('blog.readMore') || 'Read more'}
                        <IconOpenNew />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">{t('blog.noArticles') || 'No other articles available at the moment.'}</p>
            </div>
          )}
        </div>
      </section>

      {/* Back to Blog */}
      <section className="px-[30px] pb-20">
        <div className="max-w-[1400px] mx-auto text-center">
          <Link href={getLocalizedPath('/blog')} className="inline-flex items-center gap-3 text-gray-900 hover:text-black transition-colors font-medium">
            <IconArrowLeft />
            <span className="inline-block">{t('blog.backToBlog') || 'Back to Blog'}</span>
          </Link>
        </div>
      </section>
      <MobileCTA ctaText={post?.cta || t('nav.notarizeNow')} />
    </div>
  )
}
