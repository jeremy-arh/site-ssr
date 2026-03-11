'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { CurrencyProvider } from '@/contexts/CurrencyContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import Navbar from '@/components/Navbar'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const Footer = dynamic(() => import('@/components/Footer'), {
  ssr: true,
  loading: () => <footer className="bg-gray-900 min-h-[300px]" />
})

const ScrollToTop = dynamic(() => import('@/components/ScrollToTop'), { ssr: false })
const CTAPopup = dynamic(() => import('@/components/CTAPopup'), { ssr: false })
const GclidTracker = dynamic(() => import('@/components/GclidTracker'), { ssr: false })
// SegmentPageTracker gère les page views sur changement de route (analytics.page() déjà retiré du snippet)
const SegmentPageTracker = dynamic(() => import('@/components/SegmentPageTracker'), { ssr: false })

function ProvidersContent({ children }) {
  useScrollAnimation()

  return (
    <>
      <ScrollToTop />
      <GclidTracker />
      <SegmentPageTracker />
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

function useServiceWorker() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

    if (process.env.NODE_ENV === 'development') {
      // En dev : désinscrire tout SW existant pour éviter le cache
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => r.unregister())
      })
      return
    }

    const registerSW = () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then((registration) => {
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                // Nouvelle version disponible — sera activée au prochain rechargement
              })
            }
          })
        })
        .catch(() => {
          // Échec silencieux : le SW est une optimisation, pas une fonctionnalité critique
        })
    }

    const delay = requestIdleCallback
      ? (fn) => requestIdleCallback(fn, { timeout: 3000 })
      : (fn) => setTimeout(fn, 3000)

    if (document.readyState === 'complete') {
      delay(registerSW)
    } else {
      window.addEventListener('load', () => delay(registerSW), { once: true })
    }
  }, [])
}

export default function Providers({ children }) {
  useServiceWorker()

  return (
    <CurrencyProvider>
      <LanguageProvider>
        <ProvidersContent>{children}</ProvidersContent>
      </LanguageProvider>
    </CurrencyProvider>
  )
}
