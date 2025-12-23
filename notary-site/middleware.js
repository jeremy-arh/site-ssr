import { NextResponse } from 'next/server'

const SUPPORTED_LANGUAGES = ['en', 'fr', 'es', 'de', 'it', 'pt']
const DEFAULT_LANGUAGE = 'en'

export function middleware(request) {
  const { pathname, searchParams, hostname } = request.nextUrl
  
  // Créer la réponse
  let response = NextResponse.next()
  
  // Vérifier si le paramètre gclid est présent dans l'URL
  const gclid = searchParams.get('gclid')
  
  if (gclid) {
    // Déterminer le domaine du cookie dynamiquement
    // Si c'est mynotary.io ou un sous-domaine, utiliser .mynotary.io pour le partage
    // Sinon (Vercel, localhost, etc.), ne pas spécifier de domaine (cookie limité au domaine exact)
    let cookieDomain = ''
    if (hostname.endsWith('.mynotary.io') || hostname === 'mynotary.io') {
      cookieDomain = 'Domain=.mynotary.io'
    }
    // Pour Vercel et autres domaines, on ne spécifie pas de domaine
    // Le cookie sera limité au domaine exact (ce qui est correct pour les previews Vercel)
    
    // Définir le cookie avec le gclid
    // Durée de vie : 90 jours (standard pour les paramètres de tracking Google)
    const cookieOptions = [
      `gclid=${gclid}`,
      cookieDomain, // Vide pour Vercel/localhost, .mynotary.io pour production
      'Path=/',
      `Max-Age=${90 * 24 * 60 * 60}`, // 90 jours en secondes
      'SameSite=Lax',
      'Secure' // HTTPS uniquement
    ].filter(Boolean).join('; ') // filter(Boolean) retire les chaînes vides
    
    response.headers.set('Set-Cookie', cookieOptions)
  }
  
  const pathnameHasLocale = SUPPORTED_LANGUAGES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // Si la route a déjà une langue, la laisser passer
  if (pathnameHasLocale) {
    return response
  }

  // Si c'est une route API ou un fichier statique, la laisser passer
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') // fichiers statiques
  ) {
    return response
  }

  // Pour les autres routes, on les laisse passer sans préfixe de langue
  // (la langue sera gérée côté client)
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

