'use client'

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { getSupabase } from '../lib/supabase';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import { formatBlogPostsForLanguage } from '../utils/blog';

const BlogSection = ({ initialPosts = null }) => {
  const [posts, setPosts] = useState(initialPosts || []);
  const { t } = useTranslation();
  const { language, getLocalizedPath } = useLanguage();

  useEffect(() => {
    // Si on a déjà des posts initiaux (SSR), on les utilise
    if (initialPosts) {
      const formattedPosts = formatBlogPostsForLanguage(initialPosts, language);
      setPosts(formattedPosts);
      return;
    }

    // Sinon, récupérer côté client (fallback)
    fetchPosts();
  }, [language, initialPosts, fetchPosts]);

  const fetchPosts = useCallback(async () => {
    try {
      const supabase = await getSupabase();
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      
      const formattedPosts = formatBlogPostsForLanguage(data || [], language);
      setPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  }, [language]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="py-20 px-[30px] bg-white overflow-hidden">
      <div className="max-w-[1300px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-semibold mb-4 scroll-fade-in">
            {t('blog.badge')}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 scroll-slide-up">
            {t('blog.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto scroll-slide-up">
            {t('blog.description')}
          </p>
        </div>

        {/* Blog Cards */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">{t('blog.noArticles')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={getLocalizedPath(`/blog/${post.slug}`)}
                className="group block bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 scroll-slide-up"
              >
                {/* Cover Image */}
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

                {/* Content */}
                <div className="p-6">
                  {/* Meta Info */}
                  {post.read_time_minutes && (
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                      <span>{post.read_time_minutes} {t('blog.minRead')}</span>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Footer */}
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

        {/* View All Button */}
        {posts.length > 0 && (
          <div className="text-center mt-12 scroll-fade-in">
            <Link href={getLocalizedPath('/blog')} className="inline-flex items-center gap-3 text-gray-900 hover:text-black font-semibold text-lg">
              <span className="inline-block">{t('blog.viewAll')}</span>
              <Icon icon="lsicon:open-new-filled" className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
