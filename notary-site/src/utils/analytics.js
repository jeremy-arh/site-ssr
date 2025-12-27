/**
 * Wrapper Analytics - Envoie les événements à la fois à Plausible et Segment
 * Les événements Segment utilisent les noms GA4 standards
 */

/**
 * Load analytics functions (Plausible + Segment)
 * @returns {Promise<object>} Object with all tracking functions
 */
export const loadAnalytics = async () => {
  const [plausible, segment] = await Promise.all([
    import('./plausible').catch(() => ({})),
    import('./segment').catch(() => ({}))
  ]);

  return {
    // Page View
    trackPageView: async (pageName, pagePath) => {
      await Promise.all([
        plausible.trackPageView?.(pageName, pagePath),
        segment.trackPageView?.(pageName, pagePath)
      ]);
    },

    // CTA Click - Plausible: 'cta_click', Segment: 'generate_lead' (GA4)
    trackCTAClick: (location, serviceId, pagePath, metadata) => {
      plausible.trackCTAClick?.(location, serviceId, pagePath, metadata);
      segment.trackCTAClick?.(location, serviceId, pagePath, metadata);
    },

    // Service Click - Plausible: 'service_click', Segment: 'select_item' (GA4)
    trackServiceClick: (serviceId, serviceName, location) => {
      plausible.trackServiceClick?.(serviceId, serviceName, location);
      segment.trackServiceClick?.(serviceId, serviceName, location);
    },

    // Login Click - Plausible: 'login_click', Segment: 'login' (GA4)
    trackLoginClick: (location, metadata) => {
      plausible.trackLoginClick?.(location, metadata);
      segment.trackLoginClick?.(location, metadata);
    },

    // Navigation Click - Custom event (same for both)
    trackNavigationClick: (linkText, destination, metadata) => {
      plausible.trackNavigationClick?.(linkText, destination, metadata);
      segment.trackNavigationClick?.(linkText, destination, metadata);
    },

    // Blog Post View - Plausible: 'blog_post_view', Segment: 'view_item' (GA4)
    trackBlogPostView: (postSlug, postTitle) => {
      plausible.trackBlogPostView?.(postSlug, postTitle);
      segment.trackBlogPostView?.(postSlug, postTitle);
    },

    // Generic event tracking
    trackEvent: async (eventName, props) => {
      await Promise.all([
        plausible.trackEvent?.(eventName, props),
        segment.trackEvent?.(eventName, props)
      ]);
    }
  };
};

// Export individual functions for direct imports
export const trackPageView = async (pageName, pagePath) => {
  const analytics = await loadAnalytics();
  return analytics.trackPageView(pageName, pagePath);
};

export const trackCTAClick = (location, serviceId, pagePath, metadata) => {
  loadAnalytics().then(analytics => {
    analytics.trackCTAClick(location, serviceId, pagePath, metadata);
  });
};

export const trackServiceClick = (serviceId, serviceName, location) => {
  loadAnalytics().then(analytics => {
    analytics.trackServiceClick(serviceId, serviceName, location);
  });
};

export const trackLoginClick = (location, metadata) => {
  loadAnalytics().then(analytics => {
    analytics.trackLoginClick(location, metadata);
  });
};

export const trackNavigationClick = (linkText, destination, metadata) => {
  loadAnalytics().then(analytics => {
    analytics.trackNavigationClick(linkText, destination, metadata);
  });
};

export const trackBlogPostView = (postSlug, postTitle) => {
  loadAnalytics().then(analytics => {
    analytics.trackBlogPostView(postSlug, postTitle);
  });
};

export const trackEvent = async (eventName, props) => {
  const analytics = await loadAnalytics();
  return analytics.trackEvent(eventName, props);
};

