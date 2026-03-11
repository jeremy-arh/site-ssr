'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { trackChatOpening } from '../utils/gtm'

export default function PartytownScripts() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.trackChatOpeningGTM = (source) => {
        trackChatOpening(source)
      }
    }
  }, [])

  return (
    <>
      {/* Google Tag Manager — afterInteractive pour ne pas bloquer le rendu */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PSHQGM2J');`,
        }}
      />

      {/* Microsoft Clarity — afterInteractive */}
      <Script
        id="clarity-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window,document,"clarity","script","u8hxbk8zh0");`,
        }}
      />

      {/* Plausible Analytics — via Partytown en prod, normal en dev */}
      <Script
        type={process.env.NODE_ENV === 'development' ? 'text/javascript' : 'text/partytown'}
        src="https://plausible.io/js/script.js"
        data-domain="mynotary.io"
      />

      {/* Crisp Chat — afterInteractive, accès direct au DOM requis (incompatible Partytown) */}
      <Script
        id="crisp-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.$crisp = window.$crisp || [];
            window.CRISP_WEBSITE_ID = "fd0c2560-46ba-4da6-8979-47748ddf247a";
            (function(){
              var d = document;
              var s = d.createElement("script");
              s.src = "https://client.crisp.chat/l.js";
              s.async = 1;
              s.defer = 1;
              s.onload = function() {
                var maxChecks = 20;
                var checkCount = 0;
                var interval = setInterval(function() {
                  checkCount++;
                  if (window.$crisp && typeof window.$crisp.push === 'function') {
                    clearInterval(interval);
                    window.$crisp.push(['on', 'chat:opened', function() {
                      if (window.trackChatOpeningGTM) {
                        window.trackChatOpeningGTM('crisp');
                      }
                    }]);
                  } else if (checkCount >= maxChecks) {
                    clearInterval(interval);
                  }
                }, 500);
              };
              d.getElementsByTagName("head")[0].appendChild(s);
            })();
          `,
        }}
      />

      {/* Segment Analytics — afterInteractive */}
      <Script
        id="segment-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `!function(){var i="analytics",analytics=window[i]=window[i]||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","screen","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware","register"];analytics.factory=function(e){return function(){if(window[i].initialized)return window[i][e].apply(window[i],arguments);var n=Array.prototype.slice.call(arguments);if(["track","screen","alias","group","page","identify"].indexOf(e)>-1){var c=document.querySelector("link[rel='canonical']");n.push({__t:"bpc",c:c&&c.getAttribute("href")||void 0,p:location.pathname,u:location.href,s:location.search,t:document.title,r:document.referrer})}n.unshift(e);analytics.push(n);return analytics}};for(var n=0;n<analytics.methods.length;n++){var key=analytics.methods[n];analytics[key]=analytics.factory(key)}analytics.load=function(key,n){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.setAttribute("data-global-segment-analytics-key",i);t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r);analytics._loadOptions=n};analytics._writeKey="${process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY || '7SLHDgCNGrIFhrJpmRdE5dE5DHbdab9m'}";;analytics.SNIPPET_VERSION="5.2.0";
            analytics.load("${process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY || '7SLHDgCNGrIFhrJpmRdE5dE5DHbdab9m'}");
            }}();`,
        }}
      />
    </>
  )
}
