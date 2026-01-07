import { Playfair_Display } from 'next/font/google'
import Script from 'next/script'
import { Partytown } from '@builder.io/partytown/react'
import Providers from '@/components/Providers'
import PartytownScripts from '@/components/PartytownScripts'
// CSS principal - Next.js le charge, mais on va optimiser avec plus de CSS critique inline
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
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={playfairDisplay.variable}>
      <head>
        {/* CSS Critique inline COMPLET pour above-the-fold - élimine le render-blocking */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Reset & Base */
            *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
            html{font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;scroll-behavior:smooth}
            body{font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;overflow-x:hidden;background:#ffffff;color:#111827;line-height:1.5}
            h1,h2{font-family:var(--font-playfair,Georgia,'Times New Roman',serif);font-weight:500}
            h3,h4,h5,h6{font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-weight:500}
            a{color:inherit;text-decoration:none}
            img{max-width:100%;height:auto;display:block}
            button{font:inherit;cursor:pointer;border:none;background:none}
            
            /* Layout utilities */
            .flex{display:flex}.inline-flex{display:inline-flex}.hidden{display:none}.block{display:block}
            .flex-col{flex-direction:column}.flex-row{flex-direction:row}
            .items-center{align-items:center}.items-start{align-items:flex-start}
            .justify-center{justify-content:center}.justify-between{justify-content:space-between}
            .flex-1{flex:1 1 0%}.flex-shrink-0{flex-shrink:0}.flex-none{flex:none}
            .w-full{width:100%}.h-full{height:100%}.min-h-screen{min-height:100vh}
            .max-w-7xl{max-width:80rem}.max-w-3xl{max-width:48rem}.max-w-2xl{max-width:42rem}
            .mx-auto{margin-left:auto;margin-right:auto}
            .relative{position:relative}.absolute{position:absolute}.fixed{position:fixed}
            .inset-0{top:0;right:0;bottom:0;left:0}.z-10{z-index:10}.z-50{z-index:50}.z-60{z-index:60}
            .top-0{top:0}.left-0{left:0}.right-0{right:0}.bottom-0{bottom:0}
            .translate-y-0{transform:translateY(0)}.translate-y-full{transform:translateY(100%)}
            .transition-transform{transition-property:transform;transition-timing-function:cubic-bezier(0.4,0,0.2,1)}.duration-300{transition-duration:300ms}
            .mobile-cta-sticky{position:fixed!important;bottom:0!important;left:0!important;right:0!important;width:100%!important;z-index:9999!important;contain:none!important}
            .overflow-hidden{overflow:hidden}.overflow-visible{overflow:visible}
            
            /* Spacing */
            .p-6{padding:1.5rem}.px-6{padding-left:1.5rem;padding-right:1.5rem}.py-3{padding-top:0.75rem;padding-bottom:0.75rem}.py-16{padding-top:4rem;padding-bottom:4rem}
            .mb-4{margin-bottom:1rem}.mb-6{margin-bottom:1.5rem}.mb-8{margin-bottom:2rem}
            .mt-6{margin-top:1.5rem}.mt-8{margin-top:2rem}
            .gap-2{gap:0.5rem}.gap-3{gap:0.75rem}.gap-8{gap:2rem}
            
            /* Typography */
            .text-sm{font-size:0.875rem;line-height:1.25rem}.text-base{font-size:1rem;line-height:1.5rem}.text-lg{font-size:1.125rem;line-height:1.75rem}
            .text-4xl{font-size:2.25rem;line-height:2.5rem}.text-5xl{font-size:3rem;line-height:1}.text-6xl{font-size:3.75rem;line-height:1}
            .font-medium{font-weight:500}.font-semibold{font-weight:600}.font-bold{font-weight:700}
            .leading-tight{line-height:1.25}.leading-relaxed{line-height:1.625}
            .text-white{color:#fff}.text-gray-900{color:#111827}
            .text-white\\/90{color:rgba(255,255,255,0.9)}
            .whitespace-nowrap{white-space:nowrap}
            
            /* Colors & Backgrounds */
            .bg-white{background-color:#fff}.bg-black{background-color:#000}
            .bg-blue-600{background-color:#2563eb}.bg-blue-700{background-color:#1d4ed8}
            .bg-black\\/60{background:rgba(0,0,0,0.6)}
            .bg-gray-50{background-color:#f9fafb}.bg-gray-100{background-color:#f3f4f6}.bg-gray-900{background-color:#111827}
            
            /* Borders & Radius */
            .rounded-lg{border-radius:0.5rem}.rounded-2xl{border-radius:1rem}.rounded-3xl{border-radius:1.5rem}.rounded-full{border-radius:9999px}
            .border{border-width:1px}.border-gray-200{border-color:#e5e7eb}
            
            /* Shadows */
            .shadow-sm{box-shadow:0 1px 2px 0 rgba(0,0,0,0.05)}
            .shadow-lg{box-shadow:0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05)}
            .shadow-2xl{box-shadow:0 25px 50px -12px rgba(0,0,0,0.25)}
            
            /* Transitions */
            .transition-all{transition-property:all;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:150ms}
            .duration-300{transition-duration:300ms}.duration-500{transition-duration:500ms}
            
            /* Object fit */
            .object-cover{object-fit:cover}
            
            /* Hero section */
            [data-hero]{margin-top:82px;padding-top:0;margin-bottom:0;padding-bottom:0;min-height:calc(100vh - 82px);height:calc(100vh - 82px);position:relative;contain:layout style paint}
            @media(min-width:768px){[data-hero]{height:calc(100vh - 116px)!important;min-height:calc(100vh - 116px)!important;max-height:calc(100vh - 116px)!important;margin-top:116px;margin-bottom:0;padding-bottom:0}}
            
            /* Hero right image - hidden on mobile, visible on desktop via CSS variable */
            :root{--hero-image-display:none}
            @media(min-width:768px){:root{--hero-image-display:flex}}
            
            /* Top Banner */
            .top-banner-container{position:fixed;top:0;left:0;right:0;z-index:51;background-color:#000000}
            .top-banner-inner{padding:8px 0;background-color:#000000;line-height:1.5;min-height:34px;display:flex;align-items:center}
            
            /* Navbar - Mobile */
            .navbar-container{position:fixed;top:34px;left:0;right:0;z-index:50;padding:0!important;margin:0!important;background-color:transparent;contain:layout;transform:translateY(-1px)}
            .navbar-inner{border-radius:0!important;height:48px;display:flex;align-items:center;background:#ffffff;box-shadow:0 1px 2px 0 rgba(0,0,0,0.05)}
            .navbar-inner-menu-open{background:transparent!important;box-shadow:none!important}
            .navbar-burger{display:flex}
            .navbar-desktop{display:none}
            
            /* Navbar - Desktop */
            @media(min-width:768px){
              .navbar-container{top:36px;padding:0;transform:translateY(-1px)}
              .navbar-inner{border-radius:0;height:80px;background:#ffffff;box-shadow:0 1px 2px 0 rgba(0,0,0,0.05)}
              .navbar-burger{display:none!important}
              .navbar-desktop{display:flex!important}
              .md\\:hidden{display:none!important}
              .md\\:flex{display:flex!important}
              .md\\:block{display:block!important}
              .md\\:grid{display:grid!important}
            }
            
            /* CTA Button */
            .primary-cta,.glassy-cta{display:inline-flex!important;flex-direction:row!important;align-items:center!important;gap:8px!important;white-space:nowrap!important;padding:12px 24px;background:#000;color:#fff;font-weight:500;border-radius:8px;text-decoration:none}
            .glassy-cta{background:rgba(0,0,0,0.8);box-shadow:0 8px 32px rgba(0,0,0,0.3)}
            
            /* Responsive text */
            @media(min-width:640px){.sm\\:text-lg{font-size:1.125rem}.sm\\:text-5xl{font-size:3rem}.sm\\:px-12{padding-left:3rem;padding-right:3rem}}
            @media(min-width:1024px){.lg\\:block{display:block!important}.lg\\:flex{display:flex!important}.lg\\:flex-none{flex:none!important}.lg\\:w-1\\/2{width:50%}.lg\\:text-6xl{font-size:3.75rem}.lg\\:text-base{font-size:1rem}.lg\\:px-16{padding-left:4rem;padding-right:4rem}.lg\\:px-5{padding-left:1.25rem;padding-right:1.25rem}.lg\\:pt-\\[90px\\]{padding-top:90px}.lg\\:rounded-3xl{border-radius:1.5rem}.lg\\:min-h-0{min-height:0}.lg\\:h-\\[calc\\(100vh-110px\\)\\]{height:calc(100vh - 110px)}.lg\\:flex-row{flex-direction:row}.lg\\:items-center{align-items:center}.lg\\:gap-8{gap:2rem}.lg\\:mb-6{margin-bottom:1.5rem}.lg\\:mb-8{margin-bottom:2rem}.lg\\:mb-12{margin-bottom:3rem}.lg\\:mt-8{margin-top:2rem}.lg\\:w-6{width:1.5rem}.lg\\:h-6{height:1.5rem}}
            
            /* Utility for nav links */
            .nav-link{color:#374151;font-weight:500;transition:color 0.2s}
            .nav-link:hover{color:#000}
            
            /* Performance: contain - Note: ne pas appliquer contain sur .fixed car cela casse position:fixed */
            nav{contain:layout}
            footer{contain:layout style;min-height:380px}
            
            /* Reduce motion */
            @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:0.01ms!important;transition-duration:0.01ms!important}}
          `
        }} />
        
        {/* Script pour rendre le CSS non-bloquant (print media trick) */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function(){
              // Observer les nouveaux link[rel=stylesheet] ajoutés par Next.js
              var defined = false;
              function makeNonBlocking(link) {
                if (link.getAttribute('data-non-blocking')) return;
                link.setAttribute('data-non-blocking', 'true');
                var media = link.media;
                link.media = 'print';
                link.onload = function() {
                  link.media = media || 'all';
                };
              }
              // Traiter les links existants
              document.querySelectorAll('link[rel="stylesheet"]').forEach(makeNonBlocking);
              // Observer les nouveaux links
              if (typeof MutationObserver !== 'undefined') {
                new MutationObserver(function(mutations) {
                  mutations.forEach(function(m) {
                    m.addedNodes.forEach(function(node) {
                      if (node.tagName === 'LINK' && node.rel === 'stylesheet') {
                        makeNonBlocking(node);
                      }
                    });
                  });
                }).observe(document.head, { childList: true });
              }
            })();
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
        
        {/* Meta */}
        <meta name="theme-color" content="#000000" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PSHQGM2J');`
        }} />
        {/* End Google Tag Manager */}
        
        {/* Microsoft Clarity */}
        <script type="text/javascript" dangerouslySetInnerHTML={{
          __html: `
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "u8hxbk8zh0");
          `
        }} />
        {/* End Microsoft Clarity */}
        
        {/* Partytown - Déplace les scripts tiers vers un Web Worker */}
        <Partytown
          debug={false}
          forward={['dataLayer.push', 'gtag', '$crisp.push', 'plausible']}
        />
      </head>
      <body suppressHydrationWarning style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#ffffff', color: '#111827' }}>
        {/* Google Tag Manager (noscript) */}
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PSHQGM2J"
height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>
        {/* End Google Tag Manager (noscript) */}
        
        {/* Scripts tiers via Partytown (Web Worker) - ZERO impact sur le thread principal */}
        <PartytownScripts />
        
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
