'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { detectLanguageFromIP, saveLanguageToStorage, getLanguageFromStorage, extractLanguageFromPath, removeLanguageFromPath, addLanguageToPath, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../utils/language'

const LanguageContext = createContext({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  getLocalizedPath: (path) => path, // Retourne le path par défaut
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
  
  // Toujours initialiser avec DEFAULT_LANGUAGE pour éviter les erreurs d'hydratation
  // La vraie langue sera chargée après le montage
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE)
  const [isReady, setIsReady] = useState(false)

  // Fonction pour obtenir le path localisé
  const getLocalizedPath = useCallback((path, lang) => {
    const targetLang = lang || language
    // Retire la langue actuelle du path
    const cleanPath = removeLanguageFromPath(path)
    
    // Ajoute la nouvelle langue si ce n'est pas 'en'
    return addLanguageToPath(cleanPath, targetLang)
  }, [language])

  // Charger la vraie langue APRÈS le montage (évite les erreurs d'hydratation)
  useEffect(() => {
    // 1) Langue dans l'URL
    const urlLanguage = extractLanguageFromPath(pathname)
    if (urlLanguage && SUPPORTED_LANGUAGES.includes(urlLanguage)) {
      setLanguageState(urlLanguage)
      saveLanguageToStorage(urlLanguage)
      setIsReady(true)
      return
    }
    
    // 2) Langue sauvegardée
    const savedLanguage = getLanguageFromStorage()
    if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
      setLanguageState(savedLanguage)
      setIsReady(true)
      return
    }
    
    // 3) Rester sur la langue par défaut
    setIsReady(true)

    // 4) Détection IP différée uniquement si rien en cache
    const applyDetectedLanguage = async () => {
      try {
        const detectedLanguage = await detectLanguageFromIP()
        if (detectedLanguage && detectedLanguage !== language) {
          setLanguageState(detectedLanguage)
          saveLanguageToStorage(detectedLanguage)
          if (detectedLanguage !== DEFAULT_LANGUAGE) {
            const newPath = getLocalizedPath(pathname, detectedLanguage)
            if (newPath !== pathname) {
              router.replace(newPath)
            }
          }
        }
      } catch (error) {
        console.warn('Error detecting language from IP:', error)
      }
    }

    if ('requestIdleCallback' in window) {
      requestIdleCallback(applyDetectedLanguage, { timeout: 2000 })
    } else {
      setTimeout(applyDetectedLanguage, 1500)
    }
  }, []) // Seulement au montage initial

  // Met à jour la langue quand l'URL change
  useEffect(() => {
    const urlLanguage = extractLanguageFromPath(pathname)
    if (urlLanguage !== language && SUPPORTED_LANGUAGES.includes(urlLanguage)) {
      setLanguageState(urlLanguage)
      saveLanguageToStorage(urlLanguage)
    }
  }, [pathname, language]) // Inclure language pour éviter les warnings

  // Fonction pour changer la langue
  const setLanguage = (newLanguage) => {
    if (!SUPPORTED_LANGUAGES.includes(newLanguage)) {
      console.warn(`Language ${newLanguage} is not supported`)
      return
    }

    setLanguageState(newLanguage)
    saveLanguageToStorage(newLanguage)

    // Met à jour l'URL avec la nouvelle langue
    const currentPath = removeLanguageFromPath(pathname)
    const newPath = getLocalizedPath(currentPath, newLanguage)
    
    // Utiliser replace au lieu de push pour éviter d'ajouter une entrée dans l'historique
    if (newPath !== pathname) {
      router.replace(newPath)
    }
  }

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      getLocalizedPath,
      supportedLanguages: SUPPORTED_LANGUAGES,
      isReady,
    }}>
      {children}
    </LanguageContext.Provider>
  )
}
