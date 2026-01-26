/**
 * Génère l'URL canonique complète pour une page
 * Cette fonction garantit que les URLs canoniques correspondent exactement
 * aux URLs du sitemap pour une meilleure indexation SEO.
 * 
 * Format utilisé (identique au sitemap) :
 * - Page d'accueil : https://mynotary.io (sans trailing slash)
 * - Autres pages : https://mynotary.io/path (sans trailing slash)
 * 
 * @param {string} pathname - Le chemin de la page (ex: '/services/apostille')
 * @returns {string} L'URL canonique complète
 */
export const getCanonicalUrl = (pathname = '/') => {
  // Utiliser le domaine depuis window.location si disponible (production)
  // Sinon utiliser le domaine par défaut
  // Format identique au sitemap : ${protocol}//${host}
  const baseUrl = typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.host}`
    : 'https://www.mynotary.io';
  
  // Normaliser le pathname pour correspondre au format du sitemap
  // S'assurer que le pathname commence par /
  let cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  
  // Retirer le trailing slash pour toutes les pages (y compris la page d'accueil)
  // Format identique au sitemap : pas de trailing slash du tout
  const finalPath = cleanPath === '/' ? '' : cleanPath.replace(/\/$/, '');
  
  // Construire l'URL finale (format identique au sitemap)
  return `${baseUrl}${finalPath}`;
};

