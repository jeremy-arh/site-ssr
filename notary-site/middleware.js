import { NextResponse } from 'next/server'

const SUPPORTED_LANGUAGES = ['en', 'fr', 'es', 'de', 'it', 'pt']
const DEFAULT_LANGUAGE = 'en'

export function middleware(request) {
  const { pathname } = request.nextUrl
  const pathnameHasLocale = SUPPORTED_LANGUAGES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // Si la route a déjà une langue, la laisser passer
  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // Si c'est une route API ou un fichier statique, la laisser passer
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') // fichiers statiques
  ) {
    return NextResponse.next()
  }

  // Pour les autres routes, on les laisse passer sans préfixe de langue
  // (la langue sera gérée côté client)
  return NextResponse.next()
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

