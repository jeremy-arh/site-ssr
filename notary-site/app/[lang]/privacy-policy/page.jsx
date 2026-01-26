import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/utils/language'
import { permanentRedirect } from 'next/navigation'
import PrivacyPolicyClient from '../../privacy-policy/PrivacyPolicyClient'

// Métadonnées - page légale exclue du sitemap et noindex
// eslint-disable-next-line react-refresh/only-export-components
export async function generateMetadata({ params }) {
  const { lang } = await params
  return {
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `https://www.mynotary.io/${lang}/privacy-policy`,
      languages: {
        'x-default': 'https://www.mynotary.io/privacy-policy',
        'en': 'https://www.mynotary.io/privacy-policy',
        'fr': 'https://www.mynotary.io/fr/privacy-policy',
        'es': 'https://www.mynotary.io/es/privacy-policy',
        'de': 'https://www.mynotary.io/de/privacy-policy',
        'it': 'https://www.mynotary.io/it/privacy-policy',
        'pt': 'https://www.mynotary.io/pt/privacy-policy',
      },
    },
  }
}

export default async function LangPrivacyPolicy({ params }) {
  const { lang } = await params

  if (!SUPPORTED_LANGUAGES.includes(lang) || lang === DEFAULT_LANGUAGE) {
    permanentRedirect('/privacy-policy')
  }

  return <PrivacyPolicyClient serverLanguage={lang} />
}
