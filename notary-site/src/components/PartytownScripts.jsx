'use client'

import { useEffect } from 'react'
import Script from 'next/script'

/**
 * Scripts tiers optimisés pour les performances
 * - GTM et Plausible via Partytown (Web Worker) pour ne pas bloquer le thread principal
 * - Crisp chargé directement après interaction (ne fonctionne pas avec Partytown car besoin d'accès au DOM)
 */
export default function PartytownScripts() {
  useEffect(() => {
    console.log('[PartytownScripts] Composant monté');
    
    // Vérifier l'état initial après le montage
    const checkStatus = () => {
      if (typeof window !== 'undefined') {
        const status = {
          dataLayerExists: typeof window.dataLayer !== 'undefined',
          dataLayerLength: window.dataLayer?.length || 0,
          plausibleExists: typeof window.plausible !== 'undefined',
          plausibleIsFunction: typeof window.plausible === 'function',
          partytownExists: typeof window.partytown !== 'undefined',
          plausibleScriptTag: document.querySelector('script[src*="plausible.io"]') !== null,
          gtmScriptTag: document.querySelector('script[src*="googletagmanager.com/gtm.js"]') !== null
        };
        console.log('[PartytownScripts] État:', status);
        return status;
      }
      return null;
    };
    
    // Vérifier immédiatement
    setTimeout(checkStatus, 500);
    
    // Vérifier périodiquement pendant 10 secondes
    const intervals = [];
    for (let i = 1; i <= 10; i++) {
      intervals.push(setTimeout(checkStatus, i * 1000));
    }
    
    return () => {
      intervals.forEach(clearTimeout);
    };
  }, []);

  return (
    <>
      {/* Google Tag Manager - via Partytown */}
      <Script
        id="gtm-script"
        type="text/partytown"
        onLoad={() => {
          console.log('[GTM] ✅ Script GTM chargé via Partytown');
          // Vérifier après un court délai si dataLayer est disponible
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              console.log('[GTM] Vérification post-chargement:', {
                dataLayerExists: typeof window.dataLayer !== 'undefined',
                dataLayerLength: window.dataLayer?.length || 0,
                dataLayerContent: window.dataLayer?.slice(-3) || []
              });
            }
          }, 1000);
        }}
        onError={(e) => {
          console.error('[GTM] ❌ Erreur lors du chargement du script:', e);
        }}
        dangerouslySetInnerHTML={{
          __html: `
            console.log('[GTM] Initialisation du script GTM...');
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            console.log('[GTM] Script GTM injecté, ID:', i);
            })(window,document,'script','dataLayer','GTM-MR7JDNSD');
          `,
        }}
      />

      {/* Plausible Analytics - via Partytown */}
      <Script
        type="text/partytown"
        src="https://plausible.io/js/script.js"
        data-domain="mynotary.io"
        onLoad={() => {
          console.log('[Plausible] ✅ Script Plausible chargé via Partytown');
          // Vérifier après un court délai si plausible est disponible
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              console.log('[Plausible] Vérification post-chargement:', {
                plausibleExists: typeof window.plausible !== 'undefined',
                plausibleIsFunction: typeof window.plausible === 'function'
              });
            }
          }, 1000);
        }}
        onError={(e) => {
          console.error('[Plausible] ❌ Erreur lors du chargement du script:', e);
        }}
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

