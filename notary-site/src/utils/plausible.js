/**
 * Plausible Analytics - Direct Integration
 * ULTRA OPTIMISÉ - Ne bloque JAMAIS le rendu
 */

/**
 * Check if Plausible is loaded
 * @returns {boolean}
 */
const isPlausibleLoaded = () => {
  return typeof window !== 'undefined' && typeof window.plausible === 'function';
};

// Small helper to avoid sending empty strings
const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') return undefined;
  const trimmed = text.trim();
  return trimmed.length ? trimmed : undefined;
};

/**
 * Wait for Plausible to be ready - RÉSOUT IMMÉDIATEMENT si pas chargé
 * Ne bloque JAMAIS - si Plausible n'est pas là, on abandonne silencieusement
 * @returns {Promise} Promise that resolves immediately
 */
const waitForPlausible = () => {
  return new Promise((resolve) => {
    // Résoudre immédiatement - ne jamais attendre
    resolve();
  });
};

/**
 * Track a Plausible pageview
 * @param {string} pageName - Page name (optional)
 * @param {string} pagePath - Page path (optional, defaults to current path)
 */
// eslint-disable-next-line no-unused-vars
export const trackPageView = async (_pageName = null, pagePath = null) => {
  await waitForPlausible();
  
  if (!isPlausibleLoaded()) {
    // eslint-disable-next-line no-undef
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.warn('Plausible not loaded, skipping pageview');
    }
    return;
  }

  // For SPA with React Router, we need to pass the URL explicitly
  // because React Router changes the URL without a page reload
  const path = pagePath || (typeof window !== 'undefined' ? window.location.pathname : '/');
  const fullUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${path}${window.location.search}${window.location.hash}`
    : path;
  
  // Trigger pageview with explicit URL for SPA
  window.plausible('pageview', {
    u: fullUrl
  });
  
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('Plausible pageview tracked:', fullUrl);
  }
};

/**
 * Track a custom Plausible event
 * @param {string} eventName - Event name
 * @param {object} props - Event properties (optional)
 */
export const trackEvent = async (eventName, props = {}) => {
  await waitForPlausible();
  
  if (!isPlausibleLoaded()) {
    // eslint-disable-next-line no-undef
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.warn('Plausible not loaded, skipping event:', eventName);
    }
    return;
  }

  window.plausible(eventName, {
    props: {
      ...props,
      page: typeof window !== 'undefined' ? window.location.pathname : '/'
    }
  });
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
  if (typeof window !== 'undefined') {
    // Send initial pageview
    trackPageView().catch(err => {
      // eslint-disable-next-line no-undef
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.error('Plausible initPlausible error:', err);
      }
    });
  }
};
