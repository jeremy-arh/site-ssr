// Traductions côté serveur - pas de hooks, pas de contexte client
import { translations } from '@/i18n/translations'

const DEFAULT_LANGUAGE = 'en'
const SUPPORTED_LANGUAGES = ['en', 'fr', 'es', 'de', 'it', 'pt']

/**
 * Extrait la langue depuis le pathname côté serveur
 */
export function getLanguageFromPath(pathname) {
  if (!pathname) return DEFAULT_LANGUAGE
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]
  
  if (SUPPORTED_LANGUAGES.includes(firstSegment)) {
    return firstSegment
  }
  
  return DEFAULT_LANGUAGE
}

/**
 * Obtient une traduction côté serveur
 */
export function getTranslation(language, key, fallback = '') {
  const lang = SUPPORTED_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE
  const keys = key.split('.')
  let value = translations[lang]

  if (!value) {
    value = translations[DEFAULT_LANGUAGE]
  }

  for (const k of keys) {
    if (value && typeof value === 'object' && value !== null) {
      value = value[k]
    } else {
      // Fallback to English
      if (lang !== DEFAULT_LANGUAGE) {
        let enValue = translations[DEFAULT_LANGUAGE]
        for (const enKey of keys) {
          if (enValue && typeof enValue === 'object' && enValue !== null) {
            enValue = enValue[enKey]
          } else {
            return fallback || key
          }
        }
        return enValue || fallback || key
      }
      return fallback || key
    }
  }

  if ((value === undefined || value === null) && lang !== DEFAULT_LANGUAGE) {
    let enValue = translations[DEFAULT_LANGUAGE]
    for (const k of keys) {
      if (enValue && typeof enValue === 'object' && enValue !== null) {
        enValue = enValue[k]
      } else {
        return fallback || key
      }
    }
    return enValue || fallback || key
  }

  return value !== undefined && value !== null ? value : (fallback || key)
}

/**
 * Crée une fonction de traduction pour une langue donnée
 */
export function createTranslator(language) {
  return (key, fallback = '') => getTranslation(language, key, fallback)
}

/**
 * Obtient le chemin localisé côté serveur
 */
export function getLocalizedPath(path, language) {
  if (language === DEFAULT_LANGUAGE) {
    return path
  }
  
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  const segments = cleanPath.split('/').filter(Boolean)
  
  if (SUPPORTED_LANGUAGES.includes(segments[0])) {
    return path
  }
  
  return `/${language}/${cleanPath}`
}

export { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE }

