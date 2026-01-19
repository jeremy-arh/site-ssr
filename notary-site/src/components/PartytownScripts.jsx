'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { trackChatOpening } from '../utils/gtm'

/**
 * Scripts tiers optimisés pour les performances
 * - GTM et Plausible via Partytown (Web Worker) pour ne pas bloquer le thread principal
 * - Crisp et Segment chargés directement après interaction (ne fonctionnent pas avec Partytown car besoin d'accès au DOM)
 */
export default function PartytownScripts() {
  useEffect(() => {
    console.log('[PartytownScripts] Composant monté');
    
    // Exposer la fonction de tracking du chat pour le code inline
    if (typeof window !== 'undefined') {
      window.trackChatOpeningGTM = (source) => {
        trackChatOpening(source);
      };
    }
    
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
        onLoad={() => {
          console.log('[Crisp] ✅ Script Crisp initialisé');
          
          // Fonction pour configurer le listener d'événement Crisp
          const setupCrispEventListener = () => {
            if (typeof window !== 'undefined' && window.$crisp && typeof window.$crisp.push === 'function') {
              try {
                window.$crisp.push(['on', 'chat:opened', function(){
                  console.log('[Crisp] 📊 Chat ouvert - Envoi événement GTM');
                  // Utiliser la fonction globale exposée
                  if (window.trackChatOpeningGTM) {
                    window.trackChatOpeningGTM('crisp');
                  } else {
                    console.warn('[Crisp] ⚠️ Fonction trackChatOpeningGTM non disponible');
                  }
                }]);
                console.log('[Crisp] ✅ Listener d\'événement chat:opened configuré');
                return true;
              } catch (error) {
                console.error('[Crisp] ❌ Erreur lors de la configuration du listener:', error);
                return false;
              }
            }
            return false;
          };
          
          // Vérifier périodiquement si Crisp est disponible (le script externe peut prendre du temps)
          let checkCount = 0;
          const maxChecks = 20; // 10 secondes max (20 * 500ms)
          let listenerConfigured = false;
          
          const checkInterval = setInterval(() => {
            checkCount++;
            if (typeof window !== 'undefined') {
              const scriptLoaded = document.querySelector('script[src*="client.crisp.chat"]') !== null;
              const crispReady = window.$crisp && typeof window.$crisp.push === 'function';
              
              if (crispReady && scriptLoaded) {
                console.log('[Crisp] ✅ Crisp complètement chargé et prêt');
                
                // Configurer le listener si ce n'est pas déjà fait
                if (!listenerConfigured) {
                  listenerConfigured = setupCrispEventListener();
                }
                
                if (listenerConfigured) {
                  clearInterval(checkInterval);
                }
              } else if (checkCount % 5 === 0) {
                // Log toutes les 5 vérifications
                console.log('[Crisp] Vérification:', {
                  checkCount,
                  scriptLoaded,
                  crispExists: typeof window.$crisp !== 'undefined',
                  crispIsArray: Array.isArray(window.$crisp),
                  crispPushExists: typeof window.$crisp?.push === 'function',
                  crispReady
                });
              }
              
              if (checkCount >= maxChecks) {
                clearInterval(checkInterval);
                console.warn('[Crisp] ⚠️ Crisp n\'est pas complètement chargé après', maxChecks, 'vérifications');
                
                // Dernière tentative pour configurer le listener
                if (!listenerConfigured) {
                  setTimeout(() => {
                    setupCrispEventListener();
                  }, 1000);
                }
              }
            }
          }, 500);
        }}
        onError={(e) => {
          console.error('[Crisp] ❌ Erreur lors du chargement du script:', e);
        }}
        dangerouslySetInnerHTML={{
          __html: `
            (function(){
              // Initialiser Crisp immédiatement
              window.$crisp = window.$crisp || [];
              window.CRISP_WEBSITE_ID = "fd0c2560-46ba-4da6-8979-47748ddf247a";
              
              var d = document;
              var s = d.createElement("script");
              s.src = "https://client.crisp.chat/l.js";
              s.async = 1;
              s.defer = 1;
              
              s.onload = function(){
                console.log('[Crisp] ✅ Script externe chargé avec succès');
                // Vérifier que Crisp est bien initialisé après le chargement
                setTimeout(function(){
                  if (window.$crisp && typeof window.$crisp.push === 'function') {
                    console.log('[Crisp] ✅ Crisp est prêt à être utilisé');
                    
                    // Intercepter l'événement d'ouverture du chat Crisp
                    try {
                window.$crisp.push(['on', 'chat:opened', function(){
                  console.log('[Crisp] 📊 Chat ouvert - Envoi événement GTM');
                  // Utiliser la fonction globale exposée
                  if (window.trackChatOpeningGTM) {
                    window.trackChatOpeningGTM('crisp');
                  } else {
                    console.warn('[Crisp] ⚠️ Fonction trackChatOpeningGTM non disponible');
                  }
                }]);
                      console.log('[Crisp] ✅ Listener d\'événement chat:opened configuré');
                    } catch (error) {
                      console.error('[Crisp] ❌ Erreur lors de la configuration du listener:', error);
                    }
                  } else {
                    console.warn('[Crisp] ⚠️ Crisp chargé mais pas encore initialisé');
                  }
                }, 1000);
              };
              
              s.onerror = function(e){
                console.error('[Crisp] ❌ Erreur lors du chargement du script externe:', e);
              };
              
              // Ajouter le script au head
              var head = d.getElementsByTagName("head")[0];
              if (head) {
                head.appendChild(s);
              } else {
                // Si head n'existe pas encore, attendre que le DOM soit prêt
                d.addEventListener('DOMContentLoaded', function(){
                  d.getElementsByTagName("head")[0].appendChild(s);
                });
              }
            })();
          `,
        }}
      />

      {/* Segment Analytics - chargé directement après interaction (pas via Partytown car besoin d'accès direct au DOM) */}
      <Script
        id="segment-script"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('[Segment] ✅ Script Segment chargé');
          // Vérifier après un court délai si analytics est disponible
          setTimeout(() => {
            if (typeof window !== 'undefined' && window.analytics) {
              console.log('[Segment] Vérification post-chargement:', {
                analyticsExists: typeof window.analytics !== 'undefined',
                analyticsIsObject: typeof window.analytics === 'object',
                analyticsMethods: typeof window.analytics.page === 'function'
              });
            }
          }, 1000);
        }}
        onError={(e) => {
          console.error('[Segment] ❌ Erreur lors du chargement du script:', e);
        }}
        dangerouslySetInnerHTML={{
          __html: `
            !function(){var i="analytics",analytics=window[i]=window[i]||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","screen","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware","register"];analytics.factory=function(e){return function(){if(window[i].initialized)return window[i][e].apply(window[i],arguments);var n=Array.prototype.slice.call(arguments);if(["track","screen","alias","group","page","identify"].indexOf(e)>-1){var c=document.querySelector("link[rel='canonical']");n.push({__t:"bpc",c:c&&c.getAttribute("href")||void 0,p:location.pathname,u:location.href,s:location.search,t:document.title,r:document.referrer})}n.unshift(e);analytics.push(n);return analytics}};for(var n=0;n<analytics.methods.length;n++){var key=analytics.methods[n];analytics[key]=analytics.factory(key)}analytics.load=function(key,n){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.setAttribute("data-global-segment-analytics-key",i);t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r);analytics._loadOptions=n};analytics._writeKey="7SLHDgCNGrIFhrJpmRdE5dE5DHbdab9m";;analytics.SNIPPET_VERSION="5.2.0";
            analytics.load("7SLHDgCNGrIFhrJpmRdE5dE5DHbdab9m");
            analytics.page();
            }}();
          `,
        }}
      />
    </>
  )
}

