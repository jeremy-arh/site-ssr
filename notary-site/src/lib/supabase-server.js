// Client Supabase pour Server Components (SSR)
// Cette version est utilisée uniquement côté serveur

import { createClient } from '@supabase/supabase-js'

/**
 * Crée un client Supabase pour les Server Components
 * Utilise les variables d'environnement Next.js
 */
export function createServerClient() {
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

  return createClient(supabaseUrl, supabaseAnonKey)
}

/**
 * Récupère les services depuis Supabase (SSR)
 */
export async function getServices() {
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

    return data || []
  } catch (error) {
    console.error('Error in getServices:', error.message || error)
    return []
  }
}

/**
 * Récupère un service par ID depuis Supabase (SSR)
 */
export async function getService(serviceId) {
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

    return data
  } catch (error) {
    console.error('Error in getService:', error.message || error)
    return null
  }
}

/**
 * Récupère les FAQs depuis Supabase (SSR)
 */
export async function getFAQs() {
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

    return data || []
  } catch (error) {
    console.error('Error in getFAQs:', error.message || error)
    return []
  }
}

/**
 * Récupère les témoignages depuis Supabase (SSR)
 */
export async function getTestimonials() {
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

    return data || []
  } catch (error) {
    console.error('Error in getTestimonials:', error.message || error)
    return []
  }
}

/**
 * Récupère les articles de blog depuis Supabase (SSR)
 */
export async function getBlogPosts() {
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

    return data || []
  } catch (error) {
    console.error('Error in getBlogPosts:', error.message || error)
    return []
  }
}

/**
 * Récupère un article de blog par slug (SSR)
 */
export async function getBlogPost(slug) {
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

    return data
  } catch (error) {
    console.error('Error in getBlogPost:', error.message || error)
    return null
  }
}

/**
 * Récupère les articles de blog liés (SSR)
 */
export async function getRelatedBlogPosts(currentSlug, limit = 3) {
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

    return data || []
  } catch (error) {
    console.error('Error in getRelatedBlogPosts:', error.message || error)
    return []
  }
}

/**
 * Récupère les catégories de blog depuis Supabase (SSR)
 */
export async function getBlogCategories() {
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
    return uniqueCategories
  } catch (error) {
    console.error('Error in getBlogCategories:', error.message || error)
    return []
  }
}

