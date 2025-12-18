import Script from 'next/script'
import { Playfair_Display } from 'next/font/google'
import Providers from '@/components/Providers'
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
          href="https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/d0f6bfc4-a8db-41e1-87e2-7c7e0b7a1c00/w=1200,q=75,f=avif"
          fetchPriority="high"
          media="(min-width: 768px)"
        />
        <link
          rel="preload"
          as="image"
          href="https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/d0f6bfc4-a8db-41e1-87e2-7c7e0b7a1c00/w=800,q=75,f=avif"
          fetchPriority="high"
          media="(max-width: 767px)"
        />
        
        {/* DNS prefetch pour scripts tiers (chargés en lazy) */}
        <link rel="dns-prefetch" href="https://plausible.io" />
        <link rel="dns-prefetch" href="https://client.crisp.chat" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Favicons */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        
        {/* Meta */}
        <meta name="theme-color" content="#000000" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      </head>
      <body suppressHydrationWarning style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#ffffff', color: '#111827' }}>
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

        {/* GTM - Chargé uniquement après interaction utilisateur (scroll/click) pour ne pas bloquer */}
        <Script id="gtm-loader" strategy="afterInteractive">
          {`
            (function(){
              let gtmLoaded = false;
              function loadGTM() {
                if (gtmLoaded) return;
                gtmLoaded = true;
                window.dataLayer = window.dataLayer || [];
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-MR7JDNSD');
              }
              // Charger après scroll ou après 3 secondes
              let scrolled = false;
              let timeout = setTimeout(loadGTM, 3000);
              window.addEventListener('scroll', function() {
                if (!scrolled) {
                  scrolled = true;
                  clearTimeout(timeout);
                  setTimeout(loadGTM, 500);
                }
              }, { once: true, passive: true });
              window.addEventListener('click', function() {
                if (!scrolled) {
                  scrolled = true;
                  clearTimeout(timeout);
                  loadGTM();
                }
              }, { once: true, passive: true });
            })();
          `}
        </Script>

        {/* Plausible - Chargé après scroll pour ne pas bloquer */}
        <Script id="plausible-loader" strategy="afterInteractive">
          {`
            (function(){
              let plausibleLoaded = false;
              function loadPlausible() {
                if (plausibleLoaded) return;
                plausibleLoaded = true;
                var script = document.createElement('script');
                script.src = 'https://plausible.io/js/script.js';
                script.setAttribute('data-domain', 'mynotary.io');
                script.defer = true;
                document.head.appendChild(script);
              }
              // Charger après scroll ou après 2 secondes
              let scrolled = false;
              let timeout = setTimeout(loadPlausible, 2000);
              window.addEventListener('scroll', function() {
                if (!scrolled) {
                  scrolled = true;
                  clearTimeout(timeout);
                  setTimeout(loadPlausible, 300);
                }
              }, { once: true, passive: true });
            })();
          `}
        </Script>

        {/* Crisp - Chargé après interaction utilisateur */}
        <Script id="crisp-loader" strategy="afterInteractive">
          {`
            (function(){
              let crispLoaded = false;
              function loadCrisp() {
                if (crispLoaded) return;
                crispLoaded = true;
                window.$crisp=[];
                window.CRISP_WEBSITE_ID="fd0c2560-46ba-4da6-8979-47748ddf247a";
                var d=document;
                var s=d.createElement("script");
                s.src="https://client.crisp.chat/l.js";
                s.async=1;
                d.getElementsByTagName("head")[0].appendChild(s);
              }
              // Charger après scroll ou après 5 secondes
              let scrolled = false;
              let timeout = setTimeout(loadCrisp, 5000);
              window.addEventListener('scroll', function() {
                if (!scrolled) {
                  scrolled = true;
                  clearTimeout(timeout);
                  setTimeout(loadCrisp, 1000);
                }
              }, { once: true, passive: true });
              window.addEventListener('click', function() {
                if (!scrolled) {
                  scrolled = true;
                  clearTimeout(timeout);
                  setTimeout(loadCrisp, 500);
                }
              }, { once: true, passive: true });
            })();
          `}
        </Script>
      </body>
    </html>
  )
}
