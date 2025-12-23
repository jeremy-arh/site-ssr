'use client'

import Script from 'next/script'

/**
 * Scripts tiers optimisés pour les performances
 * - GTM et Plausible via Partytown (Web Worker) pour ne pas bloquer le thread principal
 * - Crisp chargé directement après interaction (ne fonctionne pas avec Partytown car besoin d'accès au DOM)
 */
export default function PartytownScripts() {
  return (
    <>
      {/* Google Tag Manager - via Partytown */}
      <Script
        id="gtm-script"
        type="text/partytown"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MR7JDNSD');
          `,
        }}
      />

      {/* Plausible Analytics - via Partytown */}
      <Script
        type="text/partytown"
        src="https://plausible.io/js/script.js"
        data-domain="mynotary.io"
      />

      {/* Crisp Chat - chargé directement après interaction (pas via Partytown car besoin d'accès direct au DOM) */}
      <Script
        id="crisp-script"
        strategy="afterInteractive"
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
    </>
  )
}

