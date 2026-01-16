'use client'

import { memo, useMemo } from 'react';
import Link from 'next/link';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';

// IMPORT STATIQUE - Les données sont dans le bundle, ZERO fetch !
import blogIndexData from '../../public/data/blog-index.json';
import servicesIndexData from '../../public/data/services-index.json';

// Posts par défaut si le fichier est vide
const DEFAULT_POSTS = [
  { slug: 'placeholder-1', title: '—' },
  { slug: 'placeholder-2', title: '—' },
  { slug: 'placeholder-3', title: '—' },
  { slug: 'placeholder-4', title: '—' },
  { slug: 'placeholder-5', title: '—' }
];

const Footer = memo(() => {
  const { t } = useTranslation();
  const { getLocalizedPath, language } = useLanguage();
  
  // useMemo synchrone - ZERO CLS !
  const recentPosts = useMemo(() => {
    if (blogIndexData && blogIndexData.length > 0) {
      return blogIndexData.slice(0, 5);
    }
    return DEFAULT_POSTS;
  }, []);

  // Formater les services selon la langue
  const services = useMemo(() => {
    if (!servicesIndexData || servicesIndexData.length === 0) {
      return [];
    }
    
    // Filtrer les services actifs qui doivent apparaître dans la liste
    const activeServices = servicesIndexData.filter(s => s.show_in_list === true);
    
    // Formater selon la langue
    return activeServices.map(service => {
      const nameKey = language === 'en' ? 'name' : `name_${language}`;
      return {
        service_id: service.service_id,
        name: service[nameKey] || service.name
      };
    });
  }, [language]);

  return (
    <footer 
      className="bg-gray-900 text-white" 
      style={{ 
        contain: 'layout style',
        minHeight: '320px' // Hauteur min fixe pour éviter CLS sur desktop
      }}
    >
      <div className="max-w-[1300px] mx-auto px-[30px] py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Logo */}
          <div className="md:col-span-1">
            <a href="/" className="inline-block">
              <img
                src="https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/b9d9d28f-0618-4a93-9210-8d9d18c3d200/q=10"
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

          {/* Services Links */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Services</h3>
            <ul className="space-y-2">
              {services.map((service) => {
                const servicePath = `/services/${service.service_id}`;
                const localizedServicePath = getLocalizedPath ? getLocalizedPath(servicePath) : servicePath;
                
                return (
                  <li key={service.service_id} className="h-5">
                    <a
                      href={localizedServicePath}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm line-clamp-1 block h-5 overflow-hidden cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = localizedServicePath;
                      }}
                    >
                      {service.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              {recentPosts.map((post) => {
                const postPath = `/blog/${post.slug}`;
                const localizedPostPath = getLocalizedPath ? getLocalizedPath(postPath) : postPath;
                
                return (
                  <li key={post.slug} className="h-5">
                    <a
                      href={localizedPostPath}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm line-clamp-1 block h-5 overflow-hidden cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = localizedPostPath;
                      }}
                    >
                      {post.title}
                    </a>
                  </li>
                );
              })}
              <li className="h-5">
                <a
                  href={getLocalizedPath ? getLocalizedPath('/blog') : '/blog'}
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm block h-5 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    const blogPath = getLocalizedPath ? getLocalizedPath('/blog') : '/blog';
                    window.location.href = blogPath;
                  }}
                >
                  See all resources &gt;
                </a>
              </li>
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href={getLocalizedPath ? getLocalizedPath('/terms-conditions') : '/terms-conditions'} 
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    const termsPath = getLocalizedPath ? getLocalizedPath('/terms-conditions') : '/terms-conditions';
                    window.location.href = termsPath;
                  }}
                >
                  Terms &amp; Conditions
                </a>
              </li>
              <li>
                <a 
                  href={getLocalizedPath ? getLocalizedPath('/privacy-policy') : '/privacy-policy'} 
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    const privacyPath = getLocalizedPath ? getLocalizedPath('/privacy-policy') : '/privacy-policy';
                    window.location.href = privacyPath;
                  }}
                >
                  Privacy policy
                </a>
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
