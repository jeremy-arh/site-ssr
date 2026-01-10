'use client'

import { useState, useEffect, useCallback, memo } from 'react';
import { usePathname } from 'next/navigation';
import { useCurrency } from '../contexts/CurrencyContext';
import CurrencySelector from './CurrencySelector';
import LanguageSelector from './LanguageSelector';
import TopBanner from './TopBanner';
import { getFormUrl } from '../utils/formUrl';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import { formatServiceForLanguage } from '../utils/services';
import { removeLanguageFromPath, SUPPORTED_LANGUAGES } from '../utils/language';
import { trackCTAToForm, trackCTAToFormOnService } from '../utils/gtm';
// NOTE: Ne plus utiliser Supabase côté client - utiliser les données SSR
import servicesData from '../../public/data/services.json';

// ANALYTICS DIFFÉRÉS - Plausible + Segment (GA4)
let trackCTAClick = null;
let trackLoginClick = null;
let trackNavigationClick = null;

// Charger Analytics (Plausible + Segment) de manière non-bloquante
const loadAnalytics = () => {
  if (trackCTAClick) return;
  import('../utils/analytics').then((analytics) => {
    trackCTAClick = analytics.trackCTAClick;
    trackLoginClick = analytics.trackLoginClick;
    trackNavigationClick = analytics.trackNavigationClick;
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
const IconOpenNew = memo(() => (
  <svg className="w-3 h-3 lg:w-4 lg:h-4 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zm-2 16H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7h-7z"/>
  </svg>
));
const IconOpenNewLarge = memo(() => (
  <svg className="w-5 h-5 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zm-2 16H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7h-7z"/>
  </svg>
));

// Icônes pour le menu mobile
// material-symbols:list-rounded - icône de liste arrondie
const IconListRounded = memo(() => (
  <svg className="w-5 h-5 text-blue-600 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/>
  </svg>
));

// uil:process - icône de processus avec flèches circulaires (représente un flux de processus)
const IconProcess = memo(() => (
  <svg className="w-5 h-5 text-blue-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12h18M3 12l4-4M3 12l4 4M21 12l-4-4M21 12l-4 4"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
  </svg>
));

const IconQuestion = memo(() => (
  <svg className="w-5 h-5 text-blue-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>
  </svg>
));

const IconPaperclip = memo(() => (
  <svg className="w-5 h-5 text-white flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
  </svg>
));

const IconClose = memo(() => (
  <svg className="w-6 h-6 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
));

// Helper function pour scroll vers une section
const scrollToSection = (sectionId) => {
  console.log('scrollToSection called with:', sectionId);
  
  const element = document.getElementById(sectionId);
  console.log('Element found:', element ? 'yes' : 'no');
  
  if (!element) {
    console.warn(`Section with id "${sectionId}" not found in DOM`);
    // Essayer de lister tous les éléments avec un id pour déboguer
    const allIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
    console.log('Available IDs:', allIds);
    return;
  }
  
  console.log('Element position:', element.getBoundingClientRect());
  
  // Calculer la navbar height
  const navbar = document.querySelector('nav');
  const navbarHeight = navbar ? navbar.offsetHeight : (window.innerWidth < 768 ? 60 : 100);
  console.log('Navbar height:', navbarHeight);
  
  // Calculer la position cible
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - navbarHeight - 20;
  
  console.log('Scrolling to position:', offsetPosition);
  
  // Scroller vers la position
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
};

// Cacher le scroll pour éviter les forced layouts répétés
let cachedScrollY = 0;
let dimensionsCached = false;

// Initialiser le scroll de façon différée pour ne pas bloquer le rendu initial
if (typeof window !== 'undefined') {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      cachedScrollY = window.scrollY;
      dimensionsCached = true;
    }, { timeout: 100 });
  } else {
    setTimeout(() => {
      cachedScrollY = window.scrollY;
      dimensionsCached = true;
    }, 50);
  }
}

const Navbar = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [_isScrolled, setIsScrolled] = useState(false);
  const [_isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [_isAtTop, setIsAtTop] = useState(true); // Commencer à true pour l'effet initial
  const [isHeroCTAOutOfView, setIsHeroCTAOutOfView] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [_isDesktop, setIsDesktop] = useState(false); // Pour gérer la visibilité responsive
  const [ctaText, setCtaText] = useState('');
  const [servicePrice, setServicePrice] = useState(null);
  const [_formattedPrice, setFormattedPrice] = useState('');
  const [currentServiceId, setCurrentServiceId] = useState(null);
  const pathname = usePathname();
  const { formatPrice, currency } = useCurrency();
  const { t } = useTranslation();
  const { language, getLocalizedPath } = useLanguage();
  
  // Marquer comme monté et détecter desktop pour éviter les différences d'hydratation
  useEffect(() => {
    setIsMounted(true);
    // Détecter si on est sur desktop
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Initialiser isAtTop au montage (seulement pour le scroll)
  useEffect(() => {
    if (!isMounted) return;
    
    if (dimensionsCached) {
      setIsAtTop(cachedScrollY === 0);
    } else {
      const checkDimensions = () => {
        cachedScrollY = window.scrollY;
        dimensionsCached = true;
        setIsAtTop(cachedScrollY === 0);
      };
      if ('requestIdleCallback' in window) {
        requestIdleCallback(checkDimensions, { timeout: 100 });
      } else {
        setTimeout(checkDimensions, 50);
      }
    }
  }, [isMounted]);
  // Note: Navbar is outside specific Route elements, so useParams is not reliable here
  
  // Helper function to check if we're on a service detail page (with or without language prefix)
  const isServicePage = useCallback(() => {
    const pathWithoutLang = removeLanguageFromPath(pathname);
    return pathWithoutLang.startsWith('/services/') && pathWithoutLang !== '/services';
  }, [pathname]);
  
  // Vérifier si on est sur une page service (utilisé via isServicePage() directement)
  const _isOnServicePage = isServicePage();

  const handleScroll = useCallback(() => {
    // Utiliser le cache pour éviter les forced layouts
    const currentScrollY = window.scrollY;
    cachedScrollY = currentScrollY; // Mettre à jour le cache
    
    setIsScrolled(currentScrollY > 50);
    setIsAtTop(currentScrollY === 0);

    // Masquer/afficher la navbar au scroll
    if (typeof window !== 'undefined') {
      if (currentScrollY <= 50) {
        // Toujours afficher en haut de page
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - masquer
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - afficher
        setIsHeaderVisible(true);
      }
    }

    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    // Appeler handleScroll immédiatement pour détecter la position initiale
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Observer pour détecter quand le CTA du hero sort complètement de l'écran
  useEffect(() => {
    setIsHeroCTAOutOfView(false);

    let observer = null;
    let retryTimeout = null;
    const maxAttempts = 15;
    let attempts = 0;

    const attachObserver = () => {
      const heroCTAElement = document.getElementById('hero-cta');

      if (heroCTAElement) {
        observer = new IntersectionObserver(
          ([entry]) => {
            // Le CTA du header devient bleu quand le CTA du hero n'est plus visible
            setIsHeroCTAOutOfView(!entry.isIntersecting);
          },
          {
            threshold: 0,
            rootMargin: '0px'
          }
        );

        observer.observe(heroCTAElement);
        return;
      }

      attempts += 1;
      if (attempts < maxAttempts) {
        retryTimeout = setTimeout(attachObserver, 150);
      } else {
        // Si après plusieurs tentatives aucun CTA hero n'existe (pas sur la home), on reste noir
        setIsHeroCTAOutOfView(false);
      }
    };

    const initialTimeout = setTimeout(attachObserver, 100);

    return () => {
      clearTimeout(initialTimeout);
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
      if (observer) {
        observer.disconnect();
      }
    };
  }, [pathname]); // Re-observer quand on change de page

  // Plus besoin de handleResize - CSS gère le responsive

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('mobile-menu-open');
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('mobile-menu-open');
    };
  }, [isMenuOpen]);

  // Récupérer le CTA depuis les données locales (pas de Supabase côté client)
  useEffect(() => {
      const path = pathname || '';

    // Blog post detail - pas de CTA spécifique côté client
      const blogMatch = path.match(/^\/blog\/([^/]+)/);
      if (blogMatch && blogMatch[1]) {
      setCurrentServiceId(null);
      setCtaText(''); // CTA par défaut pour les blogs
      return;
        }

        // Service detail (with or without language prefix)
        const pathWithoutLang = removeLanguageFromPath(path);
        const serviceMatch = pathWithoutLang.match(/^\/services\/([^/]+)/);
        if (serviceMatch && serviceMatch[1]) {
          const serviceId = decodeURIComponent(serviceMatch[1]);
      setCurrentServiceId(serviceId);
      
      // Chercher dans les données locales (SYNCHRONE - pas de fetch!)
      const serviceData = servicesData.find(s => s.service_id === serviceId);
      if (serviceData) {
        const formattedService = formatServiceForLanguage(serviceData, language);
              setCtaText(formattedService.cta || '');
              const price = formattedService.base_price;
              setServicePrice(price != null && price !== '' && price !== undefined ? price : null);
            } else {
            setCtaText('');
            setServicePrice(null);
          }
        } else {
          // Reset to default if not on blog/service detail page
          setCtaText('');
          setServicePrice(null);
      setCurrentServiceId(null);
      }
  }, [pathname, language]);

  useEffect(() => {
    if (servicePrice) {
      formatPrice(servicePrice).then(setFormattedPrice);
    } else {
      setFormattedPrice('');
    }
  }, [servicePrice, formatPrice]);

  // Sur page service et en haut = header transparent avec texte blanc
  // Note: on utilise isOnServicePage directement (pas isMounted) pour éviter le flash au premier rendu
  return (
    <>
      <TopBanner />
      <nav className="navbar-container">
        <div className={`navbar-inner ${isMenuOpen ? 'navbar-inner-menu-open' : ''}`}>
          <div className="w-full px-[20px] md:px-[20px] lg:px-[30px]">
            <div className="flex items-center justify-between w-full">
            {/* Left side: Logo + Navigation links */}
            <div className="flex items-center gap-2 md:gap-3 lg:gap-5 xl:gap-8">
              {/* Logo - caché sur mobile quand le menu est ouvert */}
              <a href="/" className={`flex-shrink-0 relative z-[60] ${isMenuOpen ? 'hidden md:block' : ''}`}>
                {/* Logo Mobile - toujours noir */}
                <img
                  src="https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/e4a88604-ba5d-44a5-5fe8-a0a26c632d00/q=10"
                  alt="Logo"
                  width="130"
                  height="32"
                  className="h-4 md:hidden w-auto"
                  loading="eager"
                  decoding="async"
                />
                {/* Logo Desktop - noir - taille responsive */}
                <img
                  src="https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/e4a88604-ba5d-44a5-5fe8-a0a26c632d00/q=10"
                  alt="Logo"
                  width="130"
                  height="32"
                  className="hidden md:block h-5 lg:h-6 xl:h-8 w-auto"
                  loading="eager"
                  decoding="async"
                />
              </a>

              {/* Desktop Navigation links - Left aligned with logo */}
              <div className="navbar-desktop hidden md:flex items-center gap-1 lg:gap-4 xl:gap-6 flex-shrink-0 overflow-visible">
                <a 
                  href={isServicePage() ? '#other-services' : getLocalizedPath('/#services')} 
                  className="nav-link text-xs lg:text-sm xl:text-base whitespace-nowrap text-black"
                  onClick={(e) => {
                    e.preventDefault();
                    const sectionId = isServicePage() ? 'other-services' : 'services';
                    scrollToSection(sectionId);
                    loadAnalytics();
                    safeTrack(trackNavigationClick, t('nav.services'), `#${sectionId}`, {
                      label: t('nav.services'),
                      pagePath: pathname,
                      section: 'navbar_desktop'
                    });
                  }}
                >
                  {t('nav.services')}
                </a>
                <a 
                  href={isServicePage() ? '#how-it-works' : getLocalizedPath('/#how-it-works')} 
                  className="nav-link text-xs lg:text-sm xl:text-base whitespace-nowrap text-black"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('how-it-works');
                    loadAnalytics();
                    safeTrack(trackNavigationClick, t('nav.howItWorks'), '#how-it-works', {
                      label: t('nav.howItWorks'),
                      pagePath: pathname,
                      section: 'navbar_desktop'
                    });
                  }}
                >
                  {t('nav.howItWorks')}
                </a>
                <a 
                  href={isServicePage() ? '#faq' : getLocalizedPath('/#faq')} 
                  className="nav-link text-xs lg:text-sm xl:text-base whitespace-nowrap text-black"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('faq');
                    loadAnalytics();
                    safeTrack(trackNavigationClick, t('nav.faq'), '#faq', {
                      label: t('nav.faq'),
                      pagePath: pathname,
                      section: 'navbar_desktop'
                    });
                  }}
                >
                  {t('nav.faq')}
                </a>
              </div>
            </div>

            {/* Right side: Language/Currency selectors + Login + CTA */}
            <div 
              className="navbar-desktop hidden md:flex items-center gap-2 lg:gap-4 xl:gap-6 flex-shrink-0 overflow-visible"
            >
              <div className="w-px h-5 lg:h-6 flex-shrink-0 bg-gray-300 hidden lg:block"></div>

              <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0">
                <div className="w-10 lg:w-auto">
                  <LanguageSelector isWhite={false} />
                </div>
                <div className="w-10 lg:w-auto">
                  <CurrencySelector isWhite={false} />
                </div>
              </div>

              <a 
                href="https://app.mynotary.io/login" 
                className="nav-link text-xs lg:text-sm xl:text-base font-semibold whitespace-nowrap flex-shrink-0 text-black hidden lg:block"
                onClick={() => {
                  loadAnalytics();
                  safeTrack(trackLoginClick, 'navbar_desktop', {
                    linkText: t('nav.login'),
                    pagePath: pathname,
                    destination: 'https://app.mynotary.io/login'
                  });
                }}
              >
                {t('nav.login')}
              </a>

              {/* CTA Button - toujours visible, devient bleu quand le CTA du hero sort de la vue */}
              <a 
                href={getFormUrl(currency, currentServiceId)} 
                className={`${isHeroCTAOutOfView ? 'glassy-cta-blue' : 'glassy-cta'} text-[10px] md:text-xs lg:text-sm relative z-10 flex-shrink-0 whitespace-nowrap px-2 md:px-3 lg:px-5 xl:px-6 py-1.5 md:py-2 lg:py-2.5 font-semibold rounded-md lg:rounded-lg transition-all duration-300`}
                onClick={() => {
                  loadAnalytics();
                  safeTrack(trackCTAClick, 'navbar_desktop', currentServiceId, pathname, {
                    ctaText: ctaText || t('nav.notarizeNow'),
                    destination: getFormUrl(currency, currentServiceId),
                    elementId: 'navbar_desktop_cta'
                  });
                  // Track GTM event (uniquement sur pages non-services)
                  trackCTAToForm('navbar_desktop', pathname, ctaText || t('nav.notarizeNow'), getFormUrl(currency, currentServiceId), 'navbar_desktop_cta', currentServiceId, currency);
                  // Track GTM event (uniquement sur pages services)
                  trackCTAToFormOnService('navbar_desktop', pathname, ctaText || t('nav.notarizeNow'), getFormUrl(currency, currentServiceId), 'navbar_desktop_cta', currentServiceId, currency);
                }}
              >
                <span className="btn-text inline-block inline-flex items-center gap-1 lg:gap-2 whitespace-nowrap">
                  <IconOpenNew />
                  <span className="whitespace-nowrap">{ctaText || t('nav.notarizeNow')}</span>
                </span>
              </a>
            </div>

            {/* Animated Hamburger Menu Button - MOBILE ONLY (hidden on md+ et quand le menu est ouvert) */}
            <button
              onClick={toggleMenu}
              className={`navbar-burger flex md:hidden relative z-[60] w-8 h-8 flex-col items-center justify-center focus:outline-none overflow-visible ${isMenuOpen ? 'hidden' : ''}`}
              aria-label="Toggle menu"
            >
              <div className="w-4 h-4 flex flex-col justify-center items-center relative">
                <span
                  className={`w-full h-0.5 rounded-full transition-all duration-300 origin-center absolute bg-gray-900 top-0`}
                ></span>
                <span
                  className={`w-full h-0.5 rounded-full transition-all duration-300 absolute opacity-100 scale-100 bg-gray-900 top-1/2 -translate-y-1/2`}
                ></span>
                <span
                  className={`w-full h-0.5 rounded-full transition-all duration-300 origin-center absolute bg-gray-900 bottom-0`}
                ></span>
              </div>
            </button>
          </div>
        </div>
        </div>
      </nav>

      {/* Fullscreen Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-[60] bg-white ${
          isMenuOpen
            ? 'opacity-100 visible translate-x-0 pointer-events-auto'
            : 'opacity-0 invisible translate-x-full pointer-events-none'
        }`}
        style={{
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-in-out, visibility 0.3s ease-in-out'
        }}
      >
        <div className="h-full flex flex-col">
          {/* Header avec logo et bouton fermer */}
          <div 
            className={`flex items-center justify-between px-6 py-4 border-b border-gray-200 transition-all duration-300 ${
              isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
            style={{ 
              transitionDelay: isMenuOpen ? '0.1s' : '0s',
              transitionProperty: 'opacity, transform',
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <a href="/" className="flex-shrink-0">
              <img
                src="https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/e4a88604-ba5d-44a5-5fe8-a0a26c632d00/q=10"
                alt="Logo"
                width="130"
                height="32"
                className="h-7 w-auto"
                loading="eager"
                decoding="async"
              />
            </a>
            <button
              onClick={closeMenu}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Close menu"
            >
              <IconClose />
            </button>
          </div>

          {/* Contenu du menu */}
          <div 
            className={`flex-1 overflow-y-auto px-6 py-6 transition-all duration-300 ${
              isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ 
              transitionDelay: isMenuOpen ? '0.15s' : '0s',
              transitionProperty: 'opacity, transform',
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div className="space-y-0">
              {/* Liens de navigation avec flèche à droite */}
              <a
                href={isServicePage() ? '#other-services' : getLocalizedPath('/#services')}
                onClick={(e) => {
                  e.preventDefault();
                  closeMenu();
                  const sectionId = isServicePage() ? 'other-services' : 'services';
                  setTimeout(() => scrollToSection(sectionId), 300);
                  loadAnalytics();
                  safeTrack(trackNavigationClick, t('nav.services'), `#${sectionId}`, {
                    label: t('nav.services'),
                    pagePath: pathname,
                    section: 'navbar_mobile'
                  });
                }}
                className="flex items-center justify-between px-4 py-4 text-gray-900 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100"
              >
                <span className="text-base font-medium">{t('nav.services')}</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href={isServicePage() ? '#how-it-works' : getLocalizedPath('/#how-it-works')}
                onClick={(e) => {
                  e.preventDefault();
                  closeMenu();
                  setTimeout(() => scrollToSection('how-it-works'), 300);
                  loadAnalytics();
                  safeTrack(trackNavigationClick, t('nav.howItWorks'), '#how-it-works', {
                    label: t('nav.howItWorks'),
                    pagePath: pathname,
                    section: 'navbar_mobile'
                  });
                }}
                className="flex items-center justify-between px-4 py-4 text-gray-900 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100"
              >
                <span className="text-base font-medium">{t('nav.howItWorks')}</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href={isServicePage() ? '#faq' : getLocalizedPath('/#faq')}
                onClick={(e) => {
                  e.preventDefault();
                  closeMenu();
                  setTimeout(() => scrollToSection('faq'), 300);
                  loadAnalytics();
                  safeTrack(trackNavigationClick, t('nav.faq'), '#faq', {
                    label: t('nav.faq'),
                    pagePath: pathname,
                    section: 'navbar_mobile'
                  });
                }}
                className="flex items-center justify-between px-4 py-4 text-gray-900 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100"
              >
                <span className="text-base font-medium">{t('nav.faq')}</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Sélecteurs Langue et Devise */}
            <div className="flex items-center gap-3 mt-6 px-4">
              <div className="flex-1 border border-gray-300 rounded-lg bg-white h-12 flex items-center">
                <LanguageSelector />
              </div>
              <div className="flex-1 border border-gray-300 rounded-lg bg-white h-12 flex items-center">
                <CurrencySelector />
              </div>
            </div>

            {/* Liens Contact et Connexion */}
            <div className="mt-6 space-y-2 px-4">
              <a
                href={getLocalizedPath('/#contact')}
                onClick={(e) => {
                  e.preventDefault();
                  closeMenu();
                  const localizedPath = getLocalizedPath('/#contact');
                  window.history.pushState(null, '', localizedPath);
                  setTimeout(() => {
                    const element = document.getElementById('contact');
                    if (element) {
                      requestAnimationFrame(() => {
                        const offset = 100;
                        const elementPosition = element.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.scrollY - offset;
                        window.scrollTo({
                          top: offsetPosition,
                          behavior: 'smooth'
                        });
                      });
                    }
                  }, 300);
                  loadAnalytics();
                  safeTrack(trackNavigationClick, t('common.contactUs'), localizedPath, {
                    label: t('common.contactUs'),
                    pagePath: pathname,
                    section: 'navbar_mobile'
                  });
                }}
                className="block text-base font-medium text-gray-900 hover:text-gray-600 transition-colors duration-200 py-2"
              >
                {t('common.contactUs')}
              </a>
              <a
                href="https://app.mynotary.io/login"
                onClick={() => {
                  loadAnalytics();
                  safeTrack(trackLoginClick, 'navbar_mobile', {
                    linkText: t('nav.login'),
                    pagePath: pathname,
                    destination: 'https://app.mynotary.io/login'
                  });
                  closeMenu();
                }}
                className="block text-base font-medium text-gray-900 hover:text-gray-600 transition-colors duration-200 py-2"
              >
                {t('nav.login')}
              </a>
            </div>
          </div>

          {/* CTA en bas */}
          <div 
            className={`px-6 pb-6 pt-4 border-t border-gray-200 transition-all duration-300 ${
              isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ 
              transitionDelay: isMenuOpen ? '0.2s' : '0s',
              transitionProperty: 'opacity, transform',
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <a
              href={getFormUrl(currency, currentServiceId)}
              onClick={() => {
                loadAnalytics();
                safeTrack(trackCTAClick, 'navbar_mobile', currentServiceId, pathname, {
                  ctaText: ctaText || t('nav.notarizeNow'),
                  destination: getFormUrl(currency, currentServiceId),
                  elementId: 'navbar_mobile_cta'
                });
                // Track GTM event (uniquement sur pages non-services)
                trackCTAToForm('navbar_mobile', pathname, ctaText || t('nav.notarizeNow'), getFormUrl(currency, currentServiceId), 'navbar_mobile_cta', currentServiceId, currency);
                // Track GTM event (uniquement sur pages services)
                trackCTAToFormOnService('navbar_mobile', pathname, ctaText || t('nav.notarizeNow'), getFormUrl(currency, currentServiceId), 'navbar_mobile_cta', currentServiceId, currency);
                closeMenu();
              }}
              className="block w-full text-center glassy-cta-blue text-base font-bold rounded-xl py-4 px-6"
            >
              <span className="btn-text inline-flex items-center justify-center gap-2 whitespace-nowrap">
                <IconOpenNewLarge />
                <span>{ctaText || t('nav.notarizeNow')}</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
