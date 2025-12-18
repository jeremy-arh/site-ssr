'use client'

import { useState, useEffect, useCallback, memo } from 'react';
import { usePathname } from 'next/navigation';
import { useCurrency } from '../contexts/CurrencyContext';
import CurrencySelector from './CurrencySelector';
import LanguageSelector from './LanguageSelector';
import { getFormUrl } from '../utils/formUrl';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import { formatServiceForLanguage, getServiceFields } from '../utils/services';
import { removeLanguageFromPath, SUPPORTED_LANGUAGES } from '../utils/language';
import { getSupabase } from '../lib/supabase';

// ANALYTICS DIFFÉRÉS - Uniquement Plausible
let trackPlausibleCTAClick = null;
let trackPlausibleLoginClick = null;
let trackPlausibleNavigationClick = null;

// Charger Plausible de manière non-bloquante
const loadAnalytics = () => {
  if (trackPlausibleCTAClick) return;
  import('../utils/plausible').then((plausible) => {
    trackPlausibleCTAClick = plausible.trackCTAClick;
    trackPlausibleLoginClick = plausible.trackLoginClick;
    trackPlausibleNavigationClick = plausible.trackNavigationClick;
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
      const navbarHeight = cachedWindowWidth < 768 ? 70 : 90;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: 'smooth'
      });
    });
  }
};

// Cacher les dimensions pour éviter les forced layouts répétés
let cachedWindowWidth = typeof window !== 'undefined' ? 0 : 1200; // Valeur par défaut SSR-safe
let cachedScrollY = 0;
let dimensionsCached = false;

// Initialiser les dimensions de façon différée pour ne pas bloquer le rendu initial
if (typeof window !== 'undefined') {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      cachedWindowWidth = window.innerWidth;
      cachedScrollY = window.scrollY;
      dimensionsCached = true;
    }, { timeout: 100 });
  } else {
    setTimeout(() => {
      cachedWindowWidth = window.innerWidth;
      cachedScrollY = window.scrollY;
      dimensionsCached = true;
    }, 50);
  }
}

const Navbar = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [_isScrolled, setIsScrolled] = useState(false);
  // Utiliser une valeur par défaut qui ne cause pas de flash (assume desktop)
  const [isMobile, setIsMobile] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isHeroOutOfView, setIsHeroOutOfView] = useState(false);
  const [ctaText, setCtaText] = useState('');
  const [servicePrice, setServicePrice] = useState(null);
  const [_formattedPrice, setFormattedPrice] = useState('');
  const [currentServiceId, setCurrentServiceId] = useState(null);
  const pathname = usePathname();
  const { formatPrice, currency } = useCurrency();
  const { t } = useTranslation();
  const { language, getLocalizedPath } = useLanguage();
  
  // Initialiser les états depuis le cache une seule fois au montage
  useEffect(() => {
    if (dimensionsCached) {
      setIsMobile(cachedWindowWidth < 1150);
      setIsAtTop(cachedScrollY === 0);
    } else {
      // Fallback si le cache n'est pas encore prêt
      const checkDimensions = () => {
        cachedWindowWidth = window.innerWidth;
        cachedScrollY = window.scrollY;
        dimensionsCached = true;
        setIsMobile(cachedWindowWidth < 1150);
        setIsAtTop(cachedScrollY === 0);
      };
      if ('requestIdleCallback' in window) {
        requestIdleCallback(checkDimensions, { timeout: 100 });
      } else {
        setTimeout(checkDimensions, 50);
      }
    }
  }, []);
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

    // Utiliser la valeur cachée de la largeur pour éviter un reflow
    if (cachedWindowWidth < 1150) {
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

  const handleResize = useCallback(() => {
    // Mettre à jour le cache et l'état
    cachedWindowWidth = window.innerWidth;
    setIsMobile(cachedWindowWidth < 1150);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Observer pour détecter quand le hero sort complètement de l'écran
  useEffect(() => {
    setIsHeroOutOfView(false);

    let observer = null;
    let retryTimeout = null;
    const maxAttempts = 15;
    let attempts = 0;

    const attachObserver = () => {
      const heroElement = document.querySelector('[data-hero]');

      if (heroElement) {
        observer = new IntersectionObserver(
          ([entry]) => {
            setIsHeroOutOfView(!entry.isIntersecting);
          },
          {
            threshold: 0,
            rootMargin: '0px'
          }
        );

        observer.observe(heroElement);
        return;
      }

      attempts += 1;
      if (attempts < maxAttempts) {
        retryTimeout = setTimeout(attachObserver, 150);
      } else {
        // Si après plusieurs tentatives aucun hero n'existe, on force le CTA en bleu
        setIsHeroOutOfView(true);
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

  useEffect(() => {
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

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

  // Fetch CTA from blog post or service detail page based on pathname
  useEffect(() => {
    const fetchBlogCTA = async () => {
      const path = pathname || '';
      const supabase = await getSupabase();

      // Blog post detail
      const blogMatch = path.match(/^\/blog\/([^/]+)/);
      if (blogMatch && blogMatch[1]) {
        const slug = decodeURIComponent(blogMatch[1]);
        setCurrentServiceId(null); // Reset serviceId on blog pages
        try {
          const { data, error } = await supabase
            .from('blog_posts')
            .select('cta')
            .eq('slug', slug)
            .eq('status', 'published')
            .single();

          if (!error && data?.cta) {
            setCtaText(data.cta);
          } else {
            setCtaText('');
          }
        } catch (error) {
          console.error('Error fetching blog CTA:', error);
          setCtaText('');
        }
      } else {
        // Service detail (with or without language prefix)
        const pathWithoutLang = removeLanguageFromPath(path);
        const serviceMatch = pathWithoutLang.match(/^\/services\/([^/]+)/);
        if (serviceMatch && serviceMatch[1]) {
          const serviceId = decodeURIComponent(serviceMatch[1]);
          setCurrentServiceId(serviceId); // Set serviceId for service pages
          try {
            const { data, error } = await supabase
              .from('services')
              .select(getServiceFields())
              .eq('service_id', serviceId)
              .single();

            if (!error && data) {
              // Formater le service selon la langue actuelle
              const formattedService = formatServiceForLanguage(data, language);
              setCtaText(formattedService.cta || '');
              // Set price only if it exists and is not empty/null
              const price = formattedService.base_price;
              setServicePrice(price != null && price !== '' && price !== undefined ? price : null);
            } else {
              setCtaText('');
              setServicePrice(null);
            }
          } catch (error) {
            console.error('Error fetching service CTA:', error);
            setCtaText('');
            setServicePrice(null);
          }
        } else {
          // Reset to default if not on blog/service detail page
          setCtaText('');
          setServicePrice(null);
          setCurrentServiceId(null); // Reset serviceId on other pages
        }
      }
    };

    fetchBlogCTA();
  }, [pathname, language]);

  useEffect(() => {
    if (servicePrice) {
      formatPrice(servicePrice).then(setFormattedPrice);
    } else {
      setFormattedPrice('');
    }
  }, [servicePrice, formatPrice]);

  return (
    <>
      <nav className={`fixed w-full top-0 z-50 overflow-visible ${!isMobile && isAtTop && isOnServicePage ? '' : 'shadow-sm'} ${isMobile ? 'transition-transform duration-300 px-[10px] pt-[10px]' : 'px-0 pt-0'} ${
        !isHeaderVisible && !isMenuOpen ? '-translate-y-full' : 'translate-y-0'
      }`}>
        <div
          className={`${isMobile ? 'transition-all duration-300' : 'transition-all duration-300'} ${isMobile ? 'rounded-2xl' : 'rounded-none'} overflow-visible`}
          style={isMobile ? (isMenuOpen ? {
            background: 'transparent',
            borderRadius: '16px',
            boxShadow: 'none',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
          } : {
            background: 'rgba(0, 0, 0, 0.26)',
            borderRadius: '16px',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(15.6px)',
            WebkitBackdropFilter: 'blur(15.6px)',
          }) : (!isMobile && isAtTop && isOnServicePage ? {
            background: 'transparent',
          } : {
            background: '#FEFEFE',
          })}
        >
          <div className={`max-w-[1300px] mx-auto overflow-visible ${isMobile ? 'px-[20px]' : 'px-[30px]'}`}>
            <div 
              className={`flex items-center justify-between overflow-visible ${isMobile ? 'h-14' : 'h-20'}`}
            >
            {/* Logo */}
            <a href="/" className="flex-shrink-0 relative z-[60]">
              <img
                src={
                  isMobile && !isMenuOpen 
                    ? '/images/logo.svg'
                    : (!isMobile && isAtTop && isOnServicePage)
                      ? '/images/logo.svg'
                      : '/images/logo-dark.svg'
                }
                alt="Logo"
                width="130"
                height="32"
                className={`${isMobile ? 'h-6' : 'h-8'} w-auto`}
              />
            </a>

            {/* Desktop Navigation + CTA - Right aligned */}
            <div 
              className={`${isMobile ? 'hidden' : 'flex'} items-center gap-8 flex-shrink-0 overflow-visible`}
              style={{ marginLeft: 'auto' }}
            >
              <a 
                href={isServicePage() ? '#other-services' : getLocalizedPath('/#services')} 
                className={`nav-link text-base whitespace-nowrap ${!isMobile && isAtTop && isOnServicePage ? 'text-white hover:text-white hover:underline' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  const sectionId = isServicePage() ? 'other-services' : 'services';
                  scrollToSection(sectionId);
                  loadAnalytics();
                  safeTrack(trackPlausibleNavigationClick, t('nav.services'), `#${sectionId}`, {
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
                className={`nav-link text-base whitespace-nowrap ${!isMobile && isAtTop && isOnServicePage ? 'text-white hover:text-white hover:underline' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('how-it-works');
                  loadAnalytics();
                  safeTrack(trackPlausibleNavigationClick, t('nav.howItWorks'), '#how-it-works', {
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
                className={`nav-link text-base whitespace-nowrap ${!isMobile && isAtTop && isOnServicePage ? 'text-white hover:text-white hover:underline' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('faq');
                  loadAnalytics();
                  safeTrack(trackPlausibleNavigationClick, t('nav.faq'), '#faq', {
                    label: t('nav.faq'),
                    pagePath: pathname,
                    section: 'navbar_desktop'
                  });
                }}
              >
                {t('nav.faq')}
              </a>

              <div className={`w-px h-6 flex-shrink-0 ${!isMobile && isAtTop && isOnServicePage ? 'bg-white/30' : 'bg-gray-300'}`}></div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <LanguageSelector isWhite={!isMobile && isAtTop && isOnServicePage} />
                <CurrencySelector isWhite={!isMobile && isAtTop && isOnServicePage} />
              </div>

              <a 
                href="https://app.mynotary.io/login" 
                className={`nav-link text-base font-semibold whitespace-nowrap flex-shrink-0 ${!isMobile && isAtTop && isOnServicePage ? 'text-white hover:text-white hover:underline' : ''}`}
                onClick={() => {
                  loadAnalytics();
                  safeTrack(trackPlausibleLoginClick, 'navbar_desktop', {
                    linkText: t('nav.login'),
                    pagePath: pathname,
                    destination: 'https://app.mynotary.io/login'
                  });
                }}
              >
                {t('nav.login')}
              </a>

              {/* CTA Button */}
              {(!isMobile && isAtTop && isOnServicePage) ? null : (
              <a 
                href={getFormUrl(currency, currentServiceId)} 
                className={`${isHeroOutOfView ? 'glassy-cta-blue' : 'glassy-cta'} text-sm relative z-10 flex-shrink-0 whitespace-nowrap px-6 py-3 font-semibold rounded-lg transition-all duration-300`}
                onClick={() => {
                  loadAnalytics();
                  safeTrack(trackPlausibleCTAClick, 'navbar_desktop', currentServiceId, pathname, {
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
              )}
            </div>

            {/* Animated Hamburger Menu Button */}
            <button
              onClick={toggleMenu}
              className={`${isMobile ? '' : 'hidden'} relative z-[60] w-10 h-10 flex flex-col items-center justify-center focus:outline-none overflow-visible`}
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
        className={`${isMobile ? '' : 'hidden'} fixed inset-0 z-40 bg-white transition-all duration-500 ease-in-out ${
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
                safeTrack(trackPlausibleNavigationClick, t('nav.services'), `#${sectionId}`, {
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
                safeTrack(trackPlausibleNavigationClick, t('nav.howItWorks'), '#how-it-works', {
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
                safeTrack(trackPlausibleNavigationClick, t('nav.faq'), '#faq', {
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
                  safeTrack(trackPlausibleNavigationClick, t('common.contactUs'), localizedPath, {
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
                  safeTrack(trackPlausibleLoginClick, 'navbar_mobile', {
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
                  safeTrack(trackPlausibleCTAClick, 'navbar_mobile', currentServiceId, pathname, {
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
