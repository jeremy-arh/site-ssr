/**
 * Composant serveur pour injecter les balises hreflang ET canonical dans le <head>
 * Ces balises doivent être présentes dans le HTML initial pour le SEO
 */

import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, removeLanguageFromPath, addLanguageToPath, extractLanguageFromPath } from '../utils/language'

const BASE_URL = 'https://www.mynotary.io'

/**
 * Génère les balises hreflang pour une page donnée
 */
function generateHreflangTags(currentPathname) {
  // Retirer la langue du pathname actuel pour obtenir le path de base
  const basePath = removeLanguageFromPath(currentPathname || '/')
  
  // Générer les URLs pour toutes les langues
  const tags = []
  
  SUPPORTED_LANGUAGES.forEach(lang => {
    const url = `${BASE_URL}${addLanguageToPath(basePath, lang)}`
    tags.push({
      hreflang: lang,
      href: url
    })
  })
  
  // Ajouter x-default qui pointe vers la langue par défaut
  const defaultUrl = `${BASE_URL}${addLanguageToPath(basePath, DEFAULT_LANGUAGE)}`
  tags.push({
    hreflang: 'x-default',
    href: defaultUrl
  })
  
  return tags
}

/**
 * Génère l'URL canonical pour la page actuelle
 * La canonical DOIT pointer vers la page traduite actuelle
 */
function generateCanonicalUrl(currentPathname) {
  // Extraire la langue actuelle du pathname
  const currentLang = extractLanguageFromPath(currentPathname) || DEFAULT_LANGUAGE
  
  // Retirer la langue du pathname pour obtenir le path de base
  const basePath = removeLanguageFromPath(currentPathname || '/')
  
  // Reconstruire l'URL avec la langue actuelle
  const localizedPath = addLanguageToPath(basePath, currentLang)
  
  return `${BASE_URL}${localizedPath}`
}

/**
 * Composant qui injecte les balises hreflang ET canonical dans le head
 */
export default function HreflangLinks({ pathname }) {
  const hreflangTags = generateHreflangTags(pathname)
  const canonicalUrl = generateCanonicalUrl(pathname)
  
  return (
    <>
      {/* Canonical - DOIT être la page traduite actuelle */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Hreflang - toutes les versions linguistiques */}
      {hreflangTags.map((tag) => (
        <link
          key={tag.hreflang}
          rel="alternate"
          hrefLang={tag.hreflang}
          href={tag.href}
        />
      ))}
    </>
  )
}

