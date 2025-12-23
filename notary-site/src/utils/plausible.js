/**
 * Plausible Analytics - Direct Integration
 * ULTRA OPTIMISÉ - Ne bloque JAMAIS le rendu
 */

/**
 * Check if Plausible is loaded
 * @returns {boolean}
 */
const isPlausibleLoaded = () => {
  const isLoaded = typeof window !== 'undefined' && typeof window.plausible === 'function';
  
  // Log détaillé pour le débogage
  if (typeof window !== 'undefined') {
    console.log('[Plausible] Vérification du chargement:', {
      windowExists: typeof window !== 'undefined',
      plausibleExists: typeof window.plausible !== 'undefined',
      plausibleIsFunction: typeof window.plausible === 'function',
      isLoaded: isLoaded,
      scriptLoaded: document.querySelector('script[src*="plausible.io"]') !== null
    });
  }
  
  return isLoaded;
};

// Small helper to avoid sending empty strings
const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') return undefined;
  const trimmed = text.trim();
  return trimmed.length ? trimmed : undefined;
};

/**
 * Wait for Plausible to be ready
 * Attend jusqu'à 5 secondes pour que Plausible se charge
 * @returns {Promise} Promise that resolves when Plausible is loaded or timeout
 */
const waitForPlausible = () => {
  return new Promise((resolve) => {
    // Si déjà chargé, résoudre immédiatement
    if (isPlausibleLoaded()) {
      console.log('[Plausible] ✅ Déjà chargé, résolution immédiate');
      resolve();
      return;
    }
    
    console.log('[Plausible] ⏳ Attente du chargement de Plausible...');
    
    const maxWait = 5000; // 5 secondes max
    const startTime = Date.now();
    const checkInterval = 100; // Vérifier toutes les 100ms
    
    const checkPlausible = setInterval(() => {
      if (isPlausibleLoaded()) {
        console.log('[Plausible] ✅ Plausible chargé après', Date.now() - startTime, 'ms');
        clearInterval(checkPlausible);
        resolve();
      } else if (Date.now() - startTime >= maxWait) {
        console.warn('[Plausible] ⚠️ Timeout: Plausible non chargé après', maxWait, 'ms');
        clearInterval(checkPlausible);
        resolve(); // Résoudre quand même pour ne pas bloquer
      }
    }, checkInterval);
  });
};

/**
 * Track a Plausible pageview
 * @param {string} pageName - Page name (optional)
 * @param {string} pagePath - Page path (optional, defaults to current path)
 */
// eslint-disable-next-line no-unused-vars
export const trackPageView = async (_pageName = null, pagePath = null) => {
  console.log('[Plausible] trackPageView appelé', { pageName: _pageName, pagePath });
  
  await waitForPlausible();
  
  if (!isPlausibleLoaded()) {
    console.warn('[Plausible] ⚠️ Plausible non chargé, pageview ignoré');
    console.warn('[Plausible] Détails:', {
      windowExists: typeof window !== 'undefined',
      plausibleExists: typeof window !== 'undefined' && typeof window.plausible !== 'undefined',
      plausibleType: typeof window !== 'undefined' ? typeof window.plausible : 'N/A',
      scriptTag: typeof document !== 'undefined' ? document.querySelector('script[src*="plausible.io"]') : null
    });
    return;
  }

  // For SPA with React Router, we need to pass the URL explicitly
  // because React Router changes the URL without a page reload
  const path = pagePath || (typeof window !== 'undefined' ? window.location.pathname : '/');
  const fullUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${path}${window.location.search}${window.location.hash}`
    : path;
  
  console.log('[Plausible] ✅ Envoi pageview:', fullUrl);
  
  try {
    // Trigger pageview with explicit URL for SPA
    window.plausible('pageview', {
      u: fullUrl
    });
    console.log('[Plausible] ✅ Pageview envoyé avec succès');
  } catch (error) {
    console.error('[Plausible] ❌ Erreur lors de l\'envoi du pageview:', error);
  }
};

/**
 * Track a custom Plausible event
 * @param {string} eventName - Event name
 * @param {object} props - Event properties (optional)
 */
export const trackEvent = async (eventName, props = {}) => {
  console.log('[Plausible] trackEvent appelé', { eventName, props });
  
  await waitForPlausible();
  
  if (!isPlausibleLoaded()) {
    console.warn('[Plausible] ⚠️ Plausible non chargé, événement ignoré:', eventName);
    console.warn('[Plausible] Détails:', {
      windowExists: typeof window !== 'undefined',
      plausibleExists: typeof window !== 'undefined' && typeof window.plausible !== 'undefined',
      plausibleType: typeof window !== 'undefined' ? typeof window.plausible : 'N/A',
      scriptTag: typeof document !== 'undefined' ? document.querySelector('script[src*="plausible.io"]') : null
    });
    return;
  }

  const eventProps = {
    ...props,
    page: typeof window !== 'undefined' ? window.location.pathname : '/'
  };
  
  console.log('[Plausible] ✅ Envoi événement:', eventName, eventProps);
  
  try {
    window.plausible(eventName, {
      props: eventProps
    });
    console.log('[Plausible] ✅ Événement envoyé avec succès:', eventName);
  } catch (error) {
    console.error('[Plausible] ❌ Erreur lors de l\'envoi de l\'événement:', eventName, error);
  }
};

/**
 * Track CTA click (Book an appointment)
 * @param {string} location - Where the CTA was clicked (hero, navbar, mobile, etc.)
 * @param {string} serviceId - Service ID (optional)
 * @param {string} pagePath - Page path (optional)
 */
export const trackCTAClick = (location, serviceId = null, pagePath = null, metadata = {}) => {
  const {
    ctaText,
    destination,
    label,
    elementId,
    ctaType = 'book_appointment',
  } = metadata || {};

  trackEvent('cta_click', {
    cta_type: ctaType,
    cta_location: location,
    cta_label: sanitizeText(label) || sanitizeText(ctaText) || location,
    cta_text: sanitizeText(ctaText),
    cta_destination: destination || 'form',
    element_id: elementId || undefined,
    service_id: serviceId || undefined,
    page_path: pagePath || undefined
  }).catch(err => {
    // eslint-disable-next-line no-undef
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.error('Plausible trackCTAClick error:', err);
    }
  });
};

/**
 * Track service click
 * @param {string} serviceId - Service ID
 * @param {string} serviceName - Service name
 * @param {string} location - Where the service was clicked (homepage, services page, etc.)
 */
export const trackServiceClick = (serviceId, serviceName, location) => {
  trackEvent('service_click', {
    service_id: serviceId,
    service_name: serviceName,
    click_location: location
  }).catch(err => {
    // eslint-disable-next-line no-undef
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.error('Plausible trackServiceClick error:', err);
    }
  });
};

/**
 * Track login click
 * @param {string} location - Where the login link was clicked
 */
export const trackLoginClick = (location, metadata = {}) => {
  const { linkText, destination, pagePath } = metadata || {};

  trackEvent('login_click', {
    click_location: location,
    link_text: sanitizeText(linkText),
    destination: destination || 'https://app.mynotary.io/login',
    page_path: pagePath || undefined
  }).catch(err => {
    // eslint-disable-next-line no-undef
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.error('Plausible trackLoginClick error:', err);
    }
  });
};

/**
 * Track navigation click
 * @param {string} linkText - Text of the navigation link
 * @param {string} destination - Destination URL or anchor
 */
export const trackNavigationClick = (linkText, destination, metadata = {}) => {
  const { label, pagePath, section } = metadata || {};

  trackEvent('navigation_click', {
    link_text: sanitizeText(linkText),
    link_label: sanitizeText(label) || sanitizeText(linkText),
    destination: destination,
    page_path: pagePath || undefined,
    nav_section: section || undefined,
  }).catch(err => {
    // eslint-disable-next-line no-undef
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.error('Plausible trackNavigationClick error:', err);
    }
  });
};

/**
 * Track blog post view
 * @param {string} postSlug - Blog post slug
 * @param {string} postTitle - Blog post title
 */
export const trackBlogPostView = (postSlug, postTitle) => {
  trackEvent('blog_post_view', {
    post_slug: postSlug,
    post_title: postTitle
  }).catch(err => {
    // eslint-disable-next-line no-undef
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.error('Plausible trackBlogPostView error:', err);
    }
  });
};

/**
 * Initialize Plausible tracking
 * This will send the initial pageview
 */
export const initPlausible = () => {
  console.log('[Plausible] initPlausible appelé');
  
  if (typeof window !== 'undefined') {
    console.log('[Plausible] Vérification de l\'état initial:', {
      windowExists: true,
      plausibleExists: typeof window.plausible !== 'undefined',
      plausibleIsFunction: typeof window.plausible === 'function',
      scriptTag: document.querySelector('script[src*="plausible.io"]') !== null,
      dataDomain: document.querySelector('script[data-domain]')?.getAttribute('data-domain') || null
    });
    
    // Send initial pageview
    trackPageView().catch(err => {
      console.error('[Plausible] ❌ Erreur dans initPlausible:', err);
    });
  } else {
    console.warn('[Plausible] ⚠️ window n\'est pas disponible dans initPlausible');
  }
};
