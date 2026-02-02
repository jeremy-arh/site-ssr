import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import StructuredData from '../components/StructuredData';
import { Icon } from '@iconify/react';
import { getSupabase } from '../lib/supabase';
import { cache } from '../utils/cache';
import { trackBlogPostView } from '../utils/plausible';
import { useCurrency } from '../contexts/CurrencyContext';
import { getFormUrl } from '../utils/formUrl';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import { formatBlogPostForLanguage, formatBlogPostsForLanguage } from '../utils/blog';
import TableOfContents from '../components/TableOfContents';
import MobileCTA from '../components/MobileCTA';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasHeadings, setHasHeadings] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const contentRef = useRef(null);
  const location = useLocation();
  const { currency } = useCurrency();
  const { language, getLocalizedPath } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    setIsLoading(true);
    fetchPost();
  }, [fetchPost]);

  useEffect(() => {
    if (post) {
      fetchRelatedPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post, slug, language]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [slug]);

  // Add IDs to H2 elements after content is rendered
  useEffect(() => {
    if (post && contentRef.current) {
      const h2Elements = contentRef.current.querySelectorAll('h2');
      h2Elements.forEach((h2, index) => {
        if (!h2.id) {
          h2.id = `heading-${index}`;
        }
        h2.classList.add('scroll-fade-in');
      });
    }
  }, [post]);

  useEffect(() => {
    if (!post?.content || typeof DOMParser === 'undefined') {
      setHasHeadings(false);
      return;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(post.content, 'text/html');
    const h2Elements = doc.querySelectorAll('h2');

    setHasHeadings(h2Elements.length > 0);
  }, [post]);


  const fetchPost = useCallback(async () => {
    setError(null);
    setPost(null);
    setIsLoading(true);

    const cachedPost = cache.get('blog_post', slug);
    // Check cache first (mais toujours formater selon la langue actuelle)
    let postData = cachedPost;

    // Si pas en cache, charger depuis la DB
    try {
      if (!postData) {
        const supabase = await getSupabase();
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();

        if (error) throw error;

        if (!data) {
          setError('Article not found');
          return;
        }

        postData = data;
        
        // Mettre en cache les données originales (pas formatées)
        cache.set('blog_post', slug, postData, 5 * 60 * 1000);
      }

      // Toujours formater l'article selon la langue actuelle (même s'il vient du cache)
      const formattedPost = formatBlogPostForLanguage(postData, language);
      setPost(formattedPost);

      // Track blog post view seulement si c'est un nouveau chargement (pas depuis le cache)
      if (!cachedPost) {
        trackBlogPostView(slug, formattedPost.title);
        // Increment view count
        getSupabase().then((supabase) => {
          supabase
            .from('blog_posts')
            .update({ views_count: (postData.views_count || 0) + 1 })
            .eq('id', postData.id)
          .then(() => {})
          .catch((err) => console.error('Error updating view count:', err));
        }).catch(() => {});
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      setError('Failed to load article');
    } finally {
      setIsLoading(false);
    }
  }, [slug, language]);

  const fetchRelatedPosts = async () => {
    if (!slug) return;
    
    try {
      const supabase = await getSupabase();
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .neq('slug', slug) // Exclude current post
        .order('published_at', { ascending: false })
        .limit(3); // Get 3 latest articles

      if (error) {
        console.error('Error fetching related posts:', error);
        setRelatedPosts([]);
        return;
      }
      
      // Formater les articles selon la langue
      const formattedPosts = formatBlogPostsForLanguage(data || [], language);
      setRelatedPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching related posts:', error);
      setRelatedPosts([]);
    }
  };

  const computedReadTime = useMemo(() => {
    if (!post) return null;
    if (post.read_time_minutes) return post.read_time_minutes;

    if (!post.content || typeof DOMParser === 'undefined') {
      return null;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(post.content, 'text/html');
    const textContent = doc.body?.textContent || '';
    const words = textContent.trim().split(/\s+/).filter(Boolean);

    if (words.length === 0) return null;

    return Math.max(1, Math.round(words.length / 200));
  }, [post]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    // Masquer tout le contenu (y compris header/footer) pendant le chargement pour éviter le flash
    return <div className="fixed inset-0 bg-white z-50" aria-busy="true" />;
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl text-gray-900 mb-4 md:mb-6 leading-tight">Article Not Found</h1>
        <p className="text-gray-600 mb-8">{error || 'The article you\'re looking for doesn\'t exist.'}</p>
        <Link to="/" className="primary-cta text-lg px-8 py-4 inline-flex items-center gap-2">
              <Icon icon="tabler:arrow-left" className="w-5 h-5" />
          <span className="btn-text inline-block">Back to Home</span>
        </Link>
      </div>
    );
  }

  // Breadcrumbs pour données structurées
  const breadcrumbItems = [
    { name: t('common.home') || 'Home', url: '/' },
    { name: t('blog.title') || 'Blog', url: '/blog' },
    { name: post.title, url: location.pathname },
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title={post.meta_title || post.title || 'Blog Post'}
        description={post.meta_description || post.excerpt || ''}
        ogTitle={post.meta_title || post.title || 'Blog Post'}
        ogDescription={post.meta_description || post.excerpt || ''}
        twitterTitle={post.meta_title || post.title || 'Blog Post'}
        twitterDescription={post.meta_description || post.excerpt || ''}
        canonicalPath={location.pathname}
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
        ]}
      />
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-[30px] bg-gray-50">
        <div className="max-w-[1400px] mx-auto">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6 animate-fade-in overflow-hidden">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0">
              {t('common.home') || 'Home'}
            </Link>
            <span className="text-gray-400 flex-shrink-0">/</span>
            <Link to={getLocalizedPath('/blog')} className="text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0">
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
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>
        </div>
      </article>

      {/* CTA Section - Full Width */}
      <section className="py-16 md:py-24" style={{ backgroundColor: '#F7F5F2' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4 leading-tight">
            {t('howItWorks.ctaTitle') || 'Ready to Get Started?'}
          </h3>
          <p className="text-lg md:text-xl text-gray-800 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('howItWorks.ctaDescription') || 'Notarize your documents online in just a few minutes. Secure, legally valid, and recognized internationally.'}
          </p>
          <a
            href={getFormUrl(currency)}
            className="text-lg inline-flex items-center gap-3 px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Icon icon="stash:check-solid" className="w-5 h-5" />
            <span className="btn-text inline-block">{post.cta || t('nav.notarizeNow')}</span>
          </a>
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
                  to={getLocalizedPath(`/blog/${relatedPost.slug}`)}
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
                        <Icon icon="lsicon:open-new-filled" className="w-4 h-4" />
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
          <Link to={getLocalizedPath('/blog')} className="inline-flex items-center gap-3 text-gray-900 hover:text-black transition-colors font-medium">
            <Icon icon="tabler:arrow-left" className="w-5 h-5" />
            <span className="inline-block">{t('blog.backToBlog') || 'Back to Blog'}</span>
          </Link>
        </div>
      </section>
      <MobileCTA ctaText={post?.cta || t('nav.notarizeNow')} />
    </div>
  );
};

export default BlogPost;
