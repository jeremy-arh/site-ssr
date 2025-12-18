'use client'

import { memo, useMemo } from 'react';
import Link from 'next/link';
import { useTranslation } from '../hooks/useTranslation';

// IMPORT STATIQUE - Les données sont dans le bundle, ZERO fetch !
import blogIndexData from '../../public/data/blog-index.json';

// Posts par défaut si le fichier est vide
const DEFAULT_POSTS = [
  { slug: 'placeholder-1', title: '—' },
  { slug: 'placeholder-2', title: '—' },
  { slug: 'placeholder-3', title: '—' }
];

const Footer = memo(() => {
  const { t } = useTranslation();
  
  // useMemo synchrone - ZERO CLS !
  const recentPosts = useMemo(() => {
    if (blogIndexData && blogIndexData.length > 0) {
      return blogIndexData.slice(0, 3);
    }
    return DEFAULT_POSTS;
  }, []);

  return (
    <footer 
      className="bg-gray-900 text-white" 
      style={{ 
        contain: 'layout style',
        minHeight: '320px' // Hauteur min fixe pour éviter CLS sur desktop
      }}
    >
      <div className="max-w-[1300px] mx-auto px-[30px] py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo */}
          <div className="md:col-span-1">
            <a href="/" className="inline-block">
              <img
                src="https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/b9d9d28f-0618-4a93-9210-8d9d18c3d200/w=auto,q=auto,f=avif"
                alt="Logo"
                width="120"
                height="32"
                className="h-8 w-auto"
                loading="lazy"
                decoding="async"
              />
            </a>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="/#services" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Our services
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  How it work
                </a>
              </li>
              <li>
                <a href="/#faq" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              {recentPosts.map((post) => (
                <li key={post.slug} className="h-5">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm line-clamp-1 block h-5 overflow-hidden"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
              <li className="h-5">
                <Link
                  href="/blog"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm block h-5"
                >
                  See all resources &gt;
                </Link>
              </li>
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms-conditions" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Privacy policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Disclaimer - hauteur fixe pour éviter CLS */}
        <div className="mb-6 min-h-[60px]">
          <p className="text-xs text-gray-500 leading-relaxed max-w-4xl mx-auto text-center">
            {t('footer.disclaimer')}
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-sm text-gray-400">Copyright © 2025 my notary</p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
