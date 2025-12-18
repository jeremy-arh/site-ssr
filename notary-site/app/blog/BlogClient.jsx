'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import SEOHead from '@/components/SEOHead'
import { useTranslation } from '@/hooks/useTranslation'
import { useLanguage } from '@/contexts/LanguageContext'
import { formatBlogPostsForLanguage } from '@/utils/blog'
import MobileCTA from '@/components/MobileCTA'

export default function BlogClient({ initialPosts, initialCategories, postsData }) {
  const pathname = usePathname()
  const [posts, setPosts] = useState(initialPosts)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories, setCategories] = useState(initialCategories)
  const { t } = useTranslation()
  const { language, getLocalizedPath } = useLanguage()

  // Mettre à jour les posts quand la langue change
  useEffect(() => {
    if (postsData && postsData.length > 0) {
      const formattedPosts = formatBlogPostsForLanguage(postsData, language)
      
      if (selectedCategory !== 'all') {
        const filtered = formattedPosts.filter(post => post.category === selectedCategory)
        setPosts(filtered)
      } else {
        setPosts(formattedPosts)
      }

      // Mettre à jour les catégories selon la langue
      const uniqueCategories = [...new Set(formattedPosts.map(post => post.category).filter(Boolean))]
      setCategories(uniqueCategories)
    }
  }, [language, selectedCategory, postsData])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'en' ? 'en-US' : language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title={t('seo.blogTitle')}
        description={t('seo.blogDescription')}
        ogTitle={t('seo.blogTitle')}
        ogDescription={t('seo.blogDescription')}
        twitterTitle={t('seo.blogTitle')}
        twitterDescription={t('seo.blogDescription')}
        canonicalPath={pathname}
      />
      <section className="pt-32 pb-16 px-[30px] bg-gray-50">
        <div className="max-w-[1300px] mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-semibold mb-4 animate-fade-in">
            {t('blog.badge')}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in animation-delay-100">
            {t('blog.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto animate-fade-in animation-delay-200">
            {t('blog.description')}
          </p>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="px-[30px] py-8 bg-white border-b border-gray-200">
          <div className="max-w-[1300px] mx-auto">
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('blog.allArticles')}
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 px-[30px] bg-white">
        <div className="max-w-[1300px] mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">{t('blog.noArticlesCategory')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={getLocalizedPath(`/blog/${post.slug}`)}
                  className="group block bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                >
                  {post.cover_image_url ? (
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src={post.cover_image_url}
                        alt={post.cover_image_alt || post.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      {post.category && (
                        <span className="absolute top-4 left-4 px-3 py-1 bg-black text-white text-xs font-semibold rounded-full">
                          {post.category}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                      {post.category && (
                        <span className="absolute top-4 left-4 px-3 py-1 bg-black text-white text-xs font-semibold rounded-full">
                          {post.category}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="p-6">
                    {post.read_time_minutes && (
                      <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                        <span>{post.read_time_minutes} {t('blog.minRead')}</span>
                      </div>
                    )}

                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors">
                      {post.title}
                    </h3>

                    {post.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">
                        {formatDate(post.published_at)}
                      </span>
                      <div className="flex items-center gap-2 text-black font-medium text-sm group-hover:gap-3 transition-all">
                        {t('blog.readMore')}
                        <Icon icon="lsicon:open-new-filled" className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <MobileCTA />
    </div>
  )
}

