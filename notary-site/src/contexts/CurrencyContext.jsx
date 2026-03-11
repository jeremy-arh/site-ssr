'use client'

import { createContext, useContext, useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { initializeCurrency, convertPrice, getCachedCurrency } from '../utils/currency'

const CurrencyContext = createContext({
  currency: 'EUR',
  formatPrice: (price) => Promise.resolve(`${price}€`),
  formatPriceSync: (price) => `${price}€`,
  setCurrency: () => {},
})

// eslint-disable-next-line react-refresh/only-export-components
export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider')
  }
  return context
}

const USER_CURRENCY_KEY = 'user_selected_currency'

const SUPPORTED_CURRENCIES = [
  'EUR', 'USD', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'CNY', 'INR', 'BRL',
  'MXN', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'HRK',
  'RUB', 'TRY', 'ZAR', 'KRW', 'SGD', 'HKD', 'NZD', 'THB', 'MYR', 'PHP',
  'IDR', 'VND'
]

const getCurrencyFromURL = (searchParams) => {
  if (!searchParams) return null
  const urlCurrency = searchParams.get('currency')?.toUpperCase()
  if (urlCurrency && SUPPORTED_CURRENCIES.includes(urlCurrency)) return urlCurrency
  return null
}

function CurrencyProviderInner({ children }) {
  const searchParams = useSearchParams()
  // Toujours EUR au premier rendu pour éviter les erreurs d'hydratation
  const [currency, setCurrencyState] = useState('EUR')
  // Cache de conversion en useRef : pas besoin de re-render pour stocker les conversions
  const conversionCacheRef = useRef({})

  useEffect(() => {
    let cancelled = false

    const urlCurrency = getCurrencyFromURL(searchParams)
    if (urlCurrency) {
      setCurrencyState(urlCurrency)
      localStorage.setItem(USER_CURRENCY_KEY, urlCurrency)
      return
    }

    const savedCurrency = localStorage.getItem(USER_CURRENCY_KEY)
    if (savedCurrency && SUPPORTED_CURRENCIES.includes(savedCurrency)) {
      setCurrencyState(savedCurrency)
      return
    }

    const cached = getCachedCurrency()
    if (cached && SUPPORTED_CURRENCIES.includes(cached)) {
      setCurrencyState(cached)
      return
    }

    // Détection automatique différée — avec cleanup pour éviter les memory leaks
    const runDetection = async () => {
      try {
        const detectedCurrency = await initializeCurrency()
        if (!cancelled && detectedCurrency && SUPPORTED_CURRENCIES.includes(detectedCurrency)) {
          setCurrencyState(detectedCurrency)
        }
      } catch {
        // Détection échouée — conserver EUR silencieusement
      }
    }

    if ('requestIdleCallback' in window) {
      requestIdleCallback(runDetection, { timeout: 2000 })
    } else {
      setTimeout(runDetection, 1500)
    }

    return () => { cancelled = true }
  }, [searchParams])

  const setCurrency = (newCurrency) => {
    if (!SUPPORTED_CURRENCIES.includes(newCurrency)) return
    setCurrencyState(newCurrency)
    conversionCacheRef.current = {} // Vider le cache de conversion
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_CURRENCY_KEY, newCurrency)
    }
  }

  const formatPrice = async (eurPrice) => {
    if (!eurPrice) return ''
    const cacheKey = `${eurPrice}_${currency}`
    if (conversionCacheRef.current[cacheKey]) {
      return conversionCacheRef.current[cacheKey]
    }
    try {
      const converted = await convertPrice(eurPrice, currency)
      const formatted = converted.formatted
      conversionCacheRef.current[cacheKey] = formatted
      return formatted
    } catch {
      return `${eurPrice}€`
    }
  }

  const formatPriceSync = (eurPrice) => {
    if (!eurPrice) return ''
    const cacheKey = `${eurPrice}_${currency}`
    return conversionCacheRef.current[cacheKey] || `${eurPrice}€`
  }

  return (
    <CurrencyContext.Provider value={{ currency, formatPrice, formatPriceSync, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const CurrencyProvider = ({ children }) => (
  <Suspense fallback={
    <CurrencyContext.Provider value={{
      currency: 'EUR',
      formatPrice: async (price) => `${price}€`,
      formatPriceSync: (price) => `${price}€`,
      setCurrency: () => {},
    }}>
      {children}
    </CurrencyContext.Provider>
  }>
    <CurrencyProviderInner>{children}</CurrencyProviderInner>
  </Suspense>
)
