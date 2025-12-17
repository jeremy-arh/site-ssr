/**
 * Analytics Tracking for Supabase
 * Tracks user interactions, page views, scroll depth, and CTA clicks
 * Also sends events to GTM for Google Ads tracking
 * 
 * OPTIMISATION: Supabase est lazy-loaded pour ne pas impacter les performances
 * des pages qui n'utilisent pas les analytics Supabase (comme ServiceDetail)
 */

import { getSupabase } from '../lib/supabase';
import { getSharedVisitorId, syncVisitorId, generateUUID } from './sharedVisitorId';
import { pushGTMEvent } from './gtm';

// Sync visitor ID on module load
if (typeof window !== 'undefined') {
  syncVisitorId();
}

// Generate or retrieve visitor ID (shared across domains)
const getVisitorId = () => {
  return getSharedVisitorId();
};

// Generate or retrieve session ID (stored in sessionStorage)
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = generateUUID();
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

// Get device information
const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  
  // Detect device type
  let deviceType = 'desktop';
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    deviceType = 'tablet';
  } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) {
    deviceType = 'mobile';
  }

  // Parse browser info
  let browserName = 'unknown';
  let browserVersion = 'unknown';
  
  if (ua.includes('Chrome') && !ua.includes('Edg')) {
    browserName = 'Chrome';
    const match = ua.match(/Chrome\/(\d+)/);
    browserVersion = match ? match[1] : 'unknown';
  } else if (ua.includes('Firefox')) {
    browserName = 'Firefox';
    const match = ua.match(/Firefox\/(\d+)/);
    browserVersion = match ? match[1] : 'unknown';
  } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
    browserName = 'Safari';
    const match = ua.match(/Version\/(\d+)/);
    browserVersion = match ? match[1] : 'unknown';
  } else if (ua.includes('Edg')) {
    browserName = 'Edge';
    const match = ua.match(/Edg\/(\d+)/);
    browserVersion = match ? match[1] : 'unknown';
  }

  // Parse OS info
  let osName = 'unknown';
  let osVersion = 'unknown';
  
  if (ua.includes('Windows')) {
    osName = 'Windows';
    const match = ua.match(/Windows NT (\d+\.\d+)/);
    osVersion = match ? match[1] : 'unknown';
  } else if (ua.includes('Mac OS X')) {
    osName = 'macOS';
    const match = ua.match(/Mac OS X (\d+[._]\d+)/);
    osVersion = match ? match[1].replace('_', '.') : 'unknown';
  } else if (ua.includes('Linux')) {
    osName = 'Linux';
  } else if (ua.includes('Android')) {
    osName = 'Android';
    const match = ua.match(/Android (\d+\.\d+)/);
    osVersion = match ? match[1] : 'unknown';
  } else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) {
    osName = 'iOS';
    const match = ua.match(/OS (\d+[._]\d+)/);
    osVersion = match ? match[1].replace('_', '.') : 'unknown';
  }

  return {
    deviceType,
    browserName,
    browserVersion,
    osName,
    osVersion,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height
  };
};

// Cache for geo information (stored for 24 hours)
const GEO_CACHE_KEY = 'analytics_geo_cache';
const GEO_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Get cached geo info - PAS D'APPEL API pour éviter les latences (1000ms+)
const getGeoInfo = async () => {
  // Default values
  const defaultGeoInfo = {
    countryCode: null,
    countryName: null,
    city: null,
    region: null,
    ip: null
  };

  // Utiliser uniquement le cache s'il existe
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(GEO_CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();
        if (now - timestamp < GEO_CACHE_DURATION) {
          return data;
        }
      }
    } catch (error) {
      // Cache invalid
    }
  }

  // PAS d'appel à ip-api.com ou ipapi.co - ces appels causaient 1000ms+ de latence
  return defaultGeoInfo;
};

// Get browser language
const getBrowserLanguage = () => {
  return navigator.language || navigator.userLanguage || 'unknown';
};

// Get UTM parameters from URL
const getUTMParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source') || null,
    utmMedium: params.get('utm_medium') || null,
    utmCampaign: params.get('utm_campaign') || null
  };
};

// Generic event tracking function - ULTRA OPTIMISÉ pour ne JAMAIS bloquer
// Utilise setTimeout pour être complètement non-bloquant
// LAZY LOAD Supabase - ne charge le bundle que si vraiment nécessaire
export const trackEvent = async (eventType, pagePath = null, metadata = {}) => {
  if (typeof window === 'undefined') {
    return;
  }

  // Exécuter de manière complètement asynchrone après le rendu
  setTimeout(async () => {
    try {
      // Lazy load Supabase uniquement maintenant (ne bloque pas le rendu initial)
      const supabase = await getSupabase().catch(() => null);
      if (!supabase) {
        return; // Si Supabase n'est pas disponible, ignorer silencieusement
      }

      const visitorId = getVisitorId();
      const sessionId = getSessionId();
      const deviceInfo = getDeviceInfo();
      // Get geo info (cached only - no API calls)
      const geoInfo = await getGeoInfo().catch(() => ({
        countryCode: null,
        countryName: null,
        city: null,
        region: null,
        ip: null
      }));
      const language = getBrowserLanguage();
      const utmParams = getUTMParams();

      // Ne PAS appeler supabase.auth.getUser() - c'est bloquant !
      const userId = null;

      const eventData = {
        event_type: eventType,
        page_path: pagePath || window.location.pathname,
        visitor_id: visitorId,
        session_id: sessionId,
        user_id: userId,
        country_code: geoInfo.countryCode,
        country_name: geoInfo.countryName,
        city: geoInfo.city,
        region: geoInfo.region,
        ip_address: geoInfo.ip,
        language: language,
        device_type: deviceInfo.deviceType,
        browser_name: deviceInfo.browserName,
        browser_version: deviceInfo.browserVersion,
        os_name: deviceInfo.osName,
        os_version: deviceInfo.osVersion,
        screen_width: deviceInfo.screenWidth,
        screen_height: deviceInfo.screenHeight,
        referrer: document.referrer || null,
        utm_source: utmParams.utmSource,
        utm_medium: utmParams.utmMedium,
        utm_campaign: utmParams.utmCampaign,
        metadata: metadata
      };

      // Fire and forget - ne pas attendre la réponse
      supabase
        .from('analytics_events')
        .insert([eventData])
        .then(() => {})
        .catch(() => {});
    } catch (error) {
      // Silencieux - ne jamais bloquer pour des erreurs analytics
    }
  }, 0);
};

// Track pageview
export const trackPageView = (pagePath = null) => {
  const path = pagePath || window.location.pathname;
  const pageName = path === '/' ? 'Home' : path.split('/').pop();
  
  // Send to GTM for Google Ads
  const pageLocation = typeof window !== 'undefined' ? window.location.href : path;
  const pageReferrer = typeof document !== 'undefined' ? document.referrer || '' : '';
  const screenResolution = typeof window !== 'undefined' && window.screen ? window.screen.width : null;
  
  pushGTMEvent('page_view', {
    page_name: pageName,
    page_path: path,
    page_title: typeof document !== 'undefined' ? document.title : '',
    page_location: pageLocation,
    page_referrer: pageReferrer,
    screen_resolution: screenResolution
  });
  
  // Send to Supabase
  return trackEvent('pageview', path, {
    timestamp: new Date().toISOString()
  });
};

// Track scroll depth
export const trackScrollDepth = (scrollPercentage) => {
  // Track milestones: 25%, 50%, 75%, 100%
  const milestones = [25, 50, 75, 100];
  const trackedMilestones = JSON.parse(sessionStorage.getItem('analytics_scroll_milestones') || '[]');
  
  milestones.forEach(milestone => {
    if (scrollPercentage >= milestone && !trackedMilestones.includes(milestone)) {
      trackedMilestones.push(milestone);
      trackEvent('scroll_depth', window.location.pathname, {
        scroll_percentage: milestone,
        timestamp: new Date().toISOString()
      });
    }
  });
  
  sessionStorage.setItem('analytics_scroll_milestones', JSON.stringify(trackedMilestones));
};

// Track CTA click
export const trackCTAClick = (ctaLocation, serviceId = null, pagePath = null) => {
  const path = pagePath || window.location.pathname;
  
  // Send to GTM for Google Ads
  pushGTMEvent('cta_click', {
    cta_type: 'book_appointment',
    cta_location: ctaLocation,
    service_id: serviceId,
    destination: 'https://app.mynotary.io/form',
    page_path: path
  });
  
  // Send to Supabase
  return trackEvent('cta_click', path, {
    cta_location: ctaLocation,
    service_id: serviceId,
    destination: 'form',
    timestamp: new Date().toISOString()
  });
};

// Track navigation click
export const trackNavigationClick = (linkText, destination, pagePath = null) => {
  const path = pagePath || window.location.pathname;
  
  // Send to GTM for Google Ads
  pushGTMEvent('navigation_click', {
    link_text: linkText,
    destination: destination,
    page_path: path
  });
  
  // Send to Supabase
  return trackEvent('navigation_click', path, {
    link_text: linkText,
    destination: destination,
    timestamp: new Date().toISOString()
  });
};

// Track service click
export const trackServiceClick = (serviceId, serviceName, location, pagePath = null) => {
  const path = pagePath || window.location.pathname;
  
  // Send to GTM for Google Ads
  pushGTMEvent('service_click', {
    service_id: serviceId,
    service_name: serviceName,
    click_location: location,
    page_path: path
  });
  
  // Send to Supabase
  return trackEvent('service_click', path, {
    service_id: serviceId,
    service_name: serviceName,
    click_location: location,
    timestamp: new Date().toISOString()
  });
};

// Track login click
export const trackLoginClick = (location, pagePath = null) => {
  const path = pagePath || window.location.pathname;
  
  // Send to GTM for Google Ads
  pushGTMEvent('login_click', {
    click_location: location,
    destination: 'https://app.mynotary.io/login',
    page_path: path
  });
  
  // Send to Supabase
  return trackEvent('login_click', path, {
    click_location: location,
    destination: 'login',
    timestamp: new Date().toISOString()
  });
};

// Track blog post view
export const trackBlogPostView = (postSlug, postTitle, pagePath = null) => {
  return trackEvent('blog_post_view', pagePath || window.location.pathname, {
    post_slug: postSlug,
    post_title: postTitle,
    timestamp: new Date().toISOString()
  });
};

// Track FAQ toggle
export const trackFAQToggle = (faqIndex, faqQuestion, pagePath = null) => {
  return trackEvent('faq_toggle', pagePath || window.location.pathname, {
    faq_index: faqIndex,
    faq_question: faqQuestion,
    timestamp: new Date().toISOString()
  });
};

