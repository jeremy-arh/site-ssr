import { NextResponse } from 'next/server'

const SUPPORTED_LANGUAGES = ['en', 'fr', 'es', 'de', 'it', 'pt']
const DEFAULT_LANGUAGE = 'en'

export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl
  
  // Créer la réponse
  let response = NextResponse.next()
  
  // Vérifier si le paramètre gclid est présent dans l'URL
  const gclid = searchParams.get('gclid')
  
  if (gclid) {
    // Définir le cookie avec le gclid
    // Le cookie sera partagé sur tous les sous-domaines de mynotary.io
    // Durée de vie : 90 jours (standard pour les paramètres de tracking Google)
    const cookieOptions = [
      `gclid=${gclid}`,
      'Domain=.mynotary.io', // Le point initial permet le partage entre sous-domaines
      'Path=/',
      `Max-Age=${90 * 24 * 60 * 60}`, // 90 jours en secondes
      'SameSite=Lax',
      'Secure' // HTTPS uniquement
    ].join('; ')
    
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

