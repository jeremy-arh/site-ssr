import { Playfair_Display } from 'next/font/google'
import Script from 'next/script'
import { Partytown } from '@builder.io/partytown/react'
import Providers from '@/components/Providers'
import PartytownScripts from '@/components/PartytownScripts'
import '@/index.css'

// Optimisation Google Fonts - charger uniquement le poids 500 pour réduire la taille
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['500'], // Un seul poids pour performance maximale
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'Times New Roman', 'serif'],
  variable: '--font-playfair',
  adjustFontFallback: true, // Réduire CLS
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
        {/* CSS Critique inline pour éviter le FOUC - optimisé mobile */}
        <style dangerouslySetInnerHTML={{
          __html: `
            *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
            html{font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
            body{font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;overflow-x:hidden;background:#ffffff;color:#111827}
            h1,h2{font-family:var(--font-playfair,Georgia,'Times New Roman',serif);font-weight:500}
            [data-hero]{min-height:100vh;position:relative;contain:layout style paint}
            img{max-width:100%;height:auto;display:block}
            .navbar-container{position:fixed;top:0;left:0;right:0;z-index:50;padding:10px 10px 0 10px;background-color:transparent;contain:layout}
            .navbar-inner{border-radius:16px;height:56px;display:flex;align-items:center;background:rgba(0,0,0,0.26);box-shadow:0 10px 15px -3px rgba(0,0,0,0.1)}
            .navbar-inner-menu-open{background:transparent!important;box-shadow:none!important}
            @media(min-width:768px){.navbar-container{padding:0}.navbar-inner{border-radius:0;height:80px;background:#FEFEFE;box-shadow:0 1px 2px 0 rgba(0,0,0,0.05)}.navbar-inner-transparent{background:transparent!important;box-shadow:none!important}}
            @media(max-width:767px){.navbar-inner{backdrop-filter:none;-webkit-backdrop-filter:none}}
            .primary-cta{display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;font-weight:500;border-radius:8px;text-decoration:none}
            .flex{display:flex}.items-center{align-items:center}.justify-between{justify-content:space-between}
            .text-white{color:#fff}.bg-black\\/60{background:rgba(0,0,0,0.6)}
          `
        }} />
        
        {/* Preconnect à Supabase (données) et Cloudflare Images (LCP) */}
        <link rel="preconnect" href="https://jlizwheftlnhoifbqeex.supabase.co" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://imagedelivery.net" crossOrigin="anonymous" />
        
        {/* Preload image hero LCP - versions optimisées par device */}
        <link
          rel="preload"
          as="image"
          href="https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/0c55cf3b-5ec9-4302-dcb8-717ddc084600/w=1920,q=80,f=auto"
          fetchPriority="high"
          media="(min-width: 768px)"
          type="image/webp"
        />
        <link
          rel="preload"
          as="image"
          href="https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/0c55cf3b-5ec9-4302-dcb8-717ddc084600/w=750,q=70,f=auto"
          fetchPriority="high"
          media="(max-width: 767px)"
          type="image/webp"
        />
        
        {/* DNS prefetch supprimé pour scripts tiers - chargés uniquement après interaction */}
        
        {/* Favicons */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        
        {/* Meta */}
        <meta name="theme-color" content="#000000" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Partytown - Déplace les scripts tiers vers un Web Worker */}
        <Partytown
          debug={false}
          forward={['dataLayer.push', 'gtag', '$crisp.push']}
        />
      </head>
      <body suppressHydrationWarning style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#ffffff', color: '#111827' }}>
        {/* Noscript GTM - fallback pour navigateurs sans JS */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MR7JDNSD"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        
        {/* Scripts tiers via Partytown (Web Worker) - ZERO impact sur le thread principal */}
        <PartytownScripts />
        
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
