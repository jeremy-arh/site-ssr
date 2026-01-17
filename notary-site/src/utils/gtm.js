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
  if (typeof window === 'undefined') {
    console.warn('[GTM] ⚠️ window est undefined');
    return;
  }

  // Ensure dataLayer exists - le script GTM dans le layout devrait déjà l'avoir créé
  // mais on s'assure qu'il existe au cas où
  if (!window.dataLayer) {
    console.log('[GTM] dataLayer n\'existe pas, initialisation...');
    window.dataLayer = window.dataLayer || [];
  }

  // Vérifier que dataLayer est bien un tableau
  if (!Array.isArray(window.dataLayer)) {
    console.error('[GTM] ❌ dataLayer n\'est pas un tableau');
    window.dataLayer = [];
  }

  const eventPayload = {
    event: eventName,
    event_name: eventName, // Pour GTM server-side
    ...eventData
  };

  try {
    // Utiliser la méthode push native du tableau pour garantir la compatibilité
    window.dataLayer.push(eventPayload);
    
    // Log pour débogage (toujours actif pour vérifier en production)
    console.log('[GTM] ✅ Événement envoyé:', eventName);
    
    // Log détaillé en développement uniquement
    // eslint-disable-next-line no-undef
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
      console.log('[GTM] Détails:', eventPayload);
    }
  } catch (error) {
    console.error('[GTM] ❌ Erreur lors du push dans dataLayer:', error);
    // Tentative de récupération : réinitialiser le dataLayer
    try {
      window.dataLayer = [];
      window.dataLayer.push(eventPayload);
      console.log('[GTM] ✅ Événement poussé après réinitialisation');
    } catch (retryError) {
      console.error('[GTM] ❌ Échec définitif du push:', retryError);
    }
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

/**
 * Vérifie si on est sur une page service
 * @param {string} pathname - Le pathname de la page
 * @returns {boolean} True si on est sur une page service
 */
const isServicePage = (pathname) => {
  if (!pathname) return false;
  
  // Vérifier les patterns: /services/[serviceId] ou /[lang]/services/[serviceId]
  // Exclure /services seul (liste des services)
  const pathSegments = pathname.split('/').filter(Boolean);
  const servicesIndex = pathSegments.indexOf('services');
  
  if (servicesIndex === -1) return false;
  
  // Si 'services' est suivi d'un autre segment, c'est une page service
  // Exemple: ['services', 'apostille'] -> true
  // Exemple: ['fr', 'services', 'apostille'] -> true
  // Exemple: ['services'] -> false (liste des services)
  const isService = servicesIndex < pathSegments.length - 1;
  
  // Log de débogage uniquement en développement
  // eslint-disable-next-line no-undef
  if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
    console.log('[GTM] isServicePage:', pathname, '->', isService, '(segments:', pathSegments, ', servicesIndex:', servicesIndex, ')');
  }
  
  return isService;
};

/**
 * Track CTA click vers le formulaire (uniquement sur les pages NON-services)
 * @param {string} ctaLocation - Emplacement du CTA (hero, navbar_desktop, navbar_mobile, mobile_cta, popup_cta, how_it_works)
 * @param {string} pathname - Le pathname de la page actuelle
 * @param {string} ctaText - Texte du CTA
 * @param {string} destination - URL de destination (formUrl)
 * @param {string} elementId - ID de l'élément CTA
 * @param {string} serviceId - ID du service (optionnel, peut être null)
 * @param {string} currency - Devise sélectionnée (optionnel)
 */
export const trackCTAToForm = (ctaLocation, pathname, ctaText, destination, elementId, serviceId = null, currency = null) => {
  // Ne pas tracker si on est sur une page service
  if (isServicePage(pathname)) {
    return;
  }

  // Récupérer l'URL complète pour page_location
  const pageLocation = typeof window !== 'undefined' ? window.location.href : '';
  const pageTitle = typeof document !== 'undefined' ? document.title : '';
  const pageReferrer = typeof document !== 'undefined' ? document.referrer || '' : '';

  pushGTMEvent('clic-notarisation', {
    // Variables principales
    cta_location: ctaLocation,
    cta_text: ctaText,
    destination: destination,
    element_id: elementId,
    
    // Informations sur la page
    page_path: pathname,
    page_location: pageLocation,
    page_title: pageTitle,
    page_referrer: pageReferrer,
    
    // Informations sur le service (peut être null si pas de service)
    service_id: serviceId || null,
    
    // Informations sur la devise
    currency: currency || null,
    
    // Timestamp pour le tracking
    timestamp: new Date().toISOString()
  });
};

/**
 * Track CTA click vers le formulaire (uniquement sur les pages services)
 * @param {string} ctaLocation - Emplacement du CTA (hero, navbar_desktop, navbar_mobile, mobile_cta, popup_cta, how_it_works)
 * @param {string} pathname - Le pathname de la page actuelle
 * @param {string} ctaText - Texte du CTA
 * @param {string} destination - URL de destination (formUrl)
 * @param {string} elementId - ID de l'élément CTA
 * @param {string} serviceId - ID du service (obligatoire sur les pages services)
 * @param {string} currency - Devise sélectionnée (optionnel)
 */
export const trackCTAToFormOnService = (ctaLocation, pathname, ctaText, destination, elementId, serviceId, currency = null) => {
  // Ne tracker que si on est sur une page service
  if (!isServicePage(pathname)) {
    // eslint-disable-next-line no-undef
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
      console.log('[GTM] trackCTAToFormOnService: pas une page service, événement ignoré', { pathname, ctaLocation });
    }
    return;
  }

  // Récupérer l'URL complète pour page_location
  const pageLocation = typeof window !== 'undefined' ? window.location.href : '';
  const pageTitle = typeof document !== 'undefined' ? document.title : '';
  const pageReferrer = typeof document !== 'undefined' ? document.referrer || '' : '';

  pushGTMEvent('clic-cta-service', {
    // Variables principales
    cta_location: ctaLocation,
    cta_text: ctaText,
    destination: destination,
    element_id: elementId,
    
    // Informations sur la page
    page_path: pathname,
    page_location: pageLocation,
    page_title: pageTitle,
    page_referrer: pageReferrer,
    
    // Informations sur le service (obligatoire sur les pages services)
    service_id: serviceId || null,
    
    // Informations sur la devise
    currency: currency || null,
    
    // Timestamp pour le tracking
    timestamp: new Date().toISOString()
  });
};

// Initialize GTM on module load
if (typeof window !== 'undefined') {
  initGTM();
}

