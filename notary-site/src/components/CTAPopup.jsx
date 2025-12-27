'use client'

import { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useCurrency } from '../contexts/CurrencyContext';
import { getFormUrl } from '../utils/formUrl';
import { useService } from '../hooks/useServices';
import { useTranslation } from '../hooks/useTranslation';

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

// SVG Icon inline pour éviter @iconify/react
const IconOpenNew = () => (
  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zm-2 16H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7h-7z"/>
  </svg>
);

const CTAPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [ctaPrice, setCtaPrice] = useState('');
  const pathname = usePathname();
  const { currency, formatPrice } = useCurrency();
  const { t } = useTranslation();

  // Detect serviceId from URL if on a service page
  const serviceId = useMemo(() => {
    const serviceMatch = pathname.match(/^\/services\/([^/]+)/);
    return serviceMatch ? decodeURIComponent(serviceMatch[1]) : null;
  }, [pathname]);
  
  const isServicePage = !!serviceId;

  // Utiliser le hook prebuild au lieu de requêtes Supabase - ZERO latence !
  const { service } = useService(serviceId);

  // Update price when service or currency changes
  useEffect(() => {
    if (service?.base_price) {
      formatPrice(service.base_price).then(setCtaPrice);
    } else {
      setCtaPrice('');
    }
  }, [service?.base_price, formatPrice, currency]);

  // Prevent body scroll when popup is visible
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleContactClick = () => {
    loadAnalytics();
    safeTrack(trackCTAClick, 'popup_contact', serviceId, pathname, {
      ctaText: t('ctaPopup.contact'),
      destination: 'crisp_chat',
      ctaType: 'contact',
      elementId: 'popup_contact'
    });

    handleClose();
    // Open Crisp chat
    if (window.$crisp) {
      window.$crisp.push(['do', 'chat:open']);
    } else {
      setTimeout(() => {
        if (window.$crisp) {
          window.$crisp.push(['do', 'chat:open']);
        }
      }, 500);
    }
  };

  const handleCTAClick = () => {
    const label = isServicePage && service?.cta ? service.cta : t('nav.notarizeNow');
    const formUrl = getFormUrl(currency, serviceId);

    loadAnalytics();
    safeTrack(trackCTAClick, 'popup_cta', serviceId, pathname, {
      ctaText: label,
      destination: formUrl,
      elementId: 'popup_primary'
    });
    window.location.href = formUrl;
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fade-in"
      onClick={handleOverlayClick}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-8 animate-slide-up">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Popup content */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            {t('ctaPopup.title')}
          </h2>
          <p className="text-gray-600 mb-8 text-base">
            {t('ctaPopup.description')}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleContactClick}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all whitespace-nowrap"
            >
              {t('ctaPopup.contact')}
            </button>
            
            <div className="flex-1 flex flex-row flex-wrap items-center gap-2 sm:flex-col sm:items-center sm:gap-1">
              <button
                onClick={handleCTAClick}
                className="flex-1 min-w-0 px-6 py-3 bg-black text-white font-medium rounded-lg cursor-pointer hover:bg-gray-900 transition-all whitespace-nowrap inline-flex items-center justify-center gap-2 flex-shrink-0"
              >
                <IconOpenNew />
                <span className="inline-block">
                  {isServicePage && service?.cta ? service.cta : t('nav.notarizeNow')}
                </span>
              </button>
              {isServicePage && ctaPrice && (
                <div className="text-gray-900 flex items-center gap-1">
                  <span className="text-base font-semibold">{ctaPrice}</span>
                  <span className="text-xs font-normal text-gray-500">{t('services.perDocument')} - no hidden fee</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTAPopup;
