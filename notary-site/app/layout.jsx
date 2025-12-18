import Script from 'next/script'
import Providers from '@/components/Providers'
import '@/index.css'

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  title: 'My notary - Notarize and Apostille Your Documents 100% Online',
  description: 'Notarize and apostille your documents 100% online. Secure, legally valid, and recognized internationally through the Hague Convention. Book your appointment in minutes.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://jlizwheftlnhoifbqeex.supabase.co" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://plausible.io" />
        <link rel="dns-prefetch" href="https://client.crisp.chat" />
        <link rel="icon" type="image/svg+xml" href="/src/assets/favicon.svg" />
        <link rel="apple-touch-icon" href="/src/assets/favicon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=optional" as="style" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=optional" rel="stylesheet" />
      </head>
      <body>
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

        {/* Script de chargement différé des analytics - après interaction ou 3s */}
        <Script id="deferred-analytics" strategy="lazyOnload">
          {`
            (function() {
              var loaded = false;
              function loadAnalytics() {
                if (loaded) return;
                loaded = true;
                
                // GTM
                window.dataLayer = window.dataLayer || [];
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-MR7JDNSD');
                
                // Plausible
                var p = document.createElement('script');
                p.defer = true;
                p.dataset.domain = 'mynotary.io';
                p.src = 'https://plausible.io/js/script.js';
                document.head.appendChild(p);
              }
              
              // Charger après 3 secondes ou à la première interaction
              var timer = setTimeout(loadAnalytics, 3000);
              ['scroll', 'click', 'touchstart', 'mousemove', 'keydown'].forEach(function(evt) {
                window.addEventListener(evt, function handler() {
                  clearTimeout(timer);
                  loadAnalytics();
                  window.removeEventListener(evt, handler);
                }, { once: true, passive: true });
              });
            })();
          `}
        </Script>

        {/* Crisp - chargé séparément car widget visible */}
        <Script id="crisp" strategy="lazyOnload">
          {`
            setTimeout(function() {
              window.$crisp=[];
              window.CRISP_WEBSITE_ID="fd0c2560-46ba-4da6-8979-47748ddf247a";
              var d=document;
              var s=d.createElement("script");
              s.src="https://client.crisp.chat/l.js";
              s.async=1;
              d.head.appendChild(s);
            }, 2000);
          `}
        </Script>
      </body>
    </html>
  )
}
