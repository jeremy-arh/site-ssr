'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { getLocalizedPath as getLocalizedPathClient } from '@/lib/translations-server'
import { CategoryFilter, MobileCTA } from '@/components/InteractiveElements'

const IconOpenNew = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zm-2 16H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7h-7z"/>
  </svg>
)

export default function BlogContent({ language, translations, initialPosts, categories }) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const t = translations

  const getLocalizedPath = (path) => getLocalizedPathClient(path, language)

  // Filtrer les posts côté client quand la catégorie change
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') {
      return initialPosts
    }
    return initialPosts.filter(post => post.category === selectedCategory)
  }, [initialPosts, selectedCategory])

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
      {/* Hero Section - Server Rendered HTML */}
      <section className="pt-32 pb-16 px-[30px] bg-gray-50" data-hero>
        <div className="max-w-[1300px] mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-semibold mb-4 animate-fade-in">
            {t.badge}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in animation-delay-100">
            {t.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto animate-fade-in animation-delay-200">
            {t.description}
          </p>
        </div>
      </section>

      {/* Category Filter - Interactive */}
      {categories.length > 0 && (
        <section className="px-[30px] py-8 bg-white border-b border-gray-200">
          <div className="max-w-[1300px] mx-auto">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
              allText={t.allArticles}
            />
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-20 px-[30px] bg-white">
        <div className="max-w-[1300px] mx-auto">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">{t.noArticlesCategory}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
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
                        <span>{post.read_time_minutes} {t.minRead}</span>
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
                        {t.readMore}
                        <IconOpenNew />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Mobile CTA */}
      <MobileCTA ctaText={t.notarizeNow} />
    </div>
  )
}

