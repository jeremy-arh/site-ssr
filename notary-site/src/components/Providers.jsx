'use client'

import { CurrencyProvider } from '@/contexts/CurrencyContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import CTAPopup from '@/components/CTAPopup'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

function ProvidersContent({ children }) {
  useScrollAnimation()

  return (
    <>
      <ScrollToTop />
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

export default function Providers({ children }) {
  return (
    <CurrencyProvider>
      <LanguageProvider>
        <ProvidersContent>{children}</ProvidersContent>
      </LanguageProvider>
    </CurrencyProvider>
  )
}

