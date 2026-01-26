'use client'

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../utils/language';

/**
 * Mapping des codes de langue vers les codes de locale pour og:locale
 */
const LANGUAGE_TO_LOCALE = {
  en: 'en_US',
  fr: 'fr_FR',
  es: 'es_ES',
  de: 'de_DE',
  it: 'it_IT',
  pt: 'pt_PT',
};

/**
 * Composant SEO qui gère uniquement les meta tags dynamiques.
 * 
 * IMPORTANT: Les canonical et hreflang sont maintenant gérés par les métadonnées Next.js
 * côté serveur (generateMetadata dans page.jsx) pour être présents dans le HTML initial.
 * 
 * Ce composant gère :
 * - L'attribut lang sur <html>
 * - Le title et description
 * - Les meta Open Graph
 * - Les meta Twitter Card
 */
const SEOHead = ({ 
  title, 
  description, 
  ogTitle, 
  ogDescription, 
  ogImage,
  twitterTitle,
  twitterDescription,
  twitterImage,
  noindex = false,
  nofollow = false,
  serverLanguage // Langue passée depuis le serveur
}) => {
  const pathname = usePathname()
  // Utiliser la langue serveur pour éviter le flash
  const language = serverLanguage || DEFAULT_LANGUAGE
  
  const locale = LANGUAGE_TO_LOCALE[language] || LANGUAGE_TO_LOCALE[DEFAULT_LANGUAGE];

  // Génère les meta robots
  const robotsContent = [];
  if (noindex) robotsContent.push('noindex');
  if (nofollow) robotsContent.push('nofollow');
  if (robotsContent.length === 0) robotsContent.push('index', 'follow');
  const robotsMeta = robotsContent.join(', ');

  // Met à jour l'attribut lang sur <html>
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  // Met à jour les meta tags dans le head (sauf canonical et hreflang gérés par Next.js)
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const head = document.head;
    
    // Title
    if (title) {
      let titleElement = document.querySelector('title');
      if (!titleElement) {
        titleElement = document.createElement('title');
        head.appendChild(titleElement);
      }
      titleElement.textContent = title;
    }

    // Description
    let descMeta = document.querySelector('meta[name="description"]');
    if (description) {
      if (!descMeta) {
        descMeta = document.createElement('meta');
        descMeta.setAttribute('name', 'description');
        head.appendChild(descMeta);
      }
      descMeta.setAttribute('content', description);
    } else if (descMeta) {
      descMeta.remove();
    }

    // Robots
    let robotsMetaElement = document.querySelector('meta[name="robots"]');
    if (!robotsMetaElement) {
      robotsMetaElement = document.createElement('meta');
      robotsMetaElement.setAttribute('name', 'robots');
      head.appendChild(robotsMetaElement);
    }
    robotsMetaElement.setAttribute('content', robotsMeta);

    // NE PAS toucher aux canonical et hreflang - ils sont gérés par Next.js côté serveur

    // Open Graph
    const setOGMeta = (property, content) => {
      if (!content) return;
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    if (ogTitle) setOGMeta('og:title', ogTitle);
    if (ogDescription) setOGMeta('og:description', ogDescription);
    if (ogImage) setOGMeta('og:image', ogImage);
    setOGMeta('og:type', 'website');
    setOGMeta('og:locale', locale);

    // Open Graph alternate locales
    document.querySelectorAll('meta[property="og:locale:alternate"]').forEach(meta => meta.remove());
    SUPPORTED_LANGUAGES.filter(lang => lang !== language).forEach((lang) => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:locale:alternate');
      meta.setAttribute('content', LANGUAGE_TO_LOCALE[lang]);
      head.appendChild(meta);
    });

    // Twitter Card
    const setTwitterMeta = (name, content) => {
      if (!content) return;
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    if (twitterTitle) {
      setTwitterMeta('twitter:card', 'summary_large_image');
      setTwitterMeta('twitter:title', twitterTitle);
    }
    if (twitterDescription) setTwitterMeta('twitter:description', twitterDescription);
    if (twitterImage) setTwitterMeta('twitter:image', twitterImage);

  }, [title, description, robotsMeta, ogTitle, ogDescription, ogImage, locale, language, twitterTitle, twitterDescription, twitterImage]);

  return null;
};

export default SEOHead;













