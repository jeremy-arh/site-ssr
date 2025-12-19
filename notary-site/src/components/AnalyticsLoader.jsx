'use client'

import { useEffect } from 'react'

/**
 * Composant pour charger les scripts analytics UNIQUEMENT après interaction utilisateur
 * Ne charge RIEN au chargement initial de la page
 */
export default function AnalyticsLoader() {
  useEffect(() => {
    // Vérifier que nous sommes côté client
    if (typeof window === 'undefined') {
      return
    }

    // Ne rien charger au montage - attendre l'interaction utilisateur
    
    let gtmLoaded = false
    let plausibleLoaded = false
    let crispLoaded = false
    let hasInteracted = false

    function loadGTM() {
      if (gtmLoaded) return
      gtmLoaded = true
      window.dataLayer = window.dataLayer || []
      ;(function(w, d, s, l, i) {
        w[l] = w[l] || []
        w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
        var f = d.getElementsByTagName(s)[0],
          j = d.createElement(s),
          dl = l != 'dataLayer' ? '&l=' + l : ''
        j.async = true
        j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl
        f.parentNode.insertBefore(j, f)
      })(window, document, 'script', 'dataLayer', 'GTM-MR7JDNSD')
    }

    function loadPlausible() {
      if (plausibleLoaded) return
      plausibleLoaded = true
      const script = document.createElement('script')
      script.src = 'https://plausible.io/js/script.js'
      script.setAttribute('data-domain', 'mynotary.io')
      script.defer = true
      document.head.appendChild(script)
    }

    function loadCrisp() {
      if (crispLoaded) return
      crispLoaded = true
      window.$crisp = []
      window.CRISP_WEBSITE_ID = 'fd0c2560-46ba-4da6-8979-47748ddf247a'
      const d = document
      const s = d.createElement('script')
      s.src = 'https://client.crisp.chat/l.js'
      s.async = 1
      d.getElementsByTagName('head')[0].appendChild(s)
    }

    function onInteraction() {
      if (!hasInteracted) {
        hasInteracted = true
        
        // Attendre que la page soit complètement chargée et idle avant de charger quoi que ce soit
        // Utiliser requestIdleCallback avec un timeout très long pour vraiment différer
        const loadAfterIdle = () => {
          if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
              // Délais très longs pour vraiment différer - charger après que tout soit rendu
              setTimeout(() => loadGTM(), 5000)      // GTM après 5s d'idle
              setTimeout(() => loadPlausible(), 8000) // Plausible après 8s d'idle
              setTimeout(() => loadCrisp(), 12000)    // Crisp après 12s d'idle
            }, { timeout: 15000 })
          } else {
            // Fallback avec délais très longs
            setTimeout(() => {
              setTimeout(() => loadGTM(), 5000)
              setTimeout(() => loadPlausible(), 8000)
              setTimeout(() => loadCrisp(), 12000)
            }, 8000)
          }
        }
        
        // Attendre que la page soit complètement chargée
        if (document.readyState === 'complete') {
          loadAfterIdle()
        } else {
          window.addEventListener('load', loadAfterIdle, { once: true })
        }
      }
    }

    // Écouter UNIQUEMENT les interactions réelles (pas scroll - trop tôt)
    // Ne charger qu'après un vrai clic ou touch, pas au scroll
    const events = ['click', 'touchstart', 'mousedown']
    events.forEach((event) => {
      window.addEventListener(event, onInteraction, { once: true, passive: true })
    })
    
    // Charger après 20 secondes même sans interaction (pour les analytics, mais vraiment différé)
    setTimeout(() => {
      if (!hasInteracted) {
        onInteraction()
      }
    }, 20000)

    // Nettoyer les listeners si le composant se démonte (ne devrait pas arriver)
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, onInteraction)
      })
    }
  }, [])

  return null // Ce composant ne rend rien
}

