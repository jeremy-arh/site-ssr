import { useEffect, useState } from 'react'
import { getGclid, setCookie } from '../utils/cookies'

/**
 * Hook personnalisé pour gérer le gclid (Google Click ID)
 * Ce hook capture automatiquement le gclid depuis l'URL et le stocke dans un cookie
 * @returns {string|null} La valeur actuelle du gclid
 */
export function useGclid() {
  const [gclid, setGclid] = useState(null)

  useEffect(() => {
    // Vérifier si nous sommes côté client
    if (typeof window === 'undefined') {
      return
    }

    // D'abord, essayer de récupérer le gclid depuis les cookies
    let gclidValue = getGclid()

    // Si pas trouvé dans les cookies, vérifier l'URL
    if (!gclidValue) {
      const urlParams = new URLSearchParams(window.location.search)
      gclidValue = urlParams.get('gclid')

      // Si trouvé dans l'URL, le stocker dans un cookie
      // Le domaine sera auto-détecté par setCookie
      if (gclidValue) {
        setCookie('gclid', gclidValue, 90)
      }
    }

    setGclid(gclidValue)
  }, [])

  return gclid
}

