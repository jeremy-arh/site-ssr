'use client'

import { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { detectLanguageFromIP, saveLanguageToStorage, getLanguageFromStorage, extractLanguageFromPath, removeLanguageFromPath, addLanguageToPath, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../utils/language'

const LanguageContext = createContext({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  getLocalizedPath: (path) => path,
  isReady: false,
})

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const pathname = usePathname()
  const router = useRouter()
  const hasRedirectedRef = useRef(false)

  // Langue déduite de l'URL uniquement — pas de localStorage (mismatch SSR/client)
  const languageFromPath = useMemo(() => {
    const urlLanguage = extractLanguageFromPath(pathname)
    if (urlLanguage && SUPPORTED_LANGUAGES.includes(urlLanguage)) {
      return urlLanguage
    }
    return DEFAULT_LANGUAGE
  }, [pathname])

  const [isReady, setIsReady] = useState(false)

  // getLocalizedPath mémoïsé sur languageFromPath
  const getLocalizedPath = useCallback((path, lang) => {
    const targetLang = lang || languageFromPath
    const cleanPath = removeLanguageFromPath(path)
    return addLanguageToPath(cleanPath, targetLang)
  }, [languageFromPath])

  // useEffect (pas useLayoutEffect) : compatible SSR, pas de warning Next.js
  useEffect(() => {
    const urlLanguage = extractLanguageFromPath(pathname)

    // Sauvegarder la langue si elle vient de l'URL
    if (urlLanguage && SUPPORTED_LANGUAGES.includes(urlLanguage)) {
      saveLanguageToStorage(urlLanguage)
    }

    setIsReady(true)
    hasRedirectedRef.current = false
  }, [pathname])

  // Après hydratation : appliquer la langue sauvegardée ou détecter via IP
  useEffect(() => {
    const urlLanguage = extractLanguageFromPath(pathname)
    const savedLanguage = getLanguageFromStorage()

    // Langue sauvegardée → rediriger une seule fois (guard anti-boucle)
    if (!urlLanguage && savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage) && !hasRedirectedRef.current) {
      const newPath = getLocalizedPath(pathname, savedLanguage)
      if (newPath !== pathname) {
        hasRedirectedRef.current = true
        router.replace(newPath)
      }
      return
    }

    // Détection IP uniquement si aucune langue connue
    if (!urlLanguage && !savedLanguage) {
      const applyDetectedLanguage = async () => {
        try {
          const detectedLanguage = await detectLanguageFromIP()
          if (detectedLanguage && detectedLanguage !== languageFromPath) {
            saveLanguageToStorage(detectedLanguage)
            if (detectedLanguage !== DEFAULT_LANGUAGE) {
              const newPath = getLocalizedPath(pathname, detectedLanguage)
              if (newPath !== pathname && !hasRedirectedRef.current) {
                hasRedirectedRef.current = true
                router.replace(newPath)
              }
            }
          }
        } catch {
          // Détection IP échouée — conserver la langue par défaut silencieusement
        }
      }

      if ('requestIdleCallback' in window) {
        requestIdleCallback(applyDetectedLanguage, { timeout: 2000 })
      } else {
        setTimeout(applyDetectedLanguage, 1500)
      }
    }
  }, [pathname, languageFromPath, getLocalizedPath, router])

  // Changement de langue via router.push (conserve l'état React, pas de rechargement complet)
  const setLanguage = useCallback((newLanguage) => {
    if (!SUPPORTED_LANGUAGES.includes(newLanguage)) return

    const currentPath = removeLanguageFromPath(pathname)
    const newPath = getLocalizedPath(currentPath, newLanguage)

    saveLanguageToStorage(newLanguage)

    if (newPath !== pathname) {
      router.push(newPath)
    }
  }, [pathname, getLocalizedPath, router])

  return (
    <LanguageContext.Provider value={{
      language: languageFromPath,
      setLanguage,
      getLocalizedPath,
      supportedLanguages: SUPPORTED_LANGUAGES,
      isReady,
    }}>
      {children}
    </LanguageContext.Provider>
  )
}
