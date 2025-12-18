// Client Supabase pour Server Components (SSR)
// Cette version est utilisée uniquement côté serveur
// IMPORTANT: Ne pas importer ce fichier dans les Client Components !

import { createClient } from '@supabase/supabase-js'

// Cache le client pour éviter de le recréer à chaque appel
let serverClient = null

// Cache pour les données (durée: 60 secondes)
const CACHE_DURATION = 60 * 1000 // 60 secondes
const dataCache = new Map()

/**
 * Nettoie le cache expiré
 */
function cleanExpiredCache() {
  const now = Date.now()
  for (const [key, value] of dataCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      dataCache.delete(key)
    }
  }
}

/**
 * Récupère une valeur du cache si elle existe et n'est pas expirée
 */
function getCachedData(key) {
  cleanExpiredCache()
  const cached = dataCache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

/**
 * Met une valeur en cache
 */
function setCachedData(key, data) {
  dataCache.set(key, {
    data,
    timestamp: Date.now()
  })
}

/**
 * Crée un client Supabase pour les Server Components
 * Utilise les variables d'environnement Next.js
 */
export function createServerClient() {
  // Si déjà créé, retourner le cache
  if (serverClient) {
    return serverClient
  }

  // eslint-disable-next-line no-undef
  const supabaseUrl = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_URL : null
  // eslint-disable-next-line no-undef
  const supabaseAnonKey = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : null

  if (!supabaseUrl || !supabaseAnonKey) {
    // Retourner null au lieu de throw pour permettre un fallback gracieux
    console.warn(
      '⚠️ Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
    )
    return null
  }

  serverClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
  
  return serverClient
}

/**
 * Récupère les services depuis Supabase (SSR) avec cache
 */
export async function getServices() {
  const cacheKey = 'services'
  const cached = getCachedData(cacheKey)
  if (cached) {
    return cached
  }

  try {
    const supabase = createServerClient()
    if (!supabase) {
      console.warn('⚠️ Supabase client not initialized, returning empty services array')
      return []
    }

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching services:', error.message || error)
      return []
    }

    const result = data || []
    setCachedData(cacheKey, result)
    return result
  } catch (error) {
    console.error('Error in getServices:', error.message || error)
    return []
  }
}

/**
 * Récupère un service par ID depuis Supabase (SSR) avec cache
 */
export async function getService(serviceId) {
  const cacheKey = `service:${serviceId}`
  const cached = getCachedData(cacheKey)
  if (cached) {
    return cached
  }

  try {
    const supabase = createServerClient()
    if (!supabase) {
      console.warn('⚠️ Supabase client not initialized, returning null for service')
      return null
    }

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('service_id', serviceId)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Error fetching service:', error.message || error)
      return null
    }

    if (data) {
      setCachedData(cacheKey, data)
    }
    return data
  } catch (error) {
    console.error('Error in getService:', error.message || error)
    return null
  }
}

/**
 * Récupère les FAQs depuis Supabase (SSR) avec cache
 */
export async function getFAQs() {
  const cacheKey = 'faqs'
  const cached = getCachedData(cacheKey)
  if (cached) {
    return cached
  }

  try {
    const supabase = createServerClient()
    if (!supabase) {
      console.warn('⚠️ Supabase client not initialized, returning empty FAQs array')
      return []
    }

    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('order', { ascending: true })

    if (error) {
      // Table n'existe pas encore - retourner un tableau vide silencieusement
      if (error.message && error.message.includes('Could not find the table')) {
        return []
      }
      console.error('Error fetching FAQs:', error.message || error)
      return []
    }

    const result = data || []
    setCachedData(cacheKey, result)
    return result
  } catch (error) {
    console.error('Error in getFAQs:', error.message || error)
    return []
  }
}

/**
 * Récupère les témoignages depuis Supabase (SSR) avec cache
 */
export async function getTestimonials() {
  const cacheKey = 'testimonials'
  const cached = getCachedData(cacheKey)
  if (cached) {
    return cached
  }

  try {
    const supabase = createServerClient()
    if (!supabase) {
      console.warn('⚠️ Supabase client not initialized, returning empty testimonials array')
      return []
    }

    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      // Table n'existe pas encore - retourner un tableau vide silencieusement
      if (error.message && error.message.includes('Could not find the table')) {
        return []
      }
      console.error('Error fetching testimonials:', error.message || error)
      return []
    }

    const result = data || []
    setCachedData(cacheKey, result)
    return result
  } catch (error) {
    console.error('Error in getTestimonials:', error.message || error)
    return []
  }
}

/**
 * Récupère les articles de blog depuis Supabase (SSR) avec cache
 */
export async function getBlogPosts() {
  const cacheKey = 'blog_posts'
  const cached = getCachedData(cacheKey)
  if (cached) {
    return cached
  }

  try {
    const supabase = createServerClient()
    if (!supabase) {
      console.warn('⚠️ Supabase client not initialized, returning empty blog posts array')
      return []
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (error) {
      console.error('Error fetching blog posts:', error.message || error)
      return []
    }

    const result = data || []
    setCachedData(cacheKey, result)
    return result
  } catch (error) {
    console.error('Error in getBlogPosts:', error.message || error)
    return []
  }
}

/**
 * Récupère un article de blog par slug (SSR) avec cache
 */
export async function getBlogPost(slug) {
  const cacheKey = `blog_post:${slug}`
  const cached = getCachedData(cacheKey)
  if (cached) {
    return cached
  }

  try {
    const supabase = createServerClient()
    if (!supabase) {
      console.warn('⚠️ Supabase client not initialized, returning null for blog post')
      return null
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error) {
      console.error('Error fetching blog post:', error.message || error)
      return null
    }

    if (data) {
      setCachedData(cacheKey, data)
    }
    return data
  } catch (error) {
    console.error('Error in getBlogPost:', error.message || error)
    return null
  }
}

/**
 * Récupère les articles de blog liés (SSR) avec cache
 */
export async function getRelatedBlogPosts(currentSlug, limit = 3) {
  const cacheKey = `related_blog_posts:${currentSlug}:${limit}`
  const cached = getCachedData(cacheKey)
  if (cached) {
    return cached
  }

  try {
    const supabase = createServerClient()
    if (!supabase) {
      console.warn('⚠️ Supabase client not initialized, returning empty related blog posts array')
      return []
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .neq('slug', currentSlug)
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching related blog posts:', error.message || error)
      return []
    }

    const result = data || []
    setCachedData(cacheKey, result)
    return result
  } catch (error) {
    console.error('Error in getRelatedBlogPosts:', error.message || error)
    return []
  }
}

/**
 * Récupère les catégories de blog depuis Supabase (SSR) avec cache
 */
export async function getBlogCategories() {
  const cacheKey = 'blog_categories'
  const cached = getCachedData(cacheKey)
  if (cached) {
    return cached
  }

  try {
    const supabase = createServerClient()
    if (!supabase) {
      console.warn('⚠️ Supabase client not initialized, returning empty blog categories array')
      return []
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .select('category')
      .eq('status', 'published')
      .not('category', 'is', null)

    if (error) {
      console.error('Error fetching blog categories:', error.message || error)
      return []
    }

    // Extraire les catégories uniques
    const uniqueCategories = [...new Set(data.map(post => post.category).filter(Boolean))]
    setCachedData(cacheKey, uniqueCategories)
    return uniqueCategories
  } catch (error) {
    console.error('Error in getBlogCategories:', error.message || error)
    return []
  }
}

