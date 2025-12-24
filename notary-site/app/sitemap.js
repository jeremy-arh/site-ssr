/**
 * Sitemap dynamique pour Next.js / Vercel
 * Génère automatiquement un sitemap.xml avec toutes les URLs du site
 * Compatible avec Vercel et Next.js App Router
 */

import { getServices, getBlogPosts } from '../src/lib/supabase-server'

// Langues supportées (en est la langue par défaut, pas de préfixe)
const SUPPORTED_LANGUAGES = ['en', 'fr', 'es', 'de', 'it', 'pt']
const DEFAULT_LANGUAGE = 'en'

/**
 * Ajoute le préfixe de langue au chemin (seulement si ce n'est pas la langue par défaut)
 */
function addLanguageToPath(path, language) {
  if (language === DEFAULT_LANGUAGE) {
    return path
  }
  // Gérer le chemin racine
  if (path === '/') {
    return `/${language}`
  }
  // Retirer le slash initial s'il est présent
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `/${language}/${cleanPath}`
}

/**
 * Génère les URLs multilingues pour un chemin donné
 */
function generateMultilingualUrls(basePath, lastmod, changefreq, priority) {
  const urls = []
  SUPPORTED_LANGUAGES.forEach((lang) => {
    const localizedPath = addLanguageToPath(basePath, lang)
    urls.push({
      url: localizedPath,
      lastModified: lastmod ? new Date(lastmod) : new Date(),
      changeFrequency: changefreq,
      priority: parseFloat(priority),
    })
  })
  return urls
}

/**
 * Fonction principale pour générer le sitemap
 */
export default async function sitemap() {
  // Récupérer l'URL de base depuis les variables d'environnement ou utiliser une valeur par défaut
  // eslint-disable-next-line no-undef
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    // eslint-disable-next-line no-undef
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://mynotary.io')

  const allUrls = []

  try {
    // Récupérer les services depuis Supabase
    const services = await getServices()
    
    // Récupérer les articles de blog depuis Supabase
    const blogPosts = await getBlogPosts()

    // Page d'accueil (multilingue)
    const homeUrls = generateMultilingualUrls('/', new Date(), 'daily', '1.0')
    homeUrls.forEach((url) => {
      allUrls.push({
        url: `${baseUrl}${url.url}`,
        lastModified: url.lastModified,
        changeFrequency: url.changeFrequency,
        priority: url.priority,
      })
    })

    // Page des services (multilingue) - seulement si des services existent
    if (services && services.length > 0) {
      const servicesUrls = generateMultilingualUrls('/services', new Date(), 'weekly', '0.9')
      servicesUrls.forEach((url) => {
        allUrls.push({
          url: `${baseUrl}${url.url}`,
          lastModified: url.lastModified,
          changeFrequency: url.changeFrequency,
          priority: url.priority,
        })
      })

      // URLs individuelles pour chaque service (multilingue)
      services.forEach((service) => {
        const serviceUrls = generateMultilingualUrls(
          `/services/${service.service_id}`,
          service.updated_at || service.created_at,
          'monthly',
          '0.7'
        )
        serviceUrls.forEach((url) => {
          allUrls.push({
            url: `${baseUrl}${url.url}`,
            lastModified: url.lastModified,
            changeFrequency: url.changeFrequency,
            priority: url.priority,
          })
        })
      })
    }

    // Page blog (multilingue) - seulement si des articles existent
    if (blogPosts && blogPosts.length > 0) {
      const blogUrls = generateMultilingualUrls('/blog', new Date(), 'daily', '0.9')
      blogUrls.forEach((url) => {
        allUrls.push({
          url: `${baseUrl}${url.url}`,
          lastModified: url.lastModified,
          changeFrequency: url.changeFrequency,
          priority: url.priority,
        })
      })

      // URLs individuelles pour chaque article de blog (multilingue)
      blogPosts.forEach((post) => {
        const postUrls = generateMultilingualUrls(
          `/blog/${post.slug}`,
          post.updated_at || post.published_at,
          'weekly',
          '0.8'
        )
        postUrls.forEach((url) => {
          allUrls.push({
            url: `${baseUrl}${url.url}`,
            lastModified: url.lastModified,
            changeFrequency: url.changeFrequency,
            priority: url.priority,
          })
        })
      })
    }

    // Pages statiques (multilingue)
    const staticPages = [
      { path: '/terms-conditions', changefreq: 'monthly', priority: '0.5' },
      { path: '/privacy-policy', changefreq: 'monthly', priority: '0.5' },
    ]

    staticPages.forEach((page) => {
      const pageUrls = generateMultilingualUrls(page.path, new Date(), page.changefreq, page.priority)
      pageUrls.forEach((url) => {
        allUrls.push({
          url: `${baseUrl}${url.url}`,
          lastModified: url.lastModified,
          changeFrequency: url.changeFrequency,
          priority: url.priority,
        })
      })
    })

  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // En cas d'erreur, retourner au moins la page d'accueil
    const homeUrls = generateMultilingualUrls('/', new Date(), 'daily', '1.0')
    return homeUrls.map((url) => ({
      url: `${baseUrl}${url.url}`,
      lastModified: url.lastModified,
      changeFrequency: url.changeFrequency,
      priority: url.priority,
    }))
  }

  return allUrls
}

