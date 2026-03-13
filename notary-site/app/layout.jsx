import { Playfair_Display } from 'next/font/google'
import { Partytown } from '@builder.io/partytown/react'
import Providers from '@/components/Providers'
import PartytownScripts from '@/components/PartytownScripts'
import HreflangLinks from '@/components/HreflangLinks'
import { headers } from 'next/headers'
import '@/index.css'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['500'],
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'Times New Roman', 'serif'],
  variable: '--font-playfair',
  adjustFontFallback: true,
})

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  title: 'My notary - Notarize and Apostille Your Documents 100% Online',
  description: 'Notarize and apostille your documents 100% online. Secure, legally valid, and recognized internationally through the Hague Convention. Book your appointment in minutes.',
  icons: {
    icon: '/favicon.svg?v=2',
    apple: '/favicon.svg?v=2',
  },
}

export default async function RootLayout({ children }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || '/'

  return (
    <html lang="en" suppressHydrationWarning className={playfairDisplay.variable}>
      <head>
        <HreflangLinks pathname={pathname} />

        {/* CSS critique above-the-fold : uniquement Navbar + Banner + Hero (pas de classes Tailwind utilitaires) */}
        <style dangerouslySetInnerHTML={{
          __html: `
            *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
            html{font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;scroll-behavior:smooth;overflow-x:hidden}
            body{font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;overflow-x:hidden;background:#ffffff;color:#111827;line-height:1.5;position:relative}
            h1,h2{font-family:var(--font-playfair,Georgia,'Times New Roman',serif);font-weight:500}
            h3,h4,h5,h6{font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-weight:500}
            a{color:inherit;text-decoration:none}
            img{max-width:100%;height:auto;display:block}
            button{font:inherit;cursor:pointer;border:none;background:none}

            /* Hero — flex-direction NON forcé ici : géré par Tailwind (flex-col / lg:flex-row selon la page) */
            [data-hero]{margin-top:80px;padding-top:0;margin-bottom:0;padding-bottom:0;min-height:calc(100vh - 80px);display:flex;contain:layout style}
            [data-hero]>div{flex:1;width:100%;position:relative;display:flex;flex-direction:column}
            @media(min-width:640px){[data-hero]{margin-top:82px;min-height:calc(100vh - 82px)}}
            @media(min-width:768px){[data-hero]{min-height:calc(100vh - 96px)!important;margin-top:96px;margin-bottom:0;padding-bottom:0}}
            @media(min-width:1024px){[data-hero]{min-height:calc(100vh - 106px)!important;margin-top:106px}}
            @media(min-width:1280px){[data-hero]{min-height:calc(100vh - 116px)!important;margin-top:116px}}
            :root{--hero-image-display:none}
            @media(min-width:768px){:root{--hero-image-display:flex}}

            /* Top Banner */
            .top-banner-container{position:fixed;top:0;left:0;right:0;z-index:51;background-color:#000000}
            .top-banner-inner{padding:8px 0;background-color:#000000;line-height:1.5;min-height:34px;display:flex;align-items:center}

            /* Navbar */
            .navbar-container{position:fixed;top:34px;left:0;right:0;z-index:50;padding:0!important;margin:0!important;background-color:transparent;contain:layout;transform:translateY(-1px)}
            .navbar-inner{border-radius:0!important;height:48px;display:flex;align-items:center;background:#ffffff;box-shadow:0 1px 2px 0 rgba(0,0,0,0.05)}
            .navbar-inner-menu-open{background:transparent!important;box-shadow:none!important}
            .navbar-burger{display:flex}
            .navbar-desktop{display:none}
            @media(min-width:768px){
              .navbar-container{top:36px;padding:0;transform:translateY(-1px)}
              .navbar-inner{border-radius:0;height:80px;background:#ffffff;box-shadow:0 1px 2px 0 rgba(0,0,0,0.05)}
              .navbar-burger{display:none!important}
              .navbar-desktop{display:flex!important}
            }

            /* CTA Button */
            .primary-cta,.glassy-cta{display:inline-flex!important;flex-direction:row!important;align-items:center!important;gap:8px!important;white-space:nowrap!important;padding:12px 24px;background:#000;color:#fff;font-weight:500;border-radius:8px;text-decoration:none;max-width:none!important}
            .glassy-cta{background:rgba(0,0,0,0.8);box-shadow:0 8px 32px rgba(0,0,0,0.3)}
            .nav-link{color:#374151;font-weight:500;transition:color 0.2s}
            .nav-link:hover{color:#000}
            .mobile-cta-sticky{position:fixed!important;bottom:0!important;left:0!important;right:0!important;width:100%!important;z-index:9999!important;contain:none!important}
            nav{contain:layout}
            footer{contain:layout style;min-height:380px}
            @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:0.01ms!important;transition-duration:0.01ms!important}}
          `
        }} />

        <link rel="preconnect" href="https://jlizwheftlnhoifbqeex.supabase.co" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://imagedelivery.net" crossOrigin="anonymous" />

        {/* Preload hero LCP — f=auto laisse Cloudflare choisir le format optimal, pas de type MIME fixe */}
        <link rel="preload" as="image" href="https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/0c55cf3b-5ec9-4302-dcb8-717ddc084600/w=1920,q=80,f=auto" fetchPriority="high" media="(min-width: 768px)" />
        <link rel="preload" as="image" href="https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/0c55cf3b-5ec9-4302-dcb8-717ddc084600/w=750,q=70,f=auto" fetchPriority="high" media="(max-width: 767px)" />

        <meta name="theme-color" content="#000000" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

        {/* dataLayer init avant GTM */}
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || [];` }} />

        {/* Partytown — désactivé en dev (son SW intercepte les requêtes) */}
        {process.env.NODE_ENV !== 'development' && (
          <Partytown debug={false} forward={['dataLayer.push', 'gtag', 'plausible']} />
        )}
      </head>
      <body suppressHydrationWarning style={{ margin: 0, padding: 0 }}>
        {/* GTM noscript fallback */}
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PSHQGM2J" height="0" width="0" style={{display:'none',visibility:'hidden'}} />
        </noscript>

        {/* Scripts tiers (GTM, Clarity, Plausible, Crisp, Segment) — tous afterInteractive ou via Partytown */}
        <PartytownScripts />

        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
