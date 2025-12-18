'use client'

import { createContext, useContext, useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { initializeCurrency, convertPrice, getCachedCurrency } from '../utils/currency'

const CurrencyContext = createContext({
  currency: 'EUR',
  formatPrice: (price) => `${price}€`,
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

// Liste des devises supportées
const SUPPORTED_CURRENCIES = [
  'EUR', 'USD', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'CNY', 'INR', 'BRL',
  'MXN', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'HRK',
  'RUB', 'TRY', 'ZAR', 'KRW', 'SGD', 'HKD', 'NZD', 'THB', 'MYR', 'PHP',
  'IDR', 'VND'
]

// Fonction pour récupérer la devise depuis l'URL (SYNCHRONE)
const getCurrencyFromURL = (searchParams) => {
  if (!searchParams) return null
  
  const urlCurrency = searchParams.get('currency')?.toUpperCase()
  
  if (urlCurrency && SUPPORTED_CURRENCIES.includes(urlCurrency)) {
    return urlCurrency
  }
  return null
}

// Fonction d'initialisation synchrone de la devise
const getInitialCurrency = (searchParams) => {
  // 1) PRIORITÉ: Paramètre URL ?currency=XXX
  const urlCurrency = getCurrencyFromURL(searchParams)
  if (urlCurrency) {
    return urlCurrency
  }
  
  // 2) Choix utilisateur stocké
  if (typeof window !== 'undefined') {
    const savedCurrency = localStorage.getItem(USER_CURRENCY_KEY)
    if (savedCurrency && SUPPORTED_CURRENCIES.includes(savedCurrency)) {
      return savedCurrency
    }
  }
  
  // 3) Cache (uniquement côté client)
  if (typeof window !== 'undefined') {
  const cached = getCachedCurrency()
  if (cached && SUPPORTED_CURRENCIES.includes(cached)) {
    return cached
    }
  }
  
  // 4) Défaut
  return 'EUR'
}

function CurrencyProviderInner({ children }) {
  const searchParams = useSearchParams()
  // Initialisation SYNCHRONE pour éviter le CLS
  const [currency, setCurrencyState] = useState(() => getInitialCurrency(searchParams))
  const [conversionCache, setConversionCache] = useState({})

  // Sauvegarder la devise si elle vient de l'URL
  useEffect(() => {
    const urlCurrency = getCurrencyFromURL(searchParams)
    if (urlCurrency) {
      // Sauvegarder pour les prochaines visites
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_CURRENCY_KEY, urlCurrency)
      }
    }
    
    // Détection différée uniquement si pas de devise définie
    if (!urlCurrency && typeof window !== 'undefined' && !localStorage.getItem(USER_CURRENCY_KEY)) {
      const runDetection = async () => {
        try {
          const detectedCurrency = await initializeCurrency()
          if (detectedCurrency && SUPPORTED_CURRENCIES.includes(detectedCurrency)) {
            setCurrencyState(detectedCurrency)
          }
        } catch (error) {
          console.warn('Error initializing currency:', error)
        }
      }

      if ('requestIdleCallback' in window) {
        requestIdleCallback(runDetection, { timeout: 2000 })
      } else {
        setTimeout(runDetection, 1500)
      }
    }
  }, [searchParams])

  // Function to set currency (called by CurrencySelector)
  const setCurrency = (newCurrency) => {
    if (!SUPPORTED_CURRENCIES.includes(newCurrency)) {
      console.warn(`Currency ${newCurrency} is not supported`)
      return
    }
    setCurrencyState(newCurrency)
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_CURRENCY_KEY, newCurrency)
    }
    // Clear conversion cache when currency changes
    setConversionCache({})
  }

  const formatPrice = async (eurPrice) => {
    if (!eurPrice) return ''
    
    // Check cache first
    const cacheKey = `${eurPrice}_${currency}`
    if (conversionCache[cacheKey]) {
      return conversionCache[cacheKey]
    }

    try {
      const converted = await convertPrice(eurPrice, currency)
      const formatted = converted.formatted
      
      // Cache the result
      setConversionCache(prev => ({
        ...prev,
        [cacheKey]: formatted
      }))
      
      return formatted
    } catch (error) {
      console.warn('Error formatting price:', error)
      return `${eurPrice}€`
    }
  }

  // Synchronous version for immediate use (may return EUR if not converted yet)
  const formatPriceSync = (eurPrice) => {
    if (!eurPrice) return ''
    const cacheKey = `${eurPrice}_${currency}`
    return conversionCache[cacheKey] || `${eurPrice}€`
  }

  return (
    <CurrencyContext.Provider value={{
      currency,
      formatPrice,
      formatPriceSync,
      setCurrency,
    }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const CurrencyProvider = ({ children }) => {
  // Wrapper pour gérer useSearchParams qui nécessite Suspense
  return (
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
}
