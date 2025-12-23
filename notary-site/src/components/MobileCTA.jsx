'use client'

import { useState, useEffect, useCallback, memo } from 'react';
import { useCurrency } from '../contexts/CurrencyContext';
import { getFormUrl } from '../utils/formUrl';
import { useTranslation } from '../hooks/useTranslation';

// ANALYTICS DIFFÉRÉS - Uniquement Plausible
let trackPlausibleCTAClick = null;

// Charger Plausible de manière non-bloquante
const loadAnalytics = () => {
  if (trackPlausibleCTAClick) return;
  import('../utils/plausible').then((plausible) => {
    trackPlausibleCTAClick = plausible.trackCTAClick;
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
  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zm-2 16H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7h-7z"/>
  </svg>
));

const MobileCTA = memo(({ ctaText = null, price, serviceId = null }) => {
  const { t } = useTranslation();
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
    if (price) {
      formatPrice(price).then(setFormattedPrice);
    } else {
      setFormattedPrice('');
    }
  }, [price, formatPrice]);

  return (
    <div
      className="md:hidden mobile-cta-sticky"
      style={{
        transform: isVisible && !isMenuOpen ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s ease-out',
        pointerEvents: isVisible && !isMenuOpen ? 'auto' : 'none',
      }}
    >
      <div className="bg-white border-t border-gray-200 shadow-2xl">
        <div className="px-4 py-3">
          <div className="flex flex-col items-center gap-2">
            <a
              href={getFormUrl(currency, serviceId)}
              className="w-full text-center px-6 py-4 glassy-cta-blue font-bold rounded-lg transition-all duration-300"
              onClick={() => {
                loadAnalytics();
                safeTrack(trackPlausibleCTAClick, 'mobile_cta', serviceId, window.location.pathname, {
                  ctaText: defaultCtaText,
                  destination: getFormUrl(currency, serviceId),
                  elementId: 'mobile_bottom_cta'
                });
              }}
            >
              <span className="btn-text inline-block inline-flex items-center justify-center gap-2">
                <IconOpenNew />
                {defaultCtaText}
              </span>
            </a>
            {formattedPrice && (
              <div className="text-gray-900 flex items-center gap-1">
                <span className="text-base font-semibold">{formattedPrice}</span>
                <span className="text-xs font-normal text-gray-500">{t('services.perDocument')} - no hidden fee</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

MobileCTA.displayName = 'MobileCTA';

export default MobileCTA;
