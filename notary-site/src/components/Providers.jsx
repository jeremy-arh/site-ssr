'use client'

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

function ProvidersContent({ children }) {
  useScrollAnimation()

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1" style={{ contain: 'content' }}>
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

export default function Providers({ children }) {
  return (
    <CurrencyProvider>
      <LanguageProvider>
        <ProvidersContent>{children}</ProvidersContent>
      </LanguageProvider>
    </CurrencyProvider>
  )
}

