'use client'

import { memo } from 'react';
import { useCurrency } from '../contexts/CurrencyContext';
import { getFormUrl } from '../utils/formUrl';
import { useTranslation } from '../hooks/useTranslation';

// ANALYTICS DIFFÉRÉS - Ne pas importer au top level (évite forced layouts de 78ms)
let trackPlausibleCTAClick = null;
let trackCTAClick = null;

// Charger les analytics de manière non-bloquante
const loadAnalytics = () => {
  if (trackPlausibleCTAClick) return;
  Promise.all([
    import('../utils/plausible'),
    import('../utils/analytics')
  ]).then(([plausible, analytics]) => {
    trackPlausibleCTAClick = plausible.trackCTAClick;
    trackCTAClick = analytics.trackCTAClick;
  }).catch(() => {});
};

// Helper pour tracker de manière non-bloquante
// eslint-disable-next-line no-unused-vars
const safeTrack = (fn, ...args) => {
  if (fn) {
    try { fn(...args); } catch (_e) { /* ignore */ }
  }
};

// Précharger après 2s
if (typeof window !== 'undefined') {
  setTimeout(loadAnalytics, 2000);
}

// SVG inline pour éviter @iconify (performance)
const IconWorld = memo(() => (
  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
));
const IconFlash = memo(() => (
  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
));
const IconLock = memo(() => (
  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
));
const IconOpenNew = memo(() => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zm-2 16H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7h-7z"/>
  </svg>
));

// Image Hero - Desktop et Mobile
const HERO_IMG_DESKTOP = 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/d0f6bfc4-a8db-41e1-87e2-7c7e0b7a1c00/q=20,f=webp';
const HERO_IMG_MOBILE = 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/d0f6bfc4-a8db-41e1-87e2-7c7e0b7a1c00/w=800,q=20,f=webp';

// SUPPRIMÉ: useIsMobile causait un CLS énorme - utiliser uniquement CSS responsive

const Hero = memo(() => {
  const { currency } = useCurrency();
  const { t } = useTranslation();

  return (
    <section className="lg:px-5 lg:pt-[90px]" data-hero>
      {/* Hero Block with Background Image - LCP Element */}
      <div
        className="relative lg:rounded-3xl overflow-hidden min-h-screen lg:min-h-0 lg:h-[calc(100vh-110px)] flex items-center"
      >
        {/* Image Hero avec fetchpriority high pour LCP - w=800 sur mobile */}
        <picture>
          <source media="(max-width: 768px)" srcSet={HERO_IMG_MOBILE} />
          <img
            src={HERO_IMG_DESKTOP}
            alt=""
            width="1920"
            height="1080"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ aspectRatio: '16/9' }}
            fetchPriority="high"
          />
        </picture>

        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-16 w-full">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white mb-4 lg:mb-6 leading-tight">
              {t('hero.title')}
            </h1>

            <p className="text-base sm:text-lg text-white/90 mb-6 lg:mb-8 leading-relaxed max-w-2xl">
              {t('hero.subtitle')}
            </p>

            <a 
              href={getFormUrl(currency)} 
              className="primary-cta text-base lg:text-lg inline-flex items-center gap-2 mb-8 lg:mb-12 text-white bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                loadAnalytics();
                safeTrack(trackPlausibleCTAClick, 'hero', null, window.location.pathname, {
                  ctaText: t('nav.notarizeNow'),
                  destination: getFormUrl(currency),
                  elementId: 'hero_primary'
                });
                safeTrack(trackCTAClick, 'hero', null, window.location.pathname);
              }}
            >
              <IconOpenNew />
              <span className="btn-text inline-block">{t('nav.notarizeNow')}</span>
            </a>

            {/* Features - CSS responsive uniquement */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-8 mt-6 lg:mt-8">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <IconWorld />
                <span className="text-white font-medium text-sm lg:text-base">{t('hero.feature1')}</span>
              </div>

              <div className="flex items-center gap-2 whitespace-nowrap">
                <IconFlash />
                <span className="text-white font-medium text-sm lg:text-base">{t('hero.feature2')}</span>
              </div>

              <div className="flex items-center gap-2 whitespace-nowrap">
                <IconLock />
                <span className="text-white font-medium text-sm lg:text-base">{t('hero.feature3')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
