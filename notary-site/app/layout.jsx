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
        <link rel="preconnect" href="https://imagedelivery.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://jlizwheftlnhoifbqeex.supabase.co" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.iconify.design" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://plausible.io" />
        <link rel="dns-prefetch" href="https://client.crisp.chat" />
        <link rel="icon" type="image/svg+xml" href="/src/assets/favicon.svg" />
        <link rel="apple-touch-icon" href="/src/assets/favicon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="preload" as="image" href="https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/d0f6bfc4-a8db-41e1-87e2-7c7e0b7a1c00/q=20,f=webp" fetchPriority="high" media="(min-width: 769px)" />
        <link rel="preload" as="image" href="https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/d0f6bfc4-a8db-41e1-87e2-7c7e0b7a1c00/w=800,q=20,f=webp" fetchPriority="high" media="(max-width: 768px)" />
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=optional" as="style" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=optional" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              var gtmLoaded = false;
              function loadGTM() {
                if (gtmLoaded) return;
                gtmLoaded = true;
                var gtm = document.createElement('script');
                gtm.async = true;
                gtm.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-MR7JDNSD';
                document.head.appendChild(gtm);
              }
              var interactionEvents = ['scroll', 'click', 'keydown', 'touchstart', 'mousedown'];
              var hasInteracted = false;
              var loadGTMOnInteraction = function() {
                if (!hasInteracted) {
                  hasInteracted = true;
                  loadGTM();
                  interactionEvents.forEach(function(event) {
                    document.removeEventListener(event, loadGTMOnInteraction, { passive: true });
                  });
                }
              };
              interactionEvents.forEach(function(event) {
                document.addEventListener(event, loadGTMOnInteraction, { passive: true, once: true });
              });
              setTimeout(function() {
                if (!gtmLoaded) {
                  loadGTM();
                }
              }, 10000);
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('requestIdleCallback' in window) {
                requestIdleCallback(function() {
                  var script = document.createElement('script');
                  script.defer = true;
                  script.setAttribute('data-domain', 'mynotary.io');
                  script.src = 'https://plausible.io/js/script.js';
                  document.head.appendChild(script);
                }, { timeout: 3000 });
              } else {
                setTimeout(function() {
                  var script = document.createElement('script');
                  script.defer = true;
                  script.setAttribute('data-domain', 'mynotary.io');
                  script.src = 'https://plausible.io/js/script.js';
                  document.head.appendChild(script);
                }, 2000);
              }
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.$crisp=[];
              window.CRISP_WEBSITE_ID="fd0c2560-46ba-4da6-8979-47748ddf247a";
              (function(){
                var d=document;
                var s=d.createElement("script");
                s.src="https://client.crisp.chat/l.js";
                s.async=1;
                d.getElementsByTagName("head")[0].appendChild(s);
              })();
            `,
          }}
        />
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
      </body>
    </html>
  )
}

