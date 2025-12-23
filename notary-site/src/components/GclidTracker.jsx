'use client'

import { useEffect } from 'react'
import { useGclid } from '../hooks/useGclid'

/**
 * Composant pour tracker le gclid automatiquement
 * Ce composant capture le gclid et le pousse vers Google Tag Manager
 * Ajoutez-le dans votre layout principal pour un tracking automatique
 */
export default function GclidTracker() {
  const gclid = useGclid()

  useEffect(() => {
    if (gclid) {
      // Envoyer le gclid à Google Tag Manager si disponible
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'gclid_captured',
          gclid: gclid,
          timestamp: new Date().toISOString()
        })
      }

      // Log en développement (vérifie si on est en localhost)
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        console.log('GCLID capturé:', gclid)
      }
    }
  }, [gclid])

  // Ce composant ne rend rien visuellement
  return null
}

