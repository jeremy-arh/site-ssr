/**
 * Composant serveur pour injecter les balises hreflang dans le <head>
 * Ces balises doivent être présentes dans le HTML initial pour le SEO
 */

// eslint-disable-next-line react-refresh/only-export-components
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, removeLanguageFromPath, addLanguageToPath } from '../utils/language'

const BASE_URL = 'https://www.mynotary.io'

/**
 * Génère les balises hreflang pour une page donnée
 */
export function generateHreflangTags(currentPathname) {
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
 * Composant qui injecte les balises hreflang dans le head
 */
export default function HreflangLinks({ pathname }) {
  const hreflangTags = generateHreflangTags(pathname)
  
  return (
    <>
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

