// LAZY LOAD Supabase pour optimiser les performances - ne charger que quand nécessaire
// Cela évite d'inclure le bundle Supabase (45 KiB) dans le bundle initial

let supabaseClient = null;
let supabasePromise = null;
let initializationFailed = false;

/**
 * Lazy load Supabase client - chargé uniquement quand nécessaire
 * Économise 45 KiB sur les pages qui n'utilisent pas Supabase (comme ServiceDetail)
 * Retourne null si l'initialisation échoue (graceful degradation)
 */
export const getSupabase = async () => {
  // Si l'initialisation a déjà échoué, ne pas réessayer
  if (initializationFailed) {
    return null;
  }

  // Si déjà chargé, retourner directement
  if (supabaseClient) {
    return supabaseClient;
  }

  // Si en cours de chargement, retourner la promesse existante
  if (supabasePromise) {
    return supabasePromise;
  }

  // Charger dynamiquement Supabase
  supabasePromise = (async () => {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      
      // Support Next.js (process.env) et Vite (import.meta.env)
      // eslint-disable-next-line no-undef
      const supabaseUrl = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL
        // eslint-disable-next-line no-undef
        ? process.env.NEXT_PUBLIC_SUPABASE_URL
        : (typeof import.meta !== 'undefined' ? import.meta.env.VITE_SUPABASE_URL : null);
      
      // eslint-disable-next-line no-undef
      const supabaseAnonKey = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        // eslint-disable-next-line no-undef
        ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        : (typeof import.meta !== 'undefined' ? import.meta.env.VITE_SUPABASE_ANON_KEY : null);

      if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('⚠️ Supabase environment variables not configured');
        initializationFailed = true;
        return null;
      }

      supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false, // Pas de session auth côté client
          autoRefreshToken: false,
        },
      });
      return supabaseClient;
    } catch (error) {
      console.error('❌ Error creating Supabase client:', error);
      initializationFailed = true;
      return null;
    }
  })();

  return supabasePromise;
};
