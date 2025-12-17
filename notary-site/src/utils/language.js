// Utility functions for language detection and management

const LANGUAGE_STORAGE_KEY = 'user_selected_language';
const SUPPORTED_LANGUAGES = ['en', 'fr', 'es', 'de', 'it', 'pt']; // Langues supportées
const DEFAULT_LANGUAGE = 'en';

/**
 * Détecte la langue basée sur la locale du navigateur
 * PAS d'appel API pour éviter le CLS et améliorer les performances
 */
export const detectLanguageFromIP = async () => {
  try {
    // Utiliser navigator.language au lieu d'un appel API
    const browserLang = navigator.language || navigator.userLanguage || DEFAULT_LANGUAGE;
    const langCode = browserLang.split('-')[0].toLowerCase();
    
    // Vérifie que la langue détectée est supportée
    if (SUPPORTED_LANGUAGES.includes(langCode)) {
      return langCode;
    }
    
    return DEFAULT_LANGUAGE;
  } catch (error) {
    console.warn('Error detecting language:', error);
    return DEFAULT_LANGUAGE;
  }
};

/**
 * Initialise la langue : vérifie localStorage, sinon détecte via IP
 */
export const initializeLanguage = async () => {
  // Vérifie d'abord le localStorage
  if (typeof window !== 'undefined') {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
      return savedLanguage;
    }
  }

  // Sinon, détecte via IP
  return await detectLanguageFromIP();
};

/**
 * Récupère la langue depuis localStorage
 */
export const getLanguageFromStorage = () => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage) 
    ? savedLanguage 
    : DEFAULT_LANGUAGE;
};

/**
 * Sauvegarde la langue dans localStorage
 */
export const saveLanguageToStorage = (language) => {
  if (typeof window === 'undefined') return;
  if (SUPPORTED_LANGUAGES.includes(language)) {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }
};

/**
 * Extrait la langue du pathname
 * Exemples: '/fr/services' -> 'fr', '/services' -> 'en'
 */
export const extractLanguageFromPath = (pathname) => {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (SUPPORTED_LANGUAGES.includes(firstSegment)) {
    return firstSegment;
  }
  
  return DEFAULT_LANGUAGE;
};

/**
 * Retire la langue du pathname
 * Exemples: '/fr/services' -> '/services', '/services' -> '/services'
 */
export const removeLanguageFromPath = (pathname) => {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (SUPPORTED_LANGUAGES.includes(firstSegment)) {
    return '/' + segments.slice(1).join('/');
  }
  
  return pathname;
};

/**
 * Ajoute la langue au pathname (seulement si ce n'est pas 'en')
 * Exemples: '/services', 'fr' -> '/fr/services', '/services', 'en' -> '/services'
 */
export const addLanguageToPath = (pathname, language) => {
  if (language === DEFAULT_LANGUAGE) {
    return pathname;
  }
  
  // Retire le slash initial s'il existe
  const cleanPath = pathname.startsWith('/') ? pathname.slice(1) : pathname;
  
  // Vérifie si la langue est déjà dans le path
  const segments = cleanPath.split('/').filter(Boolean);
  if (SUPPORTED_LANGUAGES.includes(segments[0])) {
    return pathname; // La langue est déjà présente
  }
  
  return `/${language}/${cleanPath}`;
};

export { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY };



