/**
 * Génère les URLs hreflang pour toutes les langues supportées
 * Utilisé côté serveur pour les métadonnées Next.js
 */

import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './language'

const BASE_URL = 'https://www.mynotary.io'

/**
 * Retire la langue du pathname
 */
function removeLanguageFromPath(pathname) {
  if (!pathname) return '/'
  const segments = pathname.split('/').filter(Boolean)
  if (SUPPORTED_LANGUAGES.includes(segments[0])) {
    return '/' + segments.slice(1).join('/')
  }
  return pathname
}

/**
 * Ajoute la langue au pathname
 */
function addLanguageToPath(pathname, language) {
  if (!pathname || pathname === '/') {
    return language === DEFAULT_LANGUAGE ? '/' : `/${language}`
  }
  
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  
  if (language === DEFAULT_LANGUAGE) {
    return cleanPath
  }
  
  return `/${language}${cleanPath}`
}

/**
 * Génère les alternates hreflang pour Next.js metadata
 * 
 * @param {string} currentPathname - Le pathname actuel (peut contenir la langue)
 * @returns {Object} - Objet alternates pour Next.js metadata
 */
export function generateHreflangAlternates(currentPathname) {
  // Retirer la langue du pathname actuel pour obtenir le path de base
  const basePath = removeLanguageFromPath(currentPathname)
  
  // Générer les URLs pour toutes les langues
  const languages = {}
  
  SUPPORTED_LANGUAGES.forEach(lang => {
    const url = `${BASE_URL}${addLanguageToPath(basePath, lang)}`
    languages[lang] = url
  })
  
  return {
    canonical: `${BASE_URL}${addLanguageToPath(basePath, DEFAULT_LANGUAGE)}`,
    languages: languages
  }
}

