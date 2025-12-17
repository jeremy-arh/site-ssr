'use client'

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import { getCanonicalUrl } from '../utils/canonicalUrl';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, removeLanguageFromPath, addLanguageToPath } from '../utils/language';

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
 * Mapping des codes de langue vers les codes hreflang
 * Certaines langues peuvent avoir des variantes régionales
 */
const LANGUAGE_TO_HREFLANG = {
  en: 'en',
  fr: 'fr',
  es: 'es',
  de: 'de',
  it: 'it',
  pt: 'pt',
};

/**
 * Composant SEO global qui gère :
 * - L'attribut lang sur <html>
 * - Les balises hreflang pour toutes les langues
 * - Les balises meta de base (peut être étendu)
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
  canonicalPath,
  noindex = false,
  nofollow = false
}) => {
  const { language } = useLanguage();
  const pathname = usePathname();
  
  // Génère les URLs hreflang pour toutes les langues
  const generateHreflangUrls = () => {
    const basePath = canonicalPath || pathname;
    const cleanPath = removeLanguageFromPath(basePath);
    const hreflangUrls = [];

    // Pour chaque langue supportée, génère l'URL correspondante
    SUPPORTED_LANGUAGES.forEach((lang) => {
      const localizedPath = addLanguageToPath(cleanPath, lang);
      const url = getCanonicalUrl(localizedPath);
      hreflangUrls.push({
        lang: LANGUAGE_TO_HREFLANG[lang],
        url,
      });
    });

    // Ajoute aussi x-default qui pointe vers la langue par défaut
    const defaultPath = addLanguageToPath(cleanPath, DEFAULT_LANGUAGE);
    hreflangUrls.push({
      lang: 'x-default',
      url: getCanonicalUrl(defaultPath),
    });

    return hreflangUrls;
  };

  const hreflangUrls = generateHreflangUrls();
  const canonicalUrl = getCanonicalUrl(canonicalPath || pathname);
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

  // Met à jour les meta tags dans le head
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

    // Canonical
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Hreflang - supprimer les anciens
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(link => link.remove());
    // Ajouter les nouveaux
    hreflangUrls.forEach(({ lang, url }) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', lang);
      link.setAttribute('href', url);
      head.appendChild(link);
    });

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
    setOGMeta('og:url', canonicalUrl);
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

    // Cleanup function
    return () => {
      // Ne pas supprimer les meta tags au cleanup car ils sont nécessaires
      // Ils seront mis à jour au prochain render
    };
  }, [title, description, robotsMeta, canonicalUrl, hreflangUrls, ogTitle, ogDescription, ogImage, locale, language, twitterTitle, twitterDescription, twitterImage]);

  // Le composant ne retourne rien car tout est géré via useEffect
  return null;
};

export default SEOHead;













