'use client'

import { memo } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCurrency } from '../contexts/CurrencyContext';
import { getFormUrl } from '../utils/formUrl';
import { useTranslation } from '../hooks/useTranslation';
import { trackCTAToForm, trackCTAToFormOnService } from '../utils/gtm';

// URL Cloudflare - Next.js Image gère automatiquement le responsive
const HERO_IMG = 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/9483e3eb-083f-4203-aad2-34bd68e56c00/f=webp,q=80';

// ANALYTICS DIFFÉRÉS - Plausible + Segment (GA4)
let trackCTAClick = null;

// Charger Analytics (Plausible + Segment) de manière non-bloquante
const loadAnalytics = () => {
  if (trackCTAClick) return;
  import('../utils/analytics').then((analytics) => {
    trackCTAClick = analytics.trackCTAClick;
  }).catch(() => {});
};

// Helper pour tracker de manière non-bloquante
const safeTrack = (fn, ...args) => {
  if (fn) {
    try { fn(...args); } catch { /* ignore */ }
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

const Hero = memo(() => {
  const { currency } = useCurrency();
  const { t } = useTranslation();
  const pathname = usePathname();

  return (
    <section data-hero>
      {/* Hero Block with Background Image - LCP Element */}
      <div
        className="relative"
        style={{ backgroundColor: '#1f2937', position: 'relative', width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        {/* Image Hero LCP - next/image avec priority pour preload automatique */}
        <Image
          src={HERO_IMG}
          alt="Notary services background"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={80}
          className="object-cover"
          style={{ zIndex: 0 }}
          placeholder="empty"
        />

        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/80 z-[1]"></div>

        {/* Content Container - s'étire pour remplir toute la hauteur */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full py-8 sm:py-12 lg:py-16" style={{ width: '100%', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <div className="max-w-3xl w-full">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white mb-4 lg:mb-6 leading-tight">
              {t('hero.title')}
            </h1>

            <p className="text-base sm:text-lg text-white/90 mb-6 lg:mb-8 leading-relaxed max-w-2xl">
              {t('hero.subtitle')}
            </p>

            <a 
              id="hero-cta"
              href={getFormUrl(currency)} 
              className="text-base lg:text-lg mb-8 lg:mb-12 text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-all"
              style={{ 
                display: 'inline-flex', 
                flexDirection: 'row', 
                alignItems: 'center', 
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
              onClick={() => {
                loadAnalytics();
                safeTrack(trackCTAClick, 'hero', null, window.location.pathname, {
                  ctaText: t('nav.notarizeNow'),
                  destination: getFormUrl(currency),
                  elementId: 'hero_primary'
                });
                // Track GTM event (uniquement sur pages non-services)
                trackCTAToForm('hero', pathname, t('nav.notarizeNow'), getFormUrl(currency), 'hero_primary', null, currency);
                // Track GTM event (uniquement sur pages services)
                trackCTAToFormOnService('hero', pathname, t('nav.notarizeNow'), getFormUrl(currency), 'hero_primary', null, currency);
              }}
            >
              <IconOpenNew />
              <span style={{ whiteSpace: 'nowrap' }}>{t('nav.notarizeNow')}</span>
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
