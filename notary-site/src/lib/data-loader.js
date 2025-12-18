// Utilitaires pour charger les données pré-générées par le prebuild
// Ces fichiers sont générés dans public/data/ avant le build Next.js

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const DATA_DIR = join(process.cwd(), 'public', 'data')

/**
 * Charge les données d'un fichier JSON depuis public/data/
 * Utilisé pendant le build statique (prerendering)
 */
function loadJSON(filename) {
  const filepath = join(DATA_DIR, filename)
  
  if (!existsSync(filepath)) {
    console.warn(`⚠️ Data file not found: ${filename}`)
    return null
  }
  
  try {
    const content = readFileSync(filepath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error(`❌ Error loading ${filename}:`, error.message)
    return null
  }
}

/**
 * Récupère tous les services depuis les fichiers pré-générés
 */
export function getServicesFromFiles() {
  const data = loadJSON('services.json')
  return data || []
}

/**
 * Récupère l'index des services (version simplifiée) depuis les fichiers pré-générés
 */
export function getServicesIndexFromFiles() {
  const data = loadJSON('services-index.json')
  return data || []
}

/**
 * Récupère un service par ID depuis les fichiers pré-générés
 */
export function getServiceFromFiles(serviceId) {
  const data = loadJSON(`service-${serviceId}.json`)
  return data || null
}

/**
 * Récupère les FAQs depuis les fichiers pré-générés
 */
export function getFAQsFromFiles() {
  const data = loadJSON('faqs.json')
  return data || []
}

/**
 * Récupère les témoignages depuis les fichiers pré-générés
 */
export function getTestimonialsFromFiles() {
  const data = loadJSON('testimonials.json')
  return data || []
}

/**
 * Récupère tous les articles de blog depuis les fichiers pré-générés
 */
export function getBlogPostsFromFiles() {
  const data = loadJSON('blog-posts.json')
  return data || []
}

/**
 * Récupère l'index des articles de blog (version simplifiée) depuis les fichiers pré-générés
 */
export function getBlogIndexFromFiles() {
  const data = loadJSON('blog-index.json')
  return data || []
}

/**
 * Récupère un article de blog par slug depuis les fichiers pré-générés
 */
export function getBlogPostFromFiles(slug) {
  const posts = loadJSON('blog-posts.json')
  if (!posts) return null
  return posts.find(post => post.slug === slug) || null
}

/**
 * Récupère les articles de blog liés depuis les fichiers pré-générés
 */
export function getRelatedBlogPostsFromFiles(currentSlug, limit = 3) {
  const posts = loadJSON('blog-posts.json')
  if (!posts) return []
  return posts.filter(post => post.slug !== currentSlug).slice(0, limit)
}

