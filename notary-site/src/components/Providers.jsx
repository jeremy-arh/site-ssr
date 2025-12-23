'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { CurrencyProvider } from '@/contexts/CurrencyContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import Navbar from '@/components/Navbar'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

// Lazy load composants non-critiques pour réduire le TBT
// Footer est toujours below-the-fold
const Footer = dynamic(() => import('@/components/Footer'), { 
  ssr: true, // Garder SSR pour SEO
  loading: () => <footer className="bg-gray-900 min-h-[300px]" /> // Placeholder pour éviter CLS
})

// Ces composants ne sont jamais visibles au premier rendu
const ScrollToTop = dynamic(() => import('@/components/ScrollToTop'), { ssr: false })
const CTAPopup = dynamic(() => import('@/components/CTAPopup'), { ssr: false })
const GclidTracker = dynamic(() => import('@/components/GclidTracker'), { ssr: false })

function ProvidersContent({ children }) {
  useScrollAnimation()

  return (
    <>
      <ScrollToTop />
      <GclidTracker />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <CTAPopup />
      </div>
    </>
  )
}

// NOTE: Les scripts analytics (GTM, Plausible, Crisp) sont maintenant chargés
// via Partytown dans layout.jsx avec strategy="worker" pour exécution dans un Web Worker

// Service Worker pour cache des images - enregistrement différé
function useServiceWorker() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

    // Enregistrer après le chargement complet de la page (ne pas bloquer le LCP)
    const registerSW = () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then((registration) => {
          // Mise à jour automatique en arrière-plan
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Nouvelle version disponible - activer au prochain refresh
                  console.log('[SW] Nouvelle version disponible')
                }
              })
            }
          })
        })
        .catch((error) => {
          console.warn('[SW] Erreur d\'enregistrement:', error)
        })
    }

    // Attendre que la page soit complètement chargée
    if (document.readyState === 'complete') {
      // Différer encore plus pour ne pas impacter les métriques
      requestIdleCallback ? requestIdleCallback(registerSW) : setTimeout(registerSW, 3000)
    } else {
      window.addEventListener('load', () => {
        requestIdleCallback ? requestIdleCallback(registerSW) : setTimeout(registerSW, 3000)
      }, { once: true })
    }
  }, [])
}

export default function Providers({ children }) {
  // Enregistrer le Service Worker pour cache des images
  useServiceWorker()

  return (
    <CurrencyProvider>
      <LanguageProvider>
        <ProvidersContent>{children}</ProvidersContent>
      </LanguageProvider>
    </CurrencyProvider>
  )
}

