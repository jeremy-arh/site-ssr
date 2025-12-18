import { useEffect, useState, useMemo, memo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import StructuredData from '../components/StructuredData';
import { useCurrency } from '../contexts/CurrencyContext';
import { getFormUrl } from '../utils/formUrl';
import { getCanonicalUrl } from '../utils/canonicalUrl';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import { useService, useServicesList } from '../hooks/useServices';
import PriceDisplay from '../components/PriceDisplay';

// ANALYTICS : Plausible uniquement (léger, ~1KB)
// PAS de Supabase - les données sont dans le build !
const trackWithPlausible = (type, ...args) => {
  import('../utils/plausible').then((m) => {
    if (type === 'service') m.trackServiceClick(...args);
    else if (type === 'cta') m.trackCTAClick(...args);
  }).catch(() => {});
};

// Icônes des services - SVG inline pour éviter @iconify (performance)
const ServiceIcon = memo(({ icon, color = '#000000' }) => {
  const iconMap = {
    'mdi:translate': (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.87 15.07l-2.54-2.51l.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35C8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5l3.11 3.11l.76-2.04M18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12m-2.62 7l1.62-4.33L19.12 17h-3.24Z"/>
      </svg>
    ),
    'hugeicons:user-unlock-01': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="4"/><path d="M5 20v-1a7 7 0 0 1 14 0v1"/><path d="M15 14l2 2l4-4"/>
      </svg>
    ),
    'material-symbols-light:business-center-outline': (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 16h4v-2h-4v2Zm-6 4V8h4V4h8v4h4v12H4Zm6-12h4V6h-4v2ZM6 18h12V10H6v8Z"/>
      </svg>
    ),
    'solar:diploma-broken': (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 4h16v12H4V4Zm8 14l-3 4v-4H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5v4l-3-4Z"/>
      </svg>
    ),
    'hugeicons:legal-document-02': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h8M8 9h2"/>
      </svg>
    ),
    'lucide:signature': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 17a5 5 0 0 0 10 0c0-2.76-2.24-5-5-5s-5 2.24-5 5Z"/><path d="M12 17h10"/><path d="M22 17a5 5 0 0 0-5-5"/>
      </svg>
    ),
    'prime:copy': (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1Zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2Zm0 16H8V7h11v14Z"/>
      </svg>
    ),
  };
  
  const svgIcon = iconMap[icon];
  
  if (!svgIcon) {
    // Fallback: icône document générique
    return (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"/>
        <path d="M14 2v6h6"/>
      </svg>
    );
  }
  
  return (
    <div className="w-8 h-8" style={{ color }}>
      {svgIcon}
    </div>
  );
});

// Image Hero - Desktop et Mobile
const HERO_IMG_DESKTOP = 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/763a76aa-aa08-47d4-436f-ca7bea56e900/q=20,f=webp';
const HERO_IMG_MOBILE = 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/763a76aa-aa08-47d4-436f-ca7bea56e900/w=800,q=20,f=webp';
// Image Pricing - Desktop et Mobile
const PRICING_IMG_DESKTOP = 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/ab3815ee-dd67-4351-09f2-f661ee7d1000/q=20,f=webp';
const PRICING_IMG_MOBILE = 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/ab3815ee-dd67-4351-09f2-f661ee7d1000/w=800,q=20,f=webp';

// SVG Icons inline pour éviter les requêtes réseau d'@iconify
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
const IconCheckCircle = memo(() => (
  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
  </svg>
));
const IconUpload = memo(() => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
  </svg>
));
const IconArrowLeft = memo(() => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
));
const IconOpenNew = memo(() => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zm-2 16H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7h-7z"/>
  </svg>
));
const IconArrowRight = memo(() => (
  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
));

// Import direct pour éviter le CLS causé par les Suspense fallbacks
import HowItWorks from '../components/HowItWorks';
import Testimonial from '../components/Testimonial';
import FAQ from '../components/FAQ';
import MobileCTA from '../components/MobileCTA';
import ChatCTA from '../components/ChatCTA';

// Other Services Section Component - memoized pour éviter re-renders
const OtherServicesSection = memo(() => {
  const { t } = useTranslation();
  const { getLocalizedPath } = useLanguage();

  // Utiliser le hook prebuild au lieu de requêtes Supabase
  const { services, isLoading } = useServicesList({
    showInListOnly: true,
    excludeServiceId: currentServiceId,
    limit: 6
  });

  if (isLoading || services.length === 0) {
    return null;
  }

  return (
    <section id="other-services" className="py-20 px-4 sm:px-[30px] bg-white overflow-hidden content-visibility-auto">
      <div className="max-w-[1300px] mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-semibold mb-4">
            {t('services.otherServices')}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t('services.otherServicesHeading').split(' ').slice(0, -2).join(' ')} <span>{t('services.otherServicesHeading').split(' ').slice(-2).join(' ')}</span>
          </h2>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((serviceItem) => (
            <Link
              key={serviceItem.id}
              to={getLocalizedPath(`/services/${serviceItem.service_id}`)}
              className="group block bg-gray-50 rounded-2xl p-6 hover:shadow-2xl transition-shadow duration-300 border border-gray-200 flex flex-col"
              onClick={() => {
                trackWithPlausible('service', serviceItem.service_id, serviceItem.name, 'service_detail_other_services');
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl" style={{ backgroundColor: `${serviceItem.color}15` }}>
                  <ServiceIcon icon={serviceItem.icon} color={serviceItem.color} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{serviceItem.list_title || serviceItem.name}</h3>
              </div>

              <p className="text-gray-600 mb-6 min-h-[60px] leading-relaxed flex-1">{serviceItem.short_description || serviceItem.description}</p>

              <div className="flex flex-col gap-3 mt-auto items-center">
                <div className="inline-flex items-center gap-2 group-hover:gap-3 transition-all justify-center text-sm font-semibold text-black underline underline-offset-4 decoration-2">
                  <span className="btn-text inline-block">{t('services.learnMore')}</span>
                  <IconArrowRight />
                </div>
                {serviceItem.base_price && (
                  <div className="flex items-center gap-2 justify-center">
                    <PriceDisplay price={serviceItem.base_price} showFrom className="text-lg font-bold text-gray-900" />
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
});

// SUPPRIMÉ: LazySection causait du CLS - composants chargés directement maintenant

// Composant mémorisé pour le contenu "What is" - extrait la logique lourde
const WhatIsContent = memo(({ service, t }) => {
  const { firstH2Content, contentWithoutFirstH2 } = useMemo(() => {
    const detailedDesc = service.detailed_description || '';
    const desc = service.description || '';
    
    const h2Regex = /<h2(?:\s+[^>]*)?>([\s\S]*?)<\/h2>/i;
    let h2Match = detailedDesc ? detailedDesc.match(h2Regex) : null;
    if (!h2Match && desc) h2Match = desc.match(h2Regex);
    
    let firstH2 = null;
    let contentWithout = detailedDesc || desc;
    
    if (h2Match && h2Match[1]) {
      firstH2 = h2Match[1]
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;|&#x27;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
      
      if (detailedDesc && detailedDesc.includes(h2Match[0])) {
        contentWithout = detailedDesc.replace(h2Match[0], '').trim();
      } else if (desc && desc.includes(h2Match[0])) {
        contentWithout = desc.replace(h2Match[0], '').trim();
      }
    }
    
    return { firstH2Content: firstH2, contentWithoutFirstH2: contentWithout };
  }, [service.detailed_description, service.description]);

  return (
    <>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-12 text-center">
        {firstH2Content || `${t('serviceDetail.whatIs')} ${service.name}?`}
      </h2>
      <div className="max-w-6xl mx-auto">
        <div className="blog-content" dangerouslySetInnerHTML={{ __html: contentWithoutFirstH2 }} />
      </div>
    </>
  );
});

// SUPPRIMÉ: useIsMobile causait un CLS énorme car il changeait après le rendu initial
// Utiliser uniquement des classes CSS responsive Tailwind à la place

const ServiceDetail = () => {
  const { serviceId: rawServiceId } = useParams();
  const location = useLocation();
  const { formatPrice, currency } = useCurrency();
  const [ctaPrice, setCtaPrice] = useState('');
  const { t } = useTranslation();
  const { getLocalizedPath } = useLanguage();

  // Décoder le serviceId depuis l'URL (au cas où il contiendrait des caractères encodés)
  const serviceId = useMemo(() => rawServiceId ? decodeURIComponent(rawServiceId) : null, [rawServiceId]);

  // Utiliser le hook prebuild - données synchrones, pas de chargement async
  const { service, error: serviceError } = useService(serviceId);
  const error = serviceError ? t('serviceDetail.loadServiceError') : null;

  // Différer le formatage du prix pour ne pas bloquer le rendu initial
  useEffect(() => {
    if (service?.base_price) {
      // Différer pour ne pas bloquer le FCP
      const timer = setTimeout(() => {
        formatPrice(service.base_price).then(setCtaPrice);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [service?.base_price, formatPrice]);

  // Track service view - Plausible uniquement (léger, ~1KB)
  useEffect(() => {
    if (service && serviceId) {
      trackWithPlausible('service', serviceId, service.name, 'service_detail_page');
    }
  }, [service, serviceId]);

  // Les données sont chargées de manière synchrone (prebuild)

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl text-gray-900 mb-4 md:mb-6 leading-tight">{t('common.notFound')}</h1>
        <p className="text-gray-600 mb-8">{error || t('common.error')}</p>
        <Link to={getLocalizedPath('/')} className="primary-cta text-lg px-8 py-4 inline-flex items-center gap-2">
          <IconOpenNew />
          <span className="btn-text inline-block">{t('nav.notarizeNow')}</span>
        </Link>
      </div>
    );
  }

  // Breadcrumbs pour données structurées
  const breadcrumbItems = [
    { name: t('common.home') || 'Home', url: '/' },
    { name: t('services.title') || 'Services', url: '/services' },
    { name: service.name, url: location.pathname },
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title={service.meta_title || service.name || t('serviceDetail.defaultTitle')}
        description={service.meta_description || service.short_description || service.description || ''}
        ogTitle={service.meta_title || service.name || t('serviceDetail.defaultTitle')}
        ogDescription={service.meta_description || service.short_description || service.description || ''}
        twitterTitle={service.meta_title || service.name || t('serviceDetail.defaultTitle')}
        twitterDescription={service.meta_description || service.short_description || service.description || ''}
        canonicalPath={location.pathname}
      />
      <StructuredData
        type="Service"
        data={{
          serviceName: service.name,
          serviceDescription: service.meta_description || service.short_description || service.description || '',
          '@id': getCanonicalUrl(location.pathname),
        }}
        additionalData={[
          {
            type: 'BreadcrumbList',
            data: {
              items: breadcrumbItems,
            },
          },
        ]}
      />
      {/* Hero Section - hauteur fixe pour éviter CLS */}
      <section data-hero className="relative overflow-hidden h-screen flex items-center">
        {/* Image Hero avec dimensions fixes pour éviter CLS - w=800 sur mobile */}
        <picture>
          <source media="(max-width: 768px)" srcSet={HERO_IMG_MOBILE} />
          <img
            src={HERO_IMG_DESKTOP}
            alt=""
            width="1920"
            height="1080"
            className="absolute inset-0 w-full h-full object-cover object-top"
            style={{ aspectRatio: '16/9' }}
            fetchPriority="high"
          />
        </picture>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-16 w-full">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white mb-4 lg:mb-6 leading-tight">
              {service.page_h1 || service.name}
            </h1>

            <p className="text-base sm:text-lg text-white/90 mb-6 lg:mb-8 leading-relaxed max-w-2xl">
              {service.short_description || service.description}
            </p>

            <div className="flex flex-row flex-wrap items-center gap-3 mb-8 lg:mb-12">
              <a 
                href={getFormUrl(currency, service?.service_id || serviceId)} 
                className="primary-cta text-base lg:text-lg inline-flex items-center gap-2 text-white flex-shrink-0 bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  const ctaCopy = service.cta || t('nav.notarizeNow');
                  const destination = getFormUrl(currency, service?.service_id || serviceId);
                  
                  trackWithPlausible('cta', 'service_detail_hero', service?.service_id || serviceId, location.pathname, {
                    ctaText: ctaCopy,
                    destination,
                    elementId: 'service_detail_hero'
                  });
                }}
              >
                <IconOpenNew />
                <span className="btn-text inline-block">
                  {service.cta || t('nav.notarizeNow')}
                </span>
              </a>
              {ctaPrice && (
                <div className="text-white flex items-center gap-1">
                  <span className="text-base font-semibold">{ctaPrice}</span>
                  <span className="text-xs font-normal text-white/70">{t('services.perDocument')} - no hidden fee</span>
                </div>
              )}
            </div>

            {/* Features - CSS responsive uniquement, pas de JS */}
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
      </section>

      {/* Pricing Section - Two Column Layout */}
      <section
        className="min-h-screen flex items-center justify-center px-4 sm:px-[30px] py-8 sm:py-16 relative"
        style={{ backgroundColor: '#F7F5F2' }}
      >
        <div className="max-w-[1300px] w-full mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left Side - Image - w=800 sur mobile */}
            <div className="lg:w-2/5 flex items-center justify-center">
              <picture>
                <source media="(max-width: 768px)" srcSet={PRICING_IMG_MOBILE} />
                <img
                  src={PRICING_IMG_DESKTOP}
                  alt={service.name}
                  className="w-full h-auto rounded-2xl object-cover"
                  loading="lazy"
                  width="520"
                  height="650"
                  style={{ maxHeight: '800px', aspectRatio: '4 / 5' }}
                />
              </picture>
            </div>

            {/* Right Side - Pricing Block */}
            <div className="lg:w-3/5 flex flex-col">
          <div 
                className="rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col h-full"
            style={{
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)'
            }}
          >
                {/* Top Section - Black Background */}
                <div 
                  className="p-6 sm:p-8 lg:p-10 xl:p-12"
                  style={{
                    background: '#000000'
                  }}
                >
                  {/* Price Section */}
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-white">{service.name}</h2>
                  
                  {service.base_price ? (
                    <>
                        <div className="mb-4 sm:mb-6">
                          <div className="flex items-baseline gap-2 mb-2 sm:mb-3">
                          <PriceDisplay 
                            price={service.base_price} 
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white"
                          />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-400">{t('services.perDocument')}</p>
                      </div>
                    </>
                  ) : (
                      <div>
                      <p className="text-base sm:text-lg text-gray-300">{t('serviceDetail.pricing.contactForPricing')}</p>
                    </div>
                  )}
                </div>
              </div>

                {/* Bottom Section - White Background */}
                <div 
                  className="p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col flex-1"
                  style={{
                    background: '#ffffff'
                  }}
                >
                {/* Benefits List - Optimisé sans animations coûteuses */}
                <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4 flex-1">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <IconCheckCircle />
                    <div>
                      <h3 className="text-gray-900 text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.legallyValid.title')}</h3>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.legallyValid.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <IconCheckCircle />
                    <div>
                      <h3 className="text-gray-900 text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.sameDay.title')}</h3>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.sameDay.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <IconCheckCircle />
                    <div>
                      <h3 className="text-gray-900 text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.officialNotarization.title')}</h3>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.officialNotarization.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <IconCheckCircle />
                    <div>
                      <h3 className="text-gray-900 text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.available247.title')}</h3>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.available247.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <IconCheckCircle />
                    <div>
                      <h3 className="text-gray-900 text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.transparentFee.title')}</h3>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.transparentFee.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <IconCheckCircle />
                    <div>
                      <h3 className="text-gray-900 text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.bankGradeSecurity.title')}</h3>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.bankGradeSecurity.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <IconCheckCircle />
                    <div>
                      <h3 className="text-gray-900 text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.globalCompliance.title')}</h3>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.globalCompliance.description')}</p>
                    </div>
                  </div>
                </div>

                {/* CTA Button - Simplifié sans animations coûteuses */}
                <a
                  href={getFormUrl(currency, service?.service_id || serviceId)}
                  onClick={() => {
                    const destination = getFormUrl(currency, service?.service_id || serviceId);
                    trackWithPlausible('cta', 'service_detail_pricing', service?.service_id || serviceId, location.pathname, {
                      ctaText: 'Upload my document',
                      destination,
                      elementId: 'service_detail_pricing'
                    });
                  }}
                  className="block w-full text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 text-white font-bold rounded-xl transition-colors duration-200 text-center bg-black hover:bg-gray-900 shadow-lg cursor-pointer"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <IconUpload />
                    Upload my document
                  </span>
                </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Section - content-visibility pour optimisation */}
      <section className="py-20 px-[30px] bg-gray-50 content-visibility-auto">
        <div className="max-w-[1300px] mx-auto">
          <WhatIsContent service={service} t={t} />
        </div>
      </section>

      {/* Chat CTA Section */}
      <ChatCTA />

      {/* Testimonial Section */}
      <Testimonial />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Other Services Section */}
      <OtherServicesSection currentServiceId={service.service_id} />

      {/* FAQ Section */}
      <FAQ />

      {/* Back to Services */}
      <section className="px-[30px] py-12">
        <div className="max-w-[1100px] mx-auto text-center">
          <Link to={getLocalizedPath('/#services')} className="inline-flex items-center gap-3 text-black font-semibold hover:underline">
            <IconArrowLeft />
            <span>{t('serviceDetail.backToServices')}</span>
          </Link>
        </div>
      </section>

      {/* Mobile CTA */}
      <MobileCTA ctaText={service.cta || t('nav.notarizeNow')} price={service.base_price} serviceId={service?.service_id || serviceId} />
    </div>
  );
};

export default ServiceDetail;
