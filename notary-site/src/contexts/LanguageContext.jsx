'use client'

import { createContext, useContext, useState, useEffect, useLayoutEffect, useMemo, useCallback } from 'react'
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
  
  // Calculer la langue directement depuis le pathname pour éviter le flash
  // Utiliser useMemo pour que la langue soit toujours synchronisée avec l'URL
  const languageFromPath = useMemo(() => {
    const urlLanguage = extractLanguageFromPath(pathname)
    if (urlLanguage && SUPPORTED_LANGUAGES.includes(urlLanguage)) {
      return urlLanguage
    }
    // Si pas de langue dans l'URL, vérifier localStorage (côté client uniquement)
    if (typeof window !== 'undefined') {
      const savedLanguage = getLanguageFromStorage()
      if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
        return savedLanguage
      }
    }
    return DEFAULT_LANGUAGE
  }, [pathname])
  
  // Utiliser un state pour la langue, initialisé avec la langue du pathname
  const [language, setLanguageState] = useState(languageFromPath)
  const [isReady, setIsReady] = useState(false)

  // Fonction pour obtenir le path localisé
  const getLocalizedPath = useCallback((path, lang) => {
    const targetLang = lang || languageFromPath
    // Retire la langue actuelle du path
    const cleanPath = removeLanguageFromPath(path)
    
    // Ajoute la nouvelle langue si ce n'est pas 'en'
    return addLanguageToPath(cleanPath, targetLang)
  }, [languageFromPath])

  // Synchroniser le state avec la langue calculée depuis le pathname
  useLayoutEffect(() => {
    if (languageFromPath !== language) {
      setLanguageState(languageFromPath)
    }
    
    // Sauvegarder la langue si elle vient de l'URL
    const urlLanguage = extractLanguageFromPath(pathname)
    if (urlLanguage && SUPPORTED_LANGUAGES.includes(urlLanguage)) {
      saveLanguageToStorage(urlLanguage)
    }
    
    setIsReady(true)
  }, [languageFromPath, language, pathname])

  // Détection IP différée uniquement si pas de langue dans l'URL et pas de langue sauvegardée
  useEffect(() => {
    const urlLanguage = extractLanguageFromPath(pathname)
    const savedLanguage = getLanguageFromStorage()
    
    // Ne faire la détection IP que si aucune langue n'est trouvée
    if (!urlLanguage && !savedLanguage) {
      const applyDetectedLanguage = async () => {
        try {
          const detectedLanguage = await detectLanguageFromIP()
          if (detectedLanguage && detectedLanguage !== languageFromPath) {
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
    }
  }, [pathname, languageFromPath, getLocalizedPath, router])

  // Fonction pour changer la langue
  const setLanguage = useCallback((newLanguage) => {
    if (!SUPPORTED_LANGUAGES.includes(newLanguage)) {
      console.warn(`Language ${newLanguage} is not supported`)
      return
    }

    // Met à jour l'URL avec la nouvelle langue
    const currentPath = removeLanguageFromPath(pathname)
    const newPath = getLocalizedPath(currentPath, newLanguage)
    
    // Sauvegarder la langue avant la navigation
    saveLanguageToStorage(newLanguage)
    
    // Utiliser window.location.href pour forcer un rechargement complet de la page
    // Cela garantit que toutes les données sont rechargées avec la nouvelle langue
    if (newPath !== pathname) {
      window.location.href = newPath
    }
  }, [pathname, getLocalizedPath])

  return (
    <LanguageContext.Provider value={{
      language: languageFromPath, // Utiliser directement languageFromPath pour éviter le flash
      setLanguage,
      getLocalizedPath,
      supportedLanguages: SUPPORTED_LANGUAGES,
      isReady,
    }}>
      {children}
    </LanguageContext.Provider>
  )
}
