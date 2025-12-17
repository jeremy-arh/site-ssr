'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import SEOHead from '@/components/SEOHead'
import StructuredData from '@/components/StructuredData'
import { Icon } from '@iconify/react'
import { getSupabase } from '@/lib/supabase'
import { trackBlogPostView } from '@/utils/plausible'
import { useCurrency } from '@/contexts/CurrencyContext'
import { getFormUrl } from '@/utils/formUrl'
import { getCanonicalUrl } from '@/utils/canonicalUrl'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTranslation } from '@/hooks/useTranslation'
import { formatBlogPostForLanguage, formatBlogPostsForLanguage } from '@/utils/blog'
import TableOfContents from '@/components/TableOfContents'
import MobileCTA from '@/components/MobileCTA'

export default function BlogPostClient({ initialPost, initialRelatedPosts, postData, relatedPostsData, slug }) {
  const pathname = usePathname()
  const [post, setPost] = useState(initialPost)
  const [relatedPosts, setRelatedPosts] = useState(initialRelatedPosts)
  const [hasHeadings, setHasHeadings] = useState(false)
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">{t('blog.loading') || 'Loading...'}</p>
      </div>
    )
  }

  const formUrl = getFormUrl(currency, null)
  const canonicalUrl = getCanonicalUrl(pathname)

  return (
    <div className="min-h-screen">
      <SEOHead
        title={post.seo_title || post.title}
        description={post.seo_description || post.excerpt}
        ogTitle={post.og_title || post.title}
        ogDescription={post.og_description || post.excerpt}
        ogImage={post.og_image || post.cover_image_url}
        twitterTitle={post.twitter_title || post.title}
        twitterDescription={post.twitter_description || post.excerpt}
        twitterImage={post.twitter_image || post.cover_image_url}
        canonicalPath={pathname}
      />
      <StructuredData
        type="Article"
        data={{
          headline: post.title,
          description: post.excerpt,
          image: post.cover_image_url,
          datePublished: post.published_at,
          dateModified: post.updated_at || post.published_at,
          author: {
            '@type': 'Organization',
            name: 'My notary',
          },
          publisher: {
            '@type': 'Organization',
            name: 'My notary',
            logo: {
              '@type': 'ImageObject',
              url: `${canonicalUrl.split('/')[0]}//${canonicalUrl.split('/')[2]}/logo.png`,
            },
          },
        }}
      />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-[30px] bg-gray-50">
        <div className="max-w-[1100px] mx-auto">
          {post.category && (
            <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-semibold mb-6">
              {post.category}
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
            {post.published_at && (
              <div className="flex items-center gap-2">
                <Icon icon="tabler:calendar" className="w-5 h-5" />
                <span>{formatDate(post.published_at)}</span>
              </div>
            )}
            {post.read_time_minutes && (
              <div className="flex items-center gap-2">
                <Icon icon="tabler:clock" className="w-5 h-5" />
                <span>{post.read_time_minutes} {t('blog.minRead')}</span>
              </div>
            )}
            {post.views_count > 0 && (
              <div className="flex items-center gap-2">
                <Icon icon="tabler:eye" className="w-5 h-5" />
                <span>{post.views_count} {t('blog.views') || 'views'}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cover Image */}
      {post.cover_image_url && (
        <section className="px-[30px] mb-12">
          <div className="max-w-[1100px] mx-auto">
            <img
              src={post.cover_image_url}
              alt={post.cover_image_alt || post.title}
              className="w-full h-auto rounded-2xl shadow-xl"
              loading="eager"
            />
          </div>
        </section>
      )}

      {/* Content Section */}
      <section className="py-12 px-[30px]">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <div className="flex-1">
              <div
                ref={contentRef}
                className="prose prose-lg max-w-none blog-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* CTA Section */}
              <div className="mt-12 p-8 bg-gray-50 rounded-2xl border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('blog.ctaTitle') || 'Ready to get started?'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t('blog.ctaDescription') || 'Book your notarization appointment today and get your documents certified in minutes.'}
                </p>
                <Link
                  href={formUrl}
                  className="primary-cta inline-flex items-center gap-3"
                >
                  <span className="btn-text inline-block">{t('blog.ctaButton') || 'Start Notarization'}</span>
                  <Icon icon="tabler:arrow-right" className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-80 flex-shrink-0">
              {hasHeadings && (
                <div className="sticky top-24">
                  <TableOfContents />
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-20 px-[30px] bg-gray-50">
          <div className="max-w-[1100px] mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {t('blog.relatedPosts') || 'Related Articles'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={getLocalizedPath(`/blog/${relatedPost.slug}`)}
                  className="group block bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all"
                >
                  {relatedPost.cover_image_url && (
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={relatedPost.cover_image_url}
                        alt={relatedPost.cover_image_alt || relatedPost.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700">
                      {relatedPost.title}
                    </h3>
                    {relatedPost.excerpt && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {relatedPost.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-black font-medium text-sm">
                      {t('blog.readMore')}
                      <Icon icon="lsicon:open-new-filled" className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <MobileCTA />
    </div>
  )
}

