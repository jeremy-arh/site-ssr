'use client'

import Link from 'next/link';
import { memo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import { useServicesList } from '../hooks/useServices';
import { formatServicesForLanguage } from '../utils/services';
import PriceDisplay from './PriceDisplay';

// ANALYTICS DIFFÉRÉS - Ne pas importer au top level (évite forced layouts de 78ms)
let trackPlausibleServiceClick = null;
let trackServiceClick = null;

// Charger les analytics de manière non-bloquante
const loadAnalytics = () => {
  if (trackPlausibleServiceClick) return;
  Promise.all([
    import('../utils/plausible'),
    import('../utils/analytics')
  ]).then(([plausible, analytics]) => {
    trackPlausibleServiceClick = plausible.trackServiceClick;
    trackServiceClick = analytics.trackServiceClick;
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

// SVG Icons inline pour éviter @iconify/react (300ms de latence)
const IconBadgeCheck = memo(() => (
  <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
));

const IconTranslate = memo(() => (
  <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12.913 17H20.087M12.913 17L11 21M12.913 17L16.5 9L20.087 17M20.087 17L22 21"/>
    <path d="M2 5H8M8 5H11M8 5V3M11 5H14M11 5C10.5 9 9.5 11.5 8 14"/>
    <path d="M5 10C5.5 11.5 6.5 13 8 14M8 14C9 15 11 16.5 14 16.5"/>
  </svg>
));

const IconPassport = memo(() => (
  <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="2" width="16" height="20" rx="2"/>
    <circle cx="12" cy="10" r="3"/>
    <path d="M8 17h8"/>
  </svg>
));

const IconDocument = memo(() => (
  <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
  </svg>
));

const IconSignature = memo(() => (
  <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 19H4M4 15l3-3 2 2 4-4 3 3 4-4"/>
    <circle cx="18" cy="7" r="3"/>
  </svg>
));

const IconScale = memo(() => (
  <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 3v18M3 9l3-3 3 3M18 9l3-3-3-3M6 9v6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V9"/>
    <path d="M3 9a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3"/>
  </svg>
));

const IconApostille = memo(() => (
  <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v6l4 2"/>
    <path d="M2 12h2M20 12h2M12 2v2M12 20v2"/>
  </svg>
));

const IconPower = memo(() => (
  <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <path d="M14 2v6h6"/>
    <path d="M9 15l2 2 4-4"/>
  </svg>
));

// Map des icônes par service_id
const SERVICE_ICONS = {
  'certified-translation': IconTranslate,
  'certified-true-copy-of-passport': IconPassport,
  'certified-true-copy': IconDocument,
  'online-signature-certification': IconSignature,
  'online-affidavit-sworn-declaration': IconScale,
  'apostille-hague-convention': IconApostille,
  'online-power-of-attorney': IconPower,
  'commercial-administrative-documents': IconDocument,
};

const Services = ({ servicesData = null }) => {
  const { getLocalizedPath, language } = useLanguage();
  const { t } = useTranslation();
  
  // Toujours utiliser le hook pour garantir l'ordre des hooks
  const hookResult = useServicesList({ showInListOnly: true });
  
  // Si on a des données SSR, les utiliser, sinon fallback sur le hook
  const services = servicesData 
    ? formatServicesForLanguage(servicesData.filter(s => s.show_in_list === true), language)
    : hookResult.services;
  const isLoading = servicesData ? false : hookResult.isLoading;

  return (
    <section id="services" className="py-20 px-4 sm:px-[30px] bg-white overflow-hidden">
      <div className="max-w-[1300px] mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-semibold mb-4 scroll-fade-in">
            {t('services.title')}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 scroll-slide-up">
            {t('services.heading')}<br />
            <span>{t('services.headingHighlight')}</span>
          </h2>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto"></div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-gray-100 rounded-2xl p-6 h-48"></div>
                ))}
              </div>
            </div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">{t('services.noServices')}</p>
          </div>
        ) : (
          <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const ServiceIcon = SERVICE_ICONS[service.service_id] || IconBadgeCheck;
              return (
                <Link
                  key={service.id || service.service_id}
                  href={getLocalizedPath(`/services/${service.service_id}`)}
                  className="group block bg-gray-50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 border border-gray-200 transform hover:-translate-y-2 scroll-slide-up flex flex-col"
                  onClick={() => {
                    loadAnalytics();
                    safeTrack(trackPlausibleServiceClick, service.service_id, service.name, 'homepage_services');
                    safeTrack(trackServiceClick, service.service_id, service.name, 'homepage_services', window.location.pathname);
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                      <ServiceIcon />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{service.list_title || service.name}</h3>
                  </div>

                  <p className="text-gray-600 mb-6 min-h-[60px] leading-relaxed flex-1">{service.short_description || service.description}</p>

                  <div className="flex flex-col gap-3 mt-auto items-center">
                  <div className="inline-flex items-center gap-2 group-hover:gap-3 transition-all justify-center text-sm font-semibold text-black underline underline-offset-4 decoration-2">
                    <span className="btn-text inline-block">{t('services.learnMore')}</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                    {service.base_price && (
                      <div className="flex items-center gap-2 justify-center">
                        <PriceDisplay price={service.base_price} showFrom className="text-lg font-bold text-gray-900" />
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
