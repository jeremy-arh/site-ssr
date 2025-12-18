// LAZY LOAD Supabase pour optimiser les performances - ne charger que quand nécessaire
// Cela évite d'inclure le bundle Supabase (45 KiB) dans le bundle initial

let supabaseClient = null;
let supabasePromise = null;

/**
 * Lazy load Supabase client - chargé uniquement quand nécessaire
 * Économise 45 KiB sur les pages qui n'utilisent pas Supabase (comme ServiceDetail)
 */
export const getSupabase = async () => {
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
        const errorMsg = `
⚠️ MISSING SUPABASE ENVIRONMENT VARIABLES ⚠️

Please configure the following environment variables:
- NEXT_PUBLIC_SUPABASE_URL (pour Next.js) ou VITE_SUPABASE_URL (pour Vite)
- NEXT_PUBLIC_SUPABASE_ANON_KEY (pour Next.js) ou VITE_SUPABASE_ANON_KEY (pour Vite)

Current status:
- SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}
- SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ Set' : '❌ Missing'}
        `;
        console.error(errorMsg);
        throw new Error('Supabase environment variables are not configured.');
      }

      supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
      // eslint-disable-next-line no-undef
      if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.log('✅ Supabase client initialized successfully (lazy loaded)');
      }
      return supabaseClient;
    } catch (error) {
      console.error('❌ Error creating Supabase client:', error);
      throw error;
    }
  })();

  return supabasePromise;
};

// Note: Le code existant devrait utiliser getSupabase() directement
// Ce proxy est conservé uniquement pour éviter les erreurs d'import,
// mais ne devrait plus être utilisé dans le nouveau code
// Utiliser getSupabase() à la place pour un lazy loading optimal
