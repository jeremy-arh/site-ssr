/**
 * Segment Analytics - Même événements que Plausible mais avec noms GA4 standards
 * Les événements standards GA4 sont mappés correctement, les custom events restent tels quels
 */

/**
 * Check if Segment Analytics is loaded
 * @returns {boolean}
 */
const isSegmentLoaded = () => {
  const isLoaded = typeof window !== 'undefined' && 
                   window.analytics && 
                   typeof window.analytics.track === 'function';
  
  if (typeof window !== 'undefined') {
    console.log('[Segment] Vérification du chargement:', {
      windowExists: typeof window !== 'undefined',
      analyticsExists: typeof window.analytics !== 'undefined',
      analyticsTrackIsFunction: window.analytics && typeof window.analytics.track === 'function',
      isLoaded: isLoaded,
      initialized: window.analytics?.initialized || false
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
 * Wait for Segment to be ready
 * Attend jusqu'à 5 secondes pour que Segment se charge
 * @returns {Promise} Promise that resolves when Segment is loaded or timeout
 */
const waitForSegment = () => {
  return new Promise((resolve) => {
    // Si déjà chargé et initialisé, résoudre immédiatement
    if (isSegmentLoaded() && window.analytics.initialized) {
      console.log('[Segment] ✅ Déjà chargé et initialisé, résolution immédiate');
      resolve();
      return;
    }
    
    console.log('[Segment] ⏳ Attente du chargement de Segment...');
    
    const maxWait = 5000; // 5 secondes max
    const startTime = Date.now();
    const checkInterval = 100; // Vérifier toutes les 100ms
    
    const checkSegment = setInterval(() => {
      if (isSegmentLoaded() && window.analytics.initialized) {
        console.log('[Segment] ✅ Segment chargé après', Date.now() - startTime, 'ms');
        clearInterval(checkSegment);
        resolve();
      } else if (Date.now() - startTime >= maxWait) {
        console.warn('[Segment] ⚠️ Timeout: Segment non chargé après', maxWait, 'ms');
        clearInterval(checkSegment);
        resolve(); // Résoudre quand même pour ne pas bloquer
      }
    }, checkInterval);
  });
};

/**
 * Track a Segment event (generic)
 * @param {string} eventName - Event name (GA4 standard or custom)
 * @param {object} properties - Event properties
 */
export const trackEvent = async (eventName, properties = {}) => {
  console.log('[Segment] trackEvent appelé', { eventName, properties });
  
  await waitForSegment();
  
  if (!isSegmentLoaded()) {
    console.warn('[Segment] ⚠️ Segment non chargé, événement ignoré:', eventName);
    return;
  }

  const eventProps = {
    ...properties,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '/',
    page_url: typeof window !== 'undefined' ? window.location.href : '/',
    page_title: typeof document !== 'undefined' ? document.title : ''
  };
  
  console.log('[Segment] ✅ Envoi événement:', eventName, eventProps);
  
  try {
    window.analytics.track(eventName, eventProps);
    console.log('[Segment] ✅ Événement envoyé avec succès:', eventName);
  } catch (error) {
    console.error('[Segment] ❌ Erreur lors de l\'envoi de l\'événement:', eventName, error);
  }
};

/**
 * Track CTA click (Book an appointment) - Mapped to GA4 'generate_lead'
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

  // GA4 standard event: generate_lead
  // Required params: value (optional), currency (optional), lead_type (optional)
  trackEvent('generate_lead', {
    // GA4 standard parameters
    value: 0, // Pas de valeur monétaire pour un CTA
    currency: 'USD',
    lead_type: ctaType,
    
    // Custom parameters (will be sent as custom dimensions)
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
      console.error('Segment trackCTAClick error:', err);
    }
  });
};

/**
 * Track service click - Mapped to GA4 'select_item'
 * @param {string} serviceId - Service ID
 * @param {string} serviceName - Service name
 * @param {string} location - Where the service was clicked (homepage, services page, etc.)
 */
export const trackServiceClick = (serviceId, serviceName, location) => {
  // GA4 standard event: select_item
  // Required params: item_list_id, item_list_name, items[]
  trackEvent('select_item', {
    // GA4 standard parameters
    item_list_id: 'services',
    item_list_name: 'Services List',
    items: [{
      item_id: serviceId,
      item_name: serviceName,
      item_category: 'service',
      item_list_id: 'services',
      item_list_name: 'Services List'
    }],
    
    // Custom parameters
    service_id: serviceId,
    service_name: serviceName,
    click_location: location
  }).catch(err => {
    // eslint-disable-next-line no-undef
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.error('Segment trackServiceClick error:', err);
    }
  });
};

/**
 * Track login click - Mapped to GA4 'login'
 * @param {string} location - Where the login link was clicked
 */
export const trackLoginClick = (location, metadata = {}) => {
  const { linkText, destination, pagePath } = metadata || {};

  // GA4 standard event: login
  // Required params: method (optional)
  trackEvent('login', {
    // GA4 standard parameters
    method: 'link_click',
    
    // Custom parameters
    click_location: location,
    link_text: sanitizeText(linkText),
    destination: destination || 'https://app.mynotary.io/login',
    page_path: pagePath || undefined
  }).catch(err => {
    // eslint-disable-next-line no-undef
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.error('Segment trackLoginClick error:', err);
    }
  });
};

/**
 * Track navigation click - Custom event (not a GA4 standard event)
 * @param {string} linkText - Text of the navigation link
 * @param {string} destination - Destination URL or anchor
 */
export const trackNavigationClick = (linkText, destination, metadata = {}) => {
  const { label, pagePath, section } = metadata || {};

  // Custom event (not a GA4 standard event)
  trackEvent('navigation_click', {
    link_text: sanitizeText(linkText),
    link_label: sanitizeText(label) || sanitizeText(linkText),
    destination: destination,
    page_path: pagePath || undefined,
    nav_section: section || undefined,
  }).catch(err => {
    // eslint-disable-next-line no-undef
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.error('Segment trackNavigationClick error:', err);
    }
  });
};

/**
 * Track blog post view - Mapped to GA4 'view_item'
 * @param {string} postSlug - Blog post slug
 * @param {string} postTitle - Blog post title
 */
export const trackBlogPostView = (postSlug, postTitle) => {
  // GA4 standard event: view_item
  // Required params: items[]
  trackEvent('view_item', {
    // GA4 standard parameters
    items: [{
      item_id: postSlug,
      item_name: postTitle,
      item_category: 'blog_post',
      item_list_id: 'blog',
      item_list_name: 'Blog Posts'
    }],
    
    // Custom parameters
    post_slug: postSlug,
    post_title: postTitle
  }).catch(err => {
    // eslint-disable-next-line no-undef
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.error('Segment trackBlogPostView error:', err);
    }
  });
};

/**
 * Track page view - Already handled by SegmentPageTracker component
 * This is kept for consistency but page views are tracked automatically
 * @param {string} pageName - Page name (optional)
 * @param {string} pagePath - Page path (optional)
 */
export const trackPageView = async (_pageName = null, pagePath = null) => {
  // Page views are already tracked by SegmentPageTracker component
  // This function is kept for API consistency but does nothing
  console.log('[Segment] trackPageView appelé (déjà géré par SegmentPageTracker)', { 
    pageName: _pageName, 
    pagePath 
  });
};

