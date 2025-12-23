/**
 * Google Tag Manager Utility
 * Helper functions to send events to GTM dataLayer
 */

/**
 * Initialize GTM dataLayer if it doesn't exist
 */
export const initGTM = () => {
  console.log('[GTM] initGTM appelé');
  
  if (typeof window !== 'undefined') {
    if (!window.dataLayer) {
      window.dataLayer = [];
      console.log('[GTM] ✅ dataLayer initialisé');
    } else {
      console.log('[GTM] ℹ️ dataLayer existe déjà, longueur:', window.dataLayer.length);
    }
    
    // Vérifier si GTM script est chargé
    const gtmScript = document.querySelector('script[src*="googletagmanager.com/gtm.js"]');
    const gtmNoscript = document.querySelector('noscript iframe[src*="googletagmanager.com"]');
    
    console.log('[GTM] État du chargement:', {
      windowExists: true,
      dataLayerExists: typeof window.dataLayer !== 'undefined',
      dataLayerLength: window.dataLayer?.length || 0,
      gtmScriptTag: gtmScript !== null,
      gtmNoscriptTag: gtmNoscript !== null,
      gtmContainerId: gtmScript?.src?.match(/id=([^&]+)/)?.[1] || null
    });
  } else {
    console.warn('[GTM] ⚠️ window n\'est pas disponible dans initGTM');
  }
};

/**
 * Push an event to GTM dataLayer
 * @param {string} eventName - Name of the event
 * @param {object} eventData - Additional event data
 */
export const pushGTMEvent = (eventName, eventData = {}) => {
  console.log('[GTM] pushGTMEvent appelé', { eventName, eventData });
  
  if (typeof window === 'undefined') {
    console.warn('[GTM] ⚠️ window est undefined');
    return;
  }

  // Ensure dataLayer exists
  if (!window.dataLayer) {
    console.log('[GTM] dataLayer n\'existe pas, initialisation...');
    initGTM();
  }

  // Double check after initialization
  if (!window.dataLayer) {
    console.error('[GTM] ❌ Échec de l\'initialisation du dataLayer');
    return;
  }

  const eventPayload = {
    event: eventName,
    event_name: eventName, // Pour GTM server-side
    ...eventData
  };

  console.log('[GTM] ✅ Envoi événement au dataLayer:', eventName, eventPayload);
  
  try {
    window.dataLayer.push(eventPayload);
    console.log('[GTM] ✅ Événement poussé avec succès. Longueur du dataLayer:', window.dataLayer.length);
    
    // Vérifier si l'événement a bien été ajouté
    const lastEvent = window.dataLayer[window.dataLayer.length - 1];
    if (lastEvent && lastEvent.event === eventName) {
      console.log('[GTM] ✅ Vérification: événement confirmé dans dataLayer');
    } else {
      console.warn('[GTM] ⚠️ L\'événement pourrait ne pas avoir été ajouté correctement');
    }
  } catch (error) {
    console.error('[GTM] ❌ Erreur lors du push dans dataLayer:', error);
  }
};

/**
 * Track page view
 * @param {string} pageName - Page name
 * @param {string} pagePath - Page path
 */
export const trackPageView = (pageName, pagePath) => {
  // Récupérer l'URL complète pour page_location
  const pageLocation = typeof window !== 'undefined' ? window.location.href : pagePath;
  const pageReferrer = typeof document !== 'undefined' ? document.referrer || '' : '';
  const screenResolution = typeof window !== 'undefined' && window.screen ? window.screen.width : null;

  pushGTMEvent('page_view', {
    page_name: pageName,
    page_path: pagePath,
    page_title: typeof document !== 'undefined' ? document.title : '',
    // Clés attendues par GTM server-side
    page_location: pageLocation,
    page_referrer: pageReferrer,
    screen_resolution: screenResolution
  });
};

/**
 * Track CTA click (Book an appointment)
 * @param {string} location - Where the CTA was clicked (hero, navbar, mobile, etc.)
 */
export const trackCTAClick = (location) => {
  pushGTMEvent('cta_click', {
    cta_type: 'book_appointment',
    cta_location: location,
    destination: 'https://app.mynotary.io/form'
  });
};

/**
 * Track service click
 * @param {string} serviceId - Service ID
 * @param {string} serviceName - Service name
 * @param {string} location - Where the service was clicked (homepage, services page, etc.)
 */
export const trackServiceClick = (serviceId, serviceName, location) => {
  pushGTMEvent('service_click', {
    service_id: serviceId,
    service_name: serviceName,
    click_location: location
  });
};

/**
 * Track login click
 * @param {string} location - Where the login link was clicked
 */
export const trackLoginClick = (location) => {
  pushGTMEvent('login_click', {
    click_location: location,
    destination: 'https://app.mynotary.io/login'
  });
};

/**
 * Track navigation click
 * @param {string} linkText - Text of the navigation link
 * @param {string} destination - Destination URL or anchor
 */
export const trackNavigationClick = (linkText, destination) => {
  pushGTMEvent('navigation_click', {
    link_text: linkText,
    destination: destination
  });
};

/**
 * Track blog post view
 * @param {string} postSlug - Blog post slug
 * @param {string} postTitle - Blog post title
 */
export const trackBlogPostView = (postSlug, postTitle) => {
  pushGTMEvent('blog_post_view', {
    post_slug: postSlug,
    post_title: postTitle
  });
};

/**
 * Track FAQ toggle
 * @param {number} faqIndex - FAQ item index
 * @param {string} faqQuestion - FAQ question
 */
export const trackFAQToggle = (faqIndex, faqQuestion) => {
  pushGTMEvent('faq_toggle', {
    faq_index: faqIndex,
    faq_question: faqQuestion
  });
};

/**
 * Track external link click
 * @param {string} url - External URL
 * @param {string} linkText - Link text
 */
export const trackExternalLinkClick = (url, linkText) => {
  pushGTMEvent('external_link_click', {
    url: url,
    link_text: linkText
  });
};

// Initialize GTM on module load
if (typeof window !== 'undefined') {
  initGTM();
}

