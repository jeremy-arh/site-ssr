import { Playfair_Display } from 'next/font/google'
import Providers from '@/components/Providers'
import AnalyticsLoader from '@/components/AnalyticsLoader'
import '@/index.css'

// Optimisation Google Fonts avec next/font (pas de blocage du rendu)
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600'],
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'Times New Roman', 'serif'],
  variable: '--font-playfair',
})

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  title: 'My notary - Notarize and Apostille Your Documents 100% Online',
  description: 'Notarize and apostille your documents 100% online. Secure, legally valid, and recognized internationally through the Hague Convention. Book your appointment in minutes.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={playfairDisplay.variable}>
      <head>
        {/* CSS Critique inline pour éviter le FOUC */}
        <style dangerouslySetInnerHTML={{
          __html: `
            *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
            html{font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
            body{font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;overflow-x:hidden;background:#ffffff;color:#111827}
            h1,h2{font-family:var(--font-playfair,Georgia,'Times New Roman',serif);font-weight:500}
            [data-hero]{min-height:100vh;position:relative}
            .fixed{position:fixed;top:0;left:0;right:0;z-index:50}
            img{max-width:100%;height:auto;display:block}
          `
        }} />
        
        {/* Preconnect à Supabase (données) et Cloudflare Images (LCP) */}
        <link rel="preconnect" href="https://jlizwheftlnhoifbqeex.supabase.co" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://imagedelivery.net" crossOrigin="anonymous" />
        
        {/* Preload image hero LCP - version optimisée pour chargement rapide */}
        <link
          rel="preload"
          as="image"
          href="https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/0c55cf3b-5ec9-4302-dcb8-717ddc084600/q=20"
          fetchPriority="high"
          media="(min-width: 768px)"
        />
        <link
          rel="preload"
          as="image"
          href="https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/0c55cf3b-5ec9-4302-dcb8-717ddc084600/q=20"
          fetchPriority="high"
          media="(max-width: 767px)"
        />
        
        {/* DNS prefetch supprimé pour scripts tiers - chargés uniquement après interaction */}
        
        {/* Favicons */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        
        {/* Meta */}
        <meta name="theme-color" content="#000000" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      </head>
      <body suppressHydrationWarning style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#ffffff', color: '#111827' }}>
        {/* Noscript GTM - seulement pour navigateurs sans JS, ne charge rien */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MR7JDNSD"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Providers>
          {children}
        </Providers>

        {/* Analytics Loader - Charge UNIQUEMENT après interaction utilisateur, ZERO chargement initial */}
        <AnalyticsLoader />
      </body>
    </html>
  )
}
