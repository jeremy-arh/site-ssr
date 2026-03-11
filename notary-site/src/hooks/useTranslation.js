import { useMemo, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../i18n/translations';

// Résout une clé pointée dans un objet de traduction avec fallback anglais
const resolveKey = (obj, keys, fallback, key) => {
  let value = obj;
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return fallback || key;
    }
  }
  return value !== undefined && value !== null ? value : (fallback || key);
};

export const useTranslation = (serverLanguage) => {
  const { language: contextLanguage } = useLanguage();
  const language = serverLanguage || contextLanguage;

  // Objet de traductions pré-fusionné : langue cible avec fallback anglais
  // Recalculé uniquement quand la langue change
  const langTranslations = useMemo(() => {
    return translations[language] || translations['en'];
  }, [language]);

  // t() stable : ne change que si langTranslations ou language change
  const t = useCallback((key, fallback = '') => {
    if (!key || typeof key !== 'string') return fallback || '';
    const keys = key.split('.');
    const result = resolveKey(langTranslations, keys, fallback, key);
    // Fallback anglais si la clé n'existe pas dans la langue cible
    if ((result === fallback || result === key) && language !== 'en') {
      return resolveKey(translations['en'], keys, fallback, key);
    }
    return result;
  }, [langTranslations, language]);

  return { t, language };
};
