'use client'

import { useState, useEffect, useCallback, memo } from 'react';
import { usePathname } from 'next/navigation';
import { useCurrency } from '../contexts/CurrencyContext';
import CurrencySelector from './CurrencySelector';
import LanguageSelector from './LanguageSelector';
import { getFormUrl } from '../utils/formUrl';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import { formatServiceForLanguage } from '../utils/services';
import { removeLanguageFromPath, SUPPORTED_LANGUAGES } from '../utils/language';
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
  <svg className="w-4 h-4 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zm-2 16H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7h-7z"/>
  </svg>
));
const IconOpenNewLarge = memo(() => (
  <svg className="w-5 h-5 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zm-2 16H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7h-7z"/>
  </svg>
));

// Helper function pour scroll vers une section
// Optimisé pour utiliser requestAnimationFrame et éviter les forced layouts
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    // Utiliser requestAnimationFrame pour grouper les lectures de layout
    requestAnimationFrame(() => {
      const navbarHeight = typeof window !== 'undefined' && window.innerWidth < 768 ? 70 : 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: 'smooth'
      });
    });
  }
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
  const [isAtTop, setIsAtTop] = useState(true); // Commencer à true pour l'effet initial
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
  
  // Vérifier si on est sur une page service
  const isOnServicePage = isServicePage();

  const handleScroll = useCallback(() => {
    // Utiliser le cache pour éviter les forced layouts
    const currentScrollY = window.scrollY;
    cachedScrollY = currentScrollY; // Mettre à jour le cache
    
    setIsScrolled(currentScrollY > 50);
    setIsAtTop(currentScrollY === 0);

    // Détecter mobile uniquement pour le scroll behavior (CSS gère le reste)
    if (typeof window !== 'undefined' && window.innerWidth < 1150) {
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsHeaderVisible(false);
      } else {
        // Scrolling up
        setIsHeaderVisible(true);
      }
    } else {
      setIsHeaderVisible(true);
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
  const isTransparentHeader = isOnServicePage && isAtTop;
  
  return (
    <>
      <nav className="navbar-container">
        <div className={`navbar-inner ${isMenuOpen ? 'navbar-inner-menu-open' : ''} ${isTransparentHeader ? 'navbar-inner-transparent' : ''}`}>
          <div className="max-w-[1300px] mx-auto w-full px-[20px] md:px-[20px] lg:px-[30px]">
            <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <a href="/" className="flex-shrink-0 relative z-[60]">
              {/* Logo Mobile - noir si menu ouvert (fond blanc), blanc sinon */}
              <img
                src={isMenuOpen 
                  ? "https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/e4a88604-ba5d-44a5-5fe8-a0a26c632d00/q=10"
                  : "https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/b9d9d28f-0618-4a93-9210-8d9d18c3d200/q=10"
                }
                alt="Logo"
                width="130"
                height="32"
                className="h-6 md:hidden w-auto"
                loading="eager"
                decoding="async"
              />
              {/* Logo Desktop - blanc si transparent, noir sinon */}
              <img
                src={isTransparentHeader 
                  ? "https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/b9d9d28f-0618-4a93-9210-8d9d18c3d200/q=10"
                  : "https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/e4a88604-ba5d-44a5-5fe8-a0a26c632d00/q=10"
                }
                alt="Logo"
                width="130"
                height="32"
                className="hidden md:block h-8 w-auto"
                loading="eager"
                decoding="async"
              />
            </a>

            {/* Desktop Navigation + CTA - Right aligned */}
            <div 
              className="navbar-desktop hidden md:flex items-center gap-3 lg:gap-6 xl:gap-8 flex-shrink-0 overflow-visible"
              style={{ marginLeft: 'auto' }}
            >
              <a 
                href={isServicePage() ? '#other-services' : getLocalizedPath('/#services')} 
                className={`nav-link text-sm lg:text-base whitespace-nowrap ${isTransparentHeader ? 'text-white hover:text-white/80' : ''}`}
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
                className={`nav-link text-sm lg:text-base whitespace-nowrap ${isTransparentHeader ? 'text-white hover:text-white/80' : ''}`}
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
                className={`nav-link text-sm lg:text-base whitespace-nowrap ${isTransparentHeader ? 'text-white hover:text-white/80' : ''}`}
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

              <div className={`w-px h-6 flex-shrink-0 ${isTransparentHeader ? 'bg-white/30' : 'bg-gray-300'}`}></div>

              <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
                <LanguageSelector isWhite={isTransparentHeader} />
                <CurrencySelector isWhite={isTransparentHeader} />
              </div>

              <a 
                href="https://app.mynotary.io/login" 
                className={`nav-link text-sm lg:text-base font-semibold whitespace-nowrap flex-shrink-0 ${isTransparentHeader ? 'text-white hover:text-white/80' : ''}`}
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
                className={`${isHeroCTAOutOfView ? 'glassy-cta-blue' : 'glassy-cta'} text-xs lg:text-sm relative z-10 flex-shrink-0 whitespace-nowrap px-4 lg:px-6 py-2 lg:py-3 font-semibold rounded-lg transition-all duration-300`}
                onClick={() => {
                  loadAnalytics();
                  safeTrack(trackCTAClick, 'navbar_desktop', currentServiceId, pathname, {
                    ctaText: ctaText || t('nav.notarizeNow'),
                    destination: getFormUrl(currency, currentServiceId),
                    elementId: 'navbar_desktop_cta'
                  });
                }}
              >
                <span className="btn-text inline-block inline-flex items-center gap-2 whitespace-nowrap">
                  <IconOpenNew />
                  <span className="whitespace-nowrap">{ctaText || t('nav.notarizeNow')}</span>
                </span>
              </a>
            </div>

            {/* Animated Hamburger Menu Button - MOBILE ONLY (hidden on md+) */}
            <button
              onClick={toggleMenu}
              className="navbar-burger flex md:hidden relative z-[60] w-10 h-10 flex-col items-center justify-center focus:outline-none overflow-visible"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center relative">
                <span
                  className={`w-full h-0.5 rounded-full transition-all duration-300 origin-center absolute ${
                    isMenuOpen ? 'rotate-45 bg-gray-900' : 'bg-white top-0'
                  }`}
                ></span>
                <span
                  className={`w-full h-0.5 rounded-full transition-all duration-300 absolute ${
                    isMenuOpen ? 'opacity-0 scale-0 bg-gray-900' : 'opacity-100 scale-100 bg-white top-1/2 -translate-y-1/2'
                  }`}
                ></span>
                <span
                  className={`w-full h-0.5 rounded-full transition-all duration-300 origin-center absolute ${
                    isMenuOpen ? '-rotate-45 bg-gray-900' : 'bg-white bottom-0'
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
        </div>
      </nav>

      {/* Fullscreen Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-white transition-all duration-500 ease-in-out ${
          isMenuOpen
            ? 'opacity-100 visible'
            : 'opacity-0 invisible'
        }`}
      >
        <div className="h-full flex flex-col justify-center items-start px-8 pt-24 pb-12">
          <div className="w-full max-w-md space-y-4">
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
              className="block text-lg font-semibold text-gray-900 hover:text-gray-600 transition-colors duration-200 py-2 whitespace-nowrap"
            >
              {t('nav.services')}
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
              className="block text-lg font-semibold text-gray-900 hover:text-gray-600 transition-colors duration-200 py-2 whitespace-nowrap"
            >
              {t('nav.howItWorks')}
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
              className="block text-lg font-semibold text-gray-900 hover:text-gray-600 transition-colors duration-200 py-2 whitespace-nowrap"
            >
              {t('nav.faq')}
            </a>

            <div className="border-t border-gray-200 my-4"></div>

            <div className="flex items-center gap-3 py-2 whitespace-nowrap">
              <LanguageSelector />
              <div className="w-px h-6 bg-gray-300"></div>
              <CurrencySelector />
            </div>

            <div className="flex items-center gap-3 py-2 whitespace-nowrap">
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
                      // Grouper les lectures de layout dans un requestAnimationFrame
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
                className="nav-link text-lg font-semibold text-gray-900 hover:text-gray-600 transition-colors duration-200 whitespace-nowrap"
              >
                {t('common.contactUs')}
              </a>
              <div className="w-px h-6 bg-gray-300"></div>
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
                className="nav-link text-lg font-semibold text-gray-900 hover:text-gray-600 transition-colors duration-200 whitespace-nowrap"
              >
                {t('nav.login')}
              </a>
            </div>
            <div className="w-full mt-8">
              <a
                href={getFormUrl(currency, currentServiceId)}
                onClick={() => {
                  loadAnalytics();
                  safeTrack(trackCTAClick, 'navbar_mobile', currentServiceId, pathname, {
                    ctaText: ctaText || t('nav.notarizeNow'),
                    destination: getFormUrl(currency, currentServiceId),
                    elementId: 'navbar_mobile_cta'
                  });
                  closeMenu();
                }}
                className="block w-full text-center glassy-cta primary-cta text-lg py-4"
              >
                <span className="btn-text inline-flex items-center justify-center gap-2 whitespace-nowrap">
                  <IconOpenNewLarge />
                  <span className="whitespace-nowrap">{ctaText || t('nav.notarizeNow')}</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
