'use client'

import { useState, useEffect, useCallback, memo } from 'react';
import { usePathname } from 'next/navigation';
import { useCurrency } from '../contexts/CurrencyContext';
import { getFormUrl } from '../utils/formUrl';
import { useTranslation } from '../hooks/useTranslation';
import { trackCTAToForm, trackCTAToFormOnService } from '../utils/gtm';

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

// SVG inline pour éviter @iconify
const IconOpenNew = memo(() => (
  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zm-2 16H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7h-7z"/>
  </svg>
));

const MobileCTA = memo(({ ctaText = null, price, priceUsd = null, priceGbp = null, serviceId = null }) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const defaultCtaText = ctaText || t('nav.notarizeNow');
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [heroInView, setHeroInView] = useState(true);
  const [hasHero, setHasHero] = useState(false);
  const [scrolledEnough, setScrolledEnough] = useState(false);
  const { formatPrice, currency } = useCurrency();
  const [formattedPrice, setFormattedPrice] = useState('');

  const handleScroll = useCallback(() => {
    // Fallback when aucun hero n'est identifié
    if (!hasHero) {
      setScrolledEnough(window.scrollY > 200);
    }
  }, [hasHero]);

  const checkMenuState = useCallback(() => {
    setIsMenuOpen(document.body.classList.contains('mobile-menu-open'));
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const heroElement =
      document.querySelector('[data-hero]') ||
      document.getElementById('hero-section');

    if (heroElement) {
      setHasHero(true);
      const observer = new IntersectionObserver(
        ([entry]) => {
          // CTA visible uniquement quand le hero est complètement sorti
          setHeroInView(entry.isIntersecting);
        },
        {
          threshold: 0,
        }
      );

      observer.observe(heroElement);
      return () => observer.disconnect();
    } else {
      setHasHero(false);
    }
  }, []);

  useEffect(() => {
    const shouldShow = hasHero ? !heroInView : scrolledEnough;
    setIsVisible(shouldShow);
  }, [hasHero, heroInView, scrolledEnough]);
  
  // Masquer uniquement quand le menu est ouvert
  useEffect(() => {
    if (isMenuOpen) {
      setIsVisible(false);
    }
  }, [isMenuOpen]);

  useEffect(() => {
    // Check initial state
    checkMenuState();

    // Observe changes to body classes
    const observer = new MutationObserver(checkMenuState);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, [checkMenuState]);

  useEffect(() => {
    if (!price) {
      setFormattedPrice('');
      return;
    }
    
    // EUR, USD, GBP = prix fixes depuis la DB
    if (currency === 'EUR') {
      setFormattedPrice(`${price}€`);
    } else if (currency === 'USD' && priceUsd != null) {
      setFormattedPrice(`$${Number(priceUsd).toFixed(2)}`);
    } else if (currency === 'GBP' && priceGbp != null) {
      setFormattedPrice(`£${Number(priceGbp).toFixed(2)}`);
    } else {
      // Autres devises = conversion dynamique
      formatPrice(price).then(setFormattedPrice);
    }
  }, [price, priceUsd, priceGbp, currency, formatPrice]);

  const backgroundImageUrl = 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/104122e4-b72f-471e-b61d-ee998edb2a00/public';

  return (
    <div
      className="md:hidden mobile-cta-sticky"
      style={{
        transform: isVisible && !isMenuOpen ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s ease-out',
        pointerEvents: isVisible && !isMenuOpen ? 'auto' : 'none',
      }}
    >
      <div 
        className="border-t border-gray-200 shadow-2xl relative overflow-hidden"
        style={{
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay opaque */}
        <div className="absolute inset-0 bg-white"></div>
        <div className="relative z-10">
        <div className="px-4 py-2">
          <div className="flex flex-col items-center gap-1.5">
            <a
              href={getFormUrl(currency, serviceId)}
              className="w-full text-center px-4 py-2.5 glassy-cta-blue font-bold rounded-lg transition-all duration-300 text-sm"
              onClick={() => {
                loadAnalytics();
                safeTrack(trackCTAClick, 'mobile_cta', serviceId, window.location.pathname, {
                  ctaText: defaultCtaText,
                  destination: getFormUrl(currency, serviceId),
                  elementId: 'mobile_bottom_cta'
                });
                // Track GTM event (uniquement sur pages non-services)
                trackCTAToForm('mobile_cta', pathname, defaultCtaText, getFormUrl(currency, serviceId), 'mobile_bottom_cta', serviceId, currency);
                // Track GTM event (uniquement sur pages services)
                trackCTAToFormOnService('mobile_cta', pathname, defaultCtaText, getFormUrl(currency, serviceId), 'mobile_bottom_cta', serviceId, currency);
              }}
            >
              <span className="btn-text inline-block inline-flex items-center justify-center gap-2">
                <IconOpenNew />
                {defaultCtaText}
              </span>
            </a>
            {serviceId && (
              <div className="text-gray-900 flex items-center gap-1">
                {formattedPrice && (
                  <span className="text-sm font-semibold">{formattedPrice}</span>
                )}
                <span className="text-xs font-normal text-gray-500">{t('services.perDocument')} - no hidden fee</span>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
});

MobileCTA.displayName = 'MobileCTA';

export default MobileCTA;
