'use client'

import { useState, useEffect, useRef } from 'react'

/**
 * Composant wrapper pour afficher un composant uniquement quand il devient visible
 * Utilise Intersection Observer pour différer le rendu jusqu'à ce que l'élément soit proche du viewport
 * Le chargement du chunk JS est déjà géré par next/dynamic, ce composant contrôle juste l'affichage
 */
export default function LazyLoad({ 
  children, 
  fallback = null, 
  rootMargin = '200px', // Commencer à charger 200px avant que l'élément soit visible
  threshold = 0.01,
  sectionId = null // ID de la section pour permettre le forçage du rendu
}) {
  const [shouldRender, setShouldRender] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    // Si IntersectionObserver n'est pas supporté, charger immédiatement
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setShouldRender(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldRender(true)
            // Une fois rendu, on peut arrêter d'observer
            if (ref.current) {
              observer.unobserve(ref.current)
            }
          }
        })
      },
      {
        rootMargin,
        threshold,
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    // Écouter les événements personnalisés pour forcer le rendu
    const handleForceRender = () => {
      setShouldRender(true)
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }

    if (sectionId && typeof window !== 'undefined') {
      window.addEventListener(`force-render-${sectionId}`, handleForceRender)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
      if (sectionId && typeof window !== 'undefined') {
        window.removeEventListener(`force-render-${sectionId}`, handleForceRender)
      }
    }
  }, [rootMargin, threshold, sectionId])

  return (
    <div ref={ref} data-lazy-section={sectionId || undefined}>
      {shouldRender ? children : fallback}
    </div>
  )
}

